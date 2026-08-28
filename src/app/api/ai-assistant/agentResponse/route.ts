import { graph } from "@/lib/graph/graph";
import {
  loadConversationMemory,
  saveConversationTurn,
} from "@/lib/memory/memory";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const conversationId =
    req.nextUrl.searchParams.get("conversationId") || user.id;

  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    if (error.code === "PGRST205") {
      return NextResponse.json({ messages: [], conversationId });
    }
    throw error;
  }

  return NextResponse.json({ messages: data ?? [], conversationId });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt =
      typeof body === "string"
        ? body
        : typeof body?.value === "string"
          ? body.value
          : typeof body?.prompt === "string"
            ? body.prompt
            : "";

    if (!prompt.trim()) {
      return NextResponse.json({
        answer: "",
        images: [],
      });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const conversationId = user.id;
    const memory = await loadConversationMemory(user.id, conversationId);

    const result = await graph.invoke({
      prompt,
      aiResponse: "",
      agent: "chat",
      conversationId,
      memorySummary: memory.summary,
      recentMessages: memory.recentMessages,
      searchResults: [],
      images: [],
    });

    const response = typeof result.aiResponse === "string" ? result.aiResponse : "";

    if (response.trim()) {
      await saveConversationTurn({
        userId: user.id,
        conversationId,
        userMessage: prompt,
        assistantMessage: response,
      });
    }

    console.log("chat answer:", response);

    return NextResponse.json({
      answer: response,
      images: result.images ?? [],
      conversationId,
    });

  } catch (error) {
    console.error("agent controller error:", error);
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number(error.status)
        : 0;
    if (status === 413) {
      return NextResponse.json(
        { message: "This request is too large. Please shorten the message and try again." },
        { status: 413 },
      );
    }
    if (status === 429) {
      return NextResponse.json(
        { message: "The AI service is temporarily rate-limited. Please try again in a few seconds." },
        { status: 429 },
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      message: `agent controller error: ${message}`,
    }, { status: 500 });
  }
}
