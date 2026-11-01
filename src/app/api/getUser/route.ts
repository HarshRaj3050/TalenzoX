import { NextResponse } from "next/server";
import { redis } from "@/lib/redis/redis";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  bannerColors,
  characterImages,
  defaultCharacterImage,
  isUploadedCharacterImage,
} from "@/app/(main)/showcase/profile/_components/showcase-profile-data";

const characterImageSources = new Set<string>(
  characterImages.map(({ src }) => src),
);
const profileImageStoragePrefix = "showcase-profile:";
const profileImageBucket = "showcase-posts";
const bannerColorValues = new Set<string>([
  ...bannerColors.map(({ value }) => value),
  "#347f7a",
  "#475569",
]);

function getProfileImagePath(value: unknown, userId: string) {
  if (typeof value !== "string" || !value.startsWith(profileImageStoragePrefix)) {
    return null;
  }

  const path = value.slice(profileImageStoragePrefix.length);
  const fileName = path.slice(`${userId}/profile/`.length);
  return (
    path.startsWith(`${userId}/profile/`) &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$/i.test(
      fileName,
    )
  )
    ? path
    : null;
}

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
  const skills = Array.isArray(user.user_metadata?.showcase_skills)
    ? user.user_metadata.showcase_skills
        .filter((skill: unknown): skill is string => typeof skill === "string")
        .map((skill: string) => skill.trim())
        .filter(Boolean)
        .slice(0, 30)
    : [];

  let cached: unknown = null;
  try {
    cached = await redis.get(key);
  } catch (redisError) {
    console.warn("Failed to read user from Redis cache:", redisError);
  }

  if (cached) {
    const cachedProfile = parseRedisValue(cached);
    if (
      cachedProfile &&
      typeof cachedProfile === "object" &&
      !Array.isArray(cachedProfile)
    ) {
      return NextResponse.json({ ...cachedProfile, skills });
    }
    return NextResponse.json(cachedProfile);
  }

  const { data: profile, error } = await supabase
    .from("user_details")
    .select("*")
    .eq("auth_uid", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch user profile from Supabase:", error);
  }

  const metadataName =
    user.user_metadata?.name ?? user.user_metadata?.full_name ?? null;
  const displayName =
    metadataName ?? (profile as { name?: string | null } | null)?.name ?? null;
  const profileFields = profile as {
    location?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    bio?: string | null;
  } | null;
  const metadataLocation =
    typeof user.user_metadata?.showcase_location === "string"
      ? user.user_metadata.showcase_location
      : null;
  const metadataBio =
    typeof user.user_metadata?.showcase_bio === "string"
      ? user.user_metadata.showcase_bio
      : null;
  const metadataSummary =
    typeof user.user_metadata?.showcase_summary === "string"
      ? user.user_metadata.showcase_summary
      : null;
  const storedCharacterImage = user.user_metadata?.showcase_character_image;
  const profileImagePath = getProfileImagePath(storedCharacterImage, user.id);
  const legacyCharacterImage = user.user_metadata?.showcase_profile_photo;
  const metadataCharacterImage =
    (typeof storedCharacterImage === "string" &&
      characterImageSources.has(storedCharacterImage) &&
      storedCharacterImage) ||
    (profileImagePath &&
      supabase.storage
        .from(profileImageBucket)
        .getPublicUrl(profileImagePath).data.publicUrl) ||
    (typeof storedCharacterImage === "string" &&
      isUploadedCharacterImage(storedCharacterImage) &&
      storedCharacterImage) ||
    (typeof legacyCharacterImage === "string" &&
      characterImageSources.has(legacyCharacterImage) &&
      legacyCharacterImage) ||
    defaultCharacterImage;
  const metadataBannerColor =
    typeof user.user_metadata?.showcase_banner_color === "string"
      ? user.user_metadata.showcase_banner_color
      : null;

  const profileData = {
    ...(profile ?? {}),
    id: profile?.id ?? user.id,
    auth_uid: user.id,
    email: profile?.email ?? user.email ?? null,
    name: displayName,
    full_name: displayName,
    location:
      metadataLocation ??
      profileFields?.location ??
      profileFields?.address ??
      [profileFields?.city, profileFields?.state].filter(Boolean).join(", "),
    bio: metadataBio ?? profileFields?.bio ?? null,
    summary: metadataSummary,
    characterImage: metadataCharacterImage,
    bannerColor: metadataBannerColor,
    skills,
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

export async function PUT(request: Request) {
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
    return NextResponse.json({ message: "Invalid profile data." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Invalid profile data." }, { status: 400 });
  }

  const values = body as Record<string, unknown>;
  const name = typeof values.name === "string" ? values.name.trim() : "";
  const bio = typeof values.bio === "string" ? values.bio.trim() : "";
  const location =
    typeof values.location === "string" ? values.location.trim() : "";
  const summary =
    typeof values.summary === "string" ? values.summary.trim() : "";

  if (
    !name ||
    name.length > 80 ||
    bio.length > 500 ||
    location.length > 120 ||
    summary.length > 180
  ) {
    return NextResponse.json(
      { message: "Check the profile fields and try again." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      name,
      full_name: name,
      showcase_bio: bio,
      showcase_location: location,
      showcase_summary: summary,
    },
  });

  if (error || !data.user) {
    console.error("Failed to update showcase profile:", error);
    return NextResponse.json(
      { message: "We could not save your profile. Please try again." },
      { status: 500 },
    );
  }

  try {
    await redis.del(`user:${user.id}`);
  } catch (redisError) {
    console.warn("Failed to invalidate Redis user cache:", redisError);
  }

  return NextResponse.json({
    full_name: name,
    name,
    bio,
    location,
    summary,
  });
}

export async function PATCH(request: Request) {
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
    return NextResponse.json({ message: "Invalid theme settings." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Invalid theme settings." }, { status: 400 });
  }

  const values = body as Record<string, unknown>;

  if ("skills" in values) {
    if (
      !Array.isArray(values.skills) ||
      values.skills.length > 30 ||
      values.skills.some(
        (skill) =>
          typeof skill !== "string" ||
          !skill.trim() ||
          skill.trim().length > 40,
      )
    ) {
      return NextResponse.json({ message: "Check the skills and try again." }, { status: 400 });
    }

    const skills = values.skills.map((skill: string) => skill.trim());
    if (new Set(skills.map((skill: string) => skill.toLocaleLowerCase())).size !== skills.length) {
      return NextResponse.json(
        { message: "Skills must not contain duplicates." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        showcase_skills: skills,
      },
    });

    if (error || !data.user) {
      console.error("Failed to update showcase skills:", error);
      return NextResponse.json(
        { message: "We could not save your skills. Please try again." },
        { status: 500 },
      );
    }

    try {
      await redis.del(`user:${user.id}`);
    } catch (redisError) {
      console.warn("Failed to invalidate Redis user cache:", redisError);
    }

    return NextResponse.json({ skills });
  }

  const characterImage = values.characterImage;
  const bannerColor = values.bannerColor;
  const previousProfileImagePath = getProfileImagePath(
    user.user_metadata?.showcase_character_image,
    user.id,
  );
  const existingProfileImageUrl = previousProfileImagePath
    ? supabase.storage
        .from(profileImageBucket)
        .getPublicUrl(previousProfileImagePath).data.publicUrl
    : null;
  const isExistingProfileImage = characterImage === existingProfileImageUrl;

  if (
    typeof characterImage !== "string" ||
    (!characterImageSources.has(characterImage) &&
      !isUploadedCharacterImage(characterImage) &&
      !isExistingProfileImage) ||
    typeof bannerColor !== "string" ||
    !bannerColorValues.has(bannerColor)
  ) {
    return NextResponse.json({ message: "Choose a valid photo and banner color." }, { status: 400 });
  }

  let nextCharacterImage = isExistingProfileImage
    ? `${profileImageStoragePrefix}${previousProfileImagePath}`
    : characterImage;
  let nextProfileImagePath = isExistingProfileImage
    ? previousProfileImagePath
    : null;

  if (!characterImageSources.has(characterImage) && !isExistingProfileImage) {
    const imageBytes = Buffer.from(
      characterImage.slice("data:image/jpeg;base64,".length),
      "base64",
    );
    nextProfileImagePath = `${user.id}/profile/${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from(profileImageBucket)
      .upload(nextProfileImagePath, imageBytes, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Failed to upload showcase profile image:", uploadError);
      return NextResponse.json(
        { message: "We could not save your profile photo. Please try again." },
        { status: 500 },
      );
    }

    nextCharacterImage = `${profileImageStoragePrefix}${nextProfileImagePath}`;
  }

  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      showcase_character_image: nextCharacterImage,
      showcase_banner_color: bannerColor,
    },
  });

  if (error || !data.user) {
    console.error("Failed to update showcase profile theme:", error);
    if (nextProfileImagePath) {
      const { error: cleanupError } = await supabase.storage
        .from(profileImageBucket)
        .remove([nextProfileImagePath]);
      if (cleanupError) {
        console.error(
          "Failed to clean up an unsaved showcase profile image:",
          cleanupError,
        );
      }
    }
    return NextResponse.json(
      { message: "We could not save your profile theme. Please try again." },
      { status: 500 },
    );
  }

  if (previousProfileImagePath) {
    const { error: cleanupError } = await supabase.storage
      .from(profileImageBucket)
      .remove([previousProfileImagePath]);
    if (cleanupError) {
      console.error(
        "Failed to remove the previous showcase profile image:",
        cleanupError,
      );
    }
  }

  try {
    await redis.del(`user:${user.id}`);
  } catch (redisError) {
    console.warn("Failed to invalidate Redis user cache:", redisError);
  }

  const responseCharacterImage = nextProfileImagePath
    ? supabase.storage
        .from(profileImageBucket)
        .getPublicUrl(nextProfileImagePath).data.publicUrl
    : characterImage;

  return NextResponse.json({
    characterImage: responseCharacterImage,
    bannerColor,
  });
}
