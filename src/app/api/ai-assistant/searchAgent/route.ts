import { searchAgent } from "@/agents/search.agent";
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
            return NextResponse.json({ results: [], images: [] });
        }

        const result = await searchAgent({ prompt });

        return NextResponse.json({
            results: result.searchResults ?? [],
            images: result.images ?? [],
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("search agent route error:", message);
        return NextResponse.json(
            { message: `search agent error: ${message}` },
            { status: 500 },
        );
    }
}