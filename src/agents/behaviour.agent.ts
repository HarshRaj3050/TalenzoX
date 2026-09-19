import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { getModel } from "../lib/graph/llmModels";

const behaviourAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  previousScore: z.number().min(0).max(100),
  improvement: z.number(),
  summary: z.string().min(1).max(500),
  strengths: z.array(z.string().min(1)).max(4),
  improvements: z.array(z.string().min(1)).max(4),
});

export type BehaviourAnalysis = z.infer<typeof behaviourAnalysisSchema>;

type BehaviourResponse = {
  question_number: number;
  question_text: string;
  answer_key: "yes" | "no";
  answer_text: string;
  language: string;
  created_at: string;
};

function responseText(content: unknown) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
      .join("");
  }
  return JSON.stringify(content);
}

export async function behaviourAgent({
  responses,
  currentScore,
  previousScore,
}: {
  responses: BehaviourResponse[];
  currentScore: number;
  previousScore: number;
}): Promise<BehaviourAnalysis> {
  const model = await getModel("behaviour");
  const response = await model.invoke([
    new SystemMessage(
      "You are a warm, concise learning coach for children aged 5-7. " +
        "Analyze behaviour practice answers. Return only valid JSON with this exact shape: " +
        '{"score":0,"previousScore":0,"improvement":0,"summary":"string","strengths":["string"],"improvements":["string"]}. ' +
        "Use the supplied scores exactly. score and previousScore are percentages from 0 to 100; " +
        "improvement is score minus previousScore. Celebrate honest answers without shaming a No answer. " +
        "Give short, kind, actionable feedback. Do not invent information or diagnose the child.",
    ),
    new HumanMessage(
      JSON.stringify({
        currentScore,
        previousScore,
        responses: responses.slice(-40),
      }),
    ),
  ]);

  const json = responseText(response.content).match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error("Behaviour agent returned no JSON.");

  const parsed = behaviourAnalysisSchema.safeParse(JSON.parse(json));
  if (!parsed.success) throw new Error("Behaviour agent returned invalid JSON.");
  return parsed.data;
}
