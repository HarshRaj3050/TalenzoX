import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const answerKeys = new Set(["yes", "no"]);

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const activitySlug = String(body.activity_slug || "").trim();
    const questionNumber = Number(body.question_number);
    const questionText = String(body.question_text || "").trim();
    const language = String(body.language || "").trim();
    const answerKey = String(body.answer_key || "").trim();
    const answerText = String(body.answer_text || "").trim();
    const responseVideo = String(body.response_video || "").trim();

    if (
      !activitySlug ||
      !Number.isInteger(questionNumber) ||
      questionNumber < 1 ||
      !questionText ||
      !language ||
      !answerKeys.has(answerKey) ||
      !answerText ||
      !responseVideo
    ) {
      return NextResponse.json({ message: "Invalid behaviour response" }, { status: 400 });
    }

    const { data: response, error } = await supabase
      .from("behaviour_question_responses")
      .insert({
        auth_uid: user.id,
        activity_slug: activitySlug,
        question_number: questionNumber,
        question_text: questionText,
        language,
        answer_key: answerKey,
        answer_text: answerText,
        response_video: responseVideo,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Failed to save behaviour response:", error);
      return NextResponse.json({ message: "Could not save behaviour response" }, { status: 500 });
    }

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Invalid behaviour response request:", error);
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
