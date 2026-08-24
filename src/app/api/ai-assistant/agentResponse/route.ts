import { chatAgent } from "@/agents/chat.agent";
import { NextRequest, NextResponse } from "next/server";

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

    const result = await chatAgent({
      prompt,
      aiResponse: "",
      agent: "chat",
      conversationId: "",
      searchResults: [],
      images: [],
    });

    const response = result.aiResponse;

    console.log("chat answer:", response);

    return NextResponse.json({
      answer: response,
      images: result.images ?? [],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("agent controller error:", error);
    return NextResponse.json({
      message: `agent controller error: ${error.message || error}`,
    });
  }
}
