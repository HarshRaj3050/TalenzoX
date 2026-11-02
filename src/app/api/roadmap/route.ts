import { NextResponse } from "next/server";
import { z } from "zod";
import { roadmapAgent } from "@/agents/roadmap.agent";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  learningGoal: z.string().trim().min(10).max(2000),
  durationMonths: z.union([z.literal(3), z.literal(6)]),
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsedRequest = requestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        message:
          "Describe what you want to learn (at least 10 characters) and choose a 3- or 6-month plan.",
      },
      { status: 400 },
    );
  }

  try {
    const roadmap = await roadmapAgent(parsedRequest.data);
    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error("Failed to generate learning roadmap:", error);
    return NextResponse.json(
      { message: "We could not build your roadmap right now. Please try again." },
      { status: 502 },
    );
  }
}
