import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redis } from "@/lib/redis/redis";

const fields = [
  "dob",
  "phone",
  "college",
  "status",
  "focus",
  "source",
  "invite_email",
] as const;

const requiredFields = ["dob", "phone", "college", "status", "focus"] as const;

async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: profileData, error } = await supabase
    .from("user_details")
    .select(requiredFields.join(", "))
    .eq("auth_uid", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to check user details:", error);
    return NextResponse.json(
      { message: "We could not check your profile." },
      { status: 500 },
    );
  }

  const profile = profileData as Record<string, string | null> | null;
  const complete = Boolean(profile && requiredFields.every((field) => profile[field]));

  return NextResponse.json({ complete });
}

export async function POST(request: Request) {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const profile = Object.fromEntries(
      fields.map((field) => [
        field,
        typeof body?.[field] === "string" ? body[field].trim() || null : null,
      ]),
    );

    if (!profile.dob || !profile.phone || !profile.college || !profile.status || !profile.focus) {
      return NextResponse.json(
        { message: "Please complete the required profile fields." },
        { status: 400 },
      );
    }

    const { data: existingProfile, error: lookupError } = await supabase
      .from("user_details")
      .select("id")
      .eq("auth_uid", user.id)
      .maybeSingle();

    if (lookupError) throw lookupError;

    const query = existingProfile
      ? supabase.from("user_details").update(profile).eq("auth_uid", user.id)
      : supabase.from("user_details").insert({
          ...profile,
          auth_uid: user.id,
          email: user.email ?? null,
          name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? null,
          onGoingProcess: false,
        });

    const { error: saveError } = await query;
    if (saveError) throw saveError;

    try {
      await redis.del(`user:${user.id}`);
    } catch (redisError) {
      console.warn("Failed to invalidate Redis user cache:", redisError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save user details:", error);
    return NextResponse.json(
      { message: "We could not save your details. Please try again." },
      { status: 500 },
    );
  }
}