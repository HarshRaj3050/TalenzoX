import { summaryAgent } from "@/agents/summary.agent";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  topic: z.string().max(500).default(""),
  transcript: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().max(4000),
      }),
    )
    .max(80),
});

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const input = requestSchema.parse(await request.json());
    const result = await summaryAgent(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Conversation summary error:", error);
    const message = error instanceof Error ? error.message : "Unable to summarize conversation.";
    return NextResponse.json({ message }, { status: 500 });
  }
}