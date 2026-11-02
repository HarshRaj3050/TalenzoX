import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { getModel } from "@/lib/graph/llmModels";

const roadmapSchema = z.object({
  title: z.string().min(1).max(100),
  summary: z.string().min(1).max(400),
  milestones: z
    .array(
      z.object({
        month: z.number().int().min(1).max(6),
        title: z.string().min(1).max(80),
        focus: z.string().min(1).max(240),
        outcome: z.string().min(1).max(200),
        activities: z.array(z.string().min(1).max(120)).min(2).max(3),
      }),
    )
    .length(8),
});

export type LearningRoadmap = z.infer<typeof roadmapSchema>;

function responseText(content: unknown) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
      .join("");
  }
  return JSON.stringify(content);
}

export async function roadmapAgent({
  learningGoal,
  durationMonths,
}: {
  learningGoal: string;
  durationMonths: 3 | 6;
}): Promise<LearningRoadmap> {
  const model = await getModel("roadmap");
  const response = await model.invoke([
    new SystemMessage(
      "You are an expert, encouraging learning coach. Create a practical learning roadmap from the learner's goal. " +
        "Return only valid JSON with this exact shape: " +
        '{"title":"string","summary":"string","milestones":[{"month":1,"title":"string","focus":"string","outcome":"string","activities":["string","string"]}]}. ' +
        `Create exactly 8 milestones. Assign their month numbers in this exact order: ${Array.from(
          { length: 8 },
          (_, index) => Math.floor((index * durationMonths) / 8) + 1,
        ).join(", ")}. ` +
        "Keep every field concise: focus and outcome should each be one sentence, and activities should be short phrases. " +
        "Make each milestone build on the last. Keep the plan realistic for a beginner unless the goal says otherwise. " +
        "Do not include markdown or extra fields.",
    ),
    new HumanMessage(
      JSON.stringify({
        learningGoal: learningGoal.slice(0, 2000),
        durationMonths,
      }),
    ),
  ]);

  const json = responseText(response.content).match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error("Roadmap agent returned no JSON.");

  const parsed = roadmapSchema.safeParse(JSON.parse(json));
  if (!parsed.success) throw new Error("Roadmap agent returned invalid JSON.");

  const actualMonths = parsed.data.milestones.map((milestone) => milestone.month);
  const expectedMonths = Array.from(
    { length: 8 },
    (_, index) => Math.floor((index * durationMonths) / 8) + 1,
  );
  if (expectedMonths.some((month, index) => actualMonths[index] !== month)) {
    throw new Error("Roadmap agent returned an invalid 8-section timeline.");
  }

  return parsed.data;
}
