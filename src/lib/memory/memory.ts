import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { getModel } from "@/lib/graph/llmModels";
import { redis } from "@/lib/redis/redis";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const recentMessageLimit = 12;
const redisTtlSeconds = 60 * 60 * 24 * 30;

const memorySummarySchema = z.object({
  userProfile: z.string(),
  goals: z.array(z.string()),
  preferences: z.array(z.string()),
  importantFacts: z.array(z.string()),
  openQuestions: z.array(z.string()),
});

export type MemorySummary = z.infer<typeof memorySummarySchema>;

export type MemoryMessage = {
  role: "user" | "assistant";
  content: string;
  images?: string[];
};

export type ConversationMemory = {
  summary: MemorySummary;
  recentMessages: MemoryMessage[];
};

const emptySummary: MemorySummary = {
  userProfile: "",
  goals: [],
  preferences: [],
  importantFacts: [],
  openQuestions: [],
};

function memoryKey(userId: string, conversationId: string) {
  return `chat-memory:${userId}:${conversationId}`;
}

function isMissingMemoryTableError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "PGRST205"
  );
}

function parseMemory(value: unknown): ConversationMemory | null {
  if (!value) return null;

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!parsed || typeof parsed !== "object") return null;

    const record = parsed as Partial<ConversationMemory>;
    const summary = memorySummarySchema.safeParse(record.summary);
    if (!summary.success || !Array.isArray(record.recentMessages)) return null;

    return {
      summary: summary.data,
      recentMessages: record.recentMessages.filter(
        (message): message is MemoryMessage =>
          typeof message === "object" &&
          message !== null &&
          ((message as MemoryMessage).role === "user" ||
            (message as MemoryMessage).role === "assistant") &&
          typeof (message as MemoryMessage).content === "string",
      ),
    };
  } catch {
    return null;
  }
}

export async function loadConversationMemory(
  userId: string,
  conversationId: string,
): Promise<ConversationMemory> {
  const key = memoryKey(userId, conversationId);
  const cached = parseMemory(await redis.get(key));
  if (cached) return cached;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("chat_memories")
    .select("summary, recent_messages")
    .eq("user_id", userId)
    .eq("conversation_id", conversationId)
    .maybeSingle();

  if (error) {
    if (isMissingMemoryTableError(error)) {
      console.error(
        "Chat memory tables are missing. Apply supabase/migrations/202608260001_chat_memory.sql.",
      );
    } else {
      throw error;
    }
  }

  const memory = parseMemory({
    summary: data?.summary ?? emptySummary,
    recentMessages: data?.recent_messages ?? [],
  }) ?? { summary: emptySummary, recentMessages: [] };

  await redis.set(key, memory, { ex: redisTtlSeconds });
  return memory;
}

async function summarizeMemory(
  previousSummary: MemorySummary,
  messages: MemoryMessage[],
): Promise<MemorySummary> {
  const llm = await getModel("chat");
  const response = await llm.invoke([
    new SystemMessage(
      "You maintain long-term assistant memory. Return JSON matching this schema exactly: " +
        '{"userProfile":"string","goals":["string"],"preferences":["string"],"importantFacts":["string"],"openQuestions":["string"]}. ' +
        "Keep only durable, user-relevant information. Do not store secrets, credentials, or transient small talk. " +
        "Preserve useful existing facts and remove contradictions. Keep each array concise.",
    ),
    new HumanMessage(
      JSON.stringify({ previousSummary, newMessages: messages }, null, 2),
    ),
  ]);

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);
  const json = content.match(/\{[\s\S]*\}/)?.[0];
  let parsed: ReturnType<typeof memorySummarySchema.safeParse> | null = null;
  if (json) {
    try {
      parsed = memorySummarySchema.safeParse(JSON.parse(json));
    } catch {
      parsed = null;
    }
  }

  return parsed?.success ? parsed.data : previousSummary;
}

export async function saveConversationTurn({
  userId,
  conversationId,
  userMessage,
  assistantMessage,
}: {
  userId: string;
  conversationId: string;
  userMessage: string;
  assistantMessage: string;
  images?: string[];
}) {
  const memory = await loadConversationMemory(userId, conversationId);
  const newMessages: MemoryMessage[] = [
    { role: "user", content: userMessage },
    { role: "assistant", content: assistantMessage },
  ];
  const recentMessages = [...memory.recentMessages, ...newMessages].slice(
    -recentMessageLimit,
  );
  const summary = await summarizeMemory(memory.summary, newMessages);
  const nextMemory = { summary, recentMessages };
  const supabase = await createSupabaseServerClient();

  const { error: messageError } = await supabase.from("chat_messages").insert(
    newMessages.map((message) => ({
      user_id: userId,
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
    })),
  );
  if (messageError) {
    if (isMissingMemoryTableError(messageError)) {
      console.error(
        "Chat message table is missing. Apply supabase/migrations/202608260001_chat_memory.sql.",
      );
      await redis.set(memoryKey(userId, conversationId), nextMemory, {
        ex: redisTtlSeconds,
      });
      return nextMemory;
    }
    throw messageError;
  }

  const { error: memoryError } = await supabase.from("chat_memories").upsert(
    {
      user_id: userId,
      conversation_id: conversationId,
      summary,
      recent_messages: recentMessages,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,conversation_id" },
  );
  if (memoryError) {
    if (!isMissingMemoryTableError(memoryError)) throw memoryError;
    console.error(
      "Chat memory table is missing. Apply supabase/migrations/202608260001_chat_memory.sql.",
    );
  }

  await redis.set(memoryKey(userId, conversationId), nextMemory, {
    ex: redisTtlSeconds,
  });

  return nextMemory;
}
