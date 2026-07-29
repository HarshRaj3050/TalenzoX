import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis/redis";

export async function GET() {
  const value = await redis.get("hello");

  return NextResponse.json({
    value,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body?.user?.id ?? body?.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "User id is required" },
        { status: 400 }
      );
    }

    const payload = {
      user: body?.user ?? null,
      session: body?.session ?? null,
      loggedInAt: new Date().toISOString(),
      source: "login",
    };

    const key = `auth:${userId}`;

    await redis.set(key, payload, {
      ex: 60 * 60 * 24,
    });

    return NextResponse.json({ ok: true, key });
  } catch (error) {
    console.error("Redis login sync failed", error);

    return NextResponse.json(
      { message: "Failed to store login data in Redis" },
      { status: 500 }
    );
  }
}