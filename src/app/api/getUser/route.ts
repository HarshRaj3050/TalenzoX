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

  let cached: unknown = null;
  try {
    cached = await redis.get(key);
  } catch (redisError) {
    console.warn("Failed to read user from Redis cache:", redisError);
  }

  if (cached) {
    return NextResponse.json(parseRedisValue(cached));
  }

  const { data: profile, error } = await supabase
    .from("user_details")
    .select("*")
    .eq("auth_uid", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch user profile from Supabase:", error);
  }

  const displayName =
    (profile as { name?: string | null } | null)?.name ??
    user.user_metadata?.name ??
    user.user_metadata?.full_name ??
    null;

  const profileData = {
    ...(profile ?? {}),
    id: profile?.id ?? user.id,
    auth_uid: user.id,
    email: profile?.email ?? user.email ?? null,
    name: displayName,
    full_name: displayName,
  };

  try {
    await redis.set(key, JSON.stringify(profileData), {
      ex: 3600,
    });
  } catch (redisError) {
    console.warn("Failed to write user to Redis cache:", redisError);
  }

  return NextResponse.json(profileData);
}
