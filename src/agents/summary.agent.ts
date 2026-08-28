import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { getModel } from "../lib/graph/llmModels";

const summaryResultSchema = z.object({
  summary: z.string().min(1),
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()).max(5),
  improvements: z.array(z.string()).max(5),
});

export type SummaryResult = z.infer<typeof summaryResultSchema>;

function responseText(content: unknown) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
      .join("");
  }
  return JSON.stringify(content);
}

export async function summaryAgent({
  topic,
  transcript,
}: {
  topic: string;
  transcript: Array<{ role: "user" | "assistant"; text: string }>;
}): Promise<SummaryResult> {
  const model = await getModel("summary");
  const response = await model.invoke([
    new SystemMessage(
      "You evaluate a voice conversation. Return only valid JSON with this exact shape: " +
        '{"summary":"string","score":0,"strengths":["string"],"improvements":["string"]}. ' +
        "Score the user's participation, clarity, relevance, and engagement from 0 to 100. " +
        "Be fair when the transcript is short. Do not invent facts. Keep the summary concise, " +
        "and provide practical strengths and improvements. The score must be a number, not a string.",
    ),
    new HumanMessage(
      JSON.stringify({ topic: topic.slice(0, 500), transcript: transcript.slice(-80) }),
    ),
  ]);

  const json = responseText(response.content).match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error("Summary agent returned no JSON.");

  const parsed = summaryResultSchema.safeParse(JSON.parse(json));
  if (!parsed.success) throw new Error("Summary agent returned invalid JSON.");
  return parsed.data;
}