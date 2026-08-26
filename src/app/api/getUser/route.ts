import { NextResponse } from "next/server";
import { redis } from "@/lib/redis/redis";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function parseRedisValue(value: unknown) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const key = `user:${user.id}`;

  const cached = await redis.get(key);

  if (cached) {
    return NextResponse.json(parseRedisValue(cached));
  }

  const { data: profile, error } = await supabase
    .from("user")
    .select("*")
    .eq("auth_uid", user.id)
    .maybeSingle();

  const profileData = profile ?? {
    id: user.id,
    email: user.email ?? null,
    full_name:
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      null,
  };

  if (error) {
    console.error("Failed to fetch user profile:", error);
  }

  await redis.set(key, JSON.stringify(profileData), {
    ex: 3600,
  });

  return NextResponse.json(profileData);
}
