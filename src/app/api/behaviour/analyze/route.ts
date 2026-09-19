import { NextResponse } from "next/server";
import { behaviourAgent } from "@/agents/behaviour.agent";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type StoredResponse = {
  question_number: number;
  question_text: string;
  answer_key: "yes" | "no";
  answer_text: string;
  language: string;
  created_at: string;
};

function scoreResponses(responses: StoredResponse[]) {
  if (!responses.length) return 0;
  return Math.round(
    (responses.filter((response) => response.answer_key === "yes").length /
      responses.length) *
      100,
  );
}

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("behaviour_question_responses")
      .select(
        "question_number, question_text, answer_key, answer_text, language, created_at",
      )
      .eq("auth_uid", user.id)
      .eq("activity_slug", "behaviour-test")
      .order("created_at", { ascending: true });

    if (error) throw error;

    const responses = (data ?? []) as StoredResponse[];
    const currentAttempt = responses.slice(-2);
    const previousResponses = responses.slice(0, -2);
    const previousAttempt = previousResponses.slice(-2);
    const currentScore = scoreResponses(currentAttempt);
    const previousScore = scoreResponses(previousAttempt);
    const analysis = await behaviourAgent({
      responses,
      currentScore,
      previousScore,
    });

    return NextResponse.json({
      analysis: {
        ...analysis,
        score: currentScore,
        previousScore,
        improvement: currentScore - previousScore,
      },
      responseCount: responses.length,
    });
  } catch (error) {
    console.error("Failed to analyze behaviour responses:", error);
    return NextResponse.json(
      { message: "We could not analyze the behaviour answers yet." },
      { status: 500 },
    );
  }
}
