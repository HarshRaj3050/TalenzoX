import { graph } from "@/lib/graph/graph";
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

    const result = await graph.invoke({
      prompt,
      aiResponse: "",
      agent: "chat",
      conversationId: "",
      searchResults: [],
      images: [],
    });

    const response = typeof result.aiResponse === "string" ? result.aiResponse : "";

    console.log("chat answer:", response);

    return NextResponse.json({
      answer: response,
      images: result.images ?? [],
    });

  } catch (error) {
    console.error("agent controller error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      message: `agent controller error: ${message}`,
    }, { status: 500 });
  }
}
