import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{

        const data = await req.json();

        return NextResponse.json({
            success: true,
            data
        });
    } catch(error) {
        console.log("api createConversation error : " + error);
    }
}