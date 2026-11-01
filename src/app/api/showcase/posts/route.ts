import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const storageBucket = "showcase-posts";
const maxCaptionLength = 2000;
const maxMediaBytes = 10 * 1024 * 1024;
const allowedMediaTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const postFields = "id, auth_uid, author_name, caption, media_url, created_at";
const pageSize = 500;

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const posts = [];
  const ownPostsOnly =
    new URL(request.url).searchParams.get("scope") === "mine";
  for (let offset = 0; ; offset += pageSize) {
    let query = supabase
      .from("showcase_posts")
      .select(postFields)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (ownPostsOnly) query = query.eq("auth_uid", user.id);
    const { data, error } = await query.range(offset, offset + pageSize - 1);

    if (error) {
      console.error("Failed to load Showcase posts:", error);
      return NextResponse.json(
        { message: "We could not load Showcase posts." },
        { status: 500 },
      );
    }

    posts.push(...data);
    if (data.length < pageSize) break;
  }

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid post data." }, { status: 400 });
  }

  const captionValue = formData.get("caption");
  const caption = typeof captionValue === "string" ? captionValue.trim() : "";
  const mediaValue = formData.get("media");
  const media = mediaValue instanceof File && mediaValue.size > 0 ? mediaValue : null;

  if (caption.length > maxCaptionLength) {
    return NextResponse.json(
      { message: `Captions must be ${maxCaptionLength} characters or fewer.` },
      { status: 400 },
    );
  }
  if (!caption && !media) {
    return NextResponse.json(
      { message: "Write a caption or choose an image for your post." },
      { status: 400 },
    );
  }
  if (media && !allowedMediaTypes.has(media.type)) {
    return NextResponse.json(
      { message: "Choose a JPG, PNG, or WebP image." },
      { status: 400 },
    );
  }
  if (media && media.size > maxMediaBytes) {
    return NextResponse.json(
      { message: "Choose an image smaller than 10 MB." },
      { status: 400 },
    );
  }

  const mediaExtension = media ? allowedMediaTypes.get(media.type) : undefined;
  const mediaPath = media
    ? `${user.id}/${crypto.randomUUID()}.${mediaExtension}`
    : null;

  try {
    let mediaUrl: string | null = null;
    if (media && mediaPath) {
      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(mediaPath, media, {
          contentType: media.type,
          upsert: false,
        });
      if (uploadError) throw uploadError;
      mediaUrl = supabase.storage.from(storageBucket).getPublicUrl(mediaPath)
        .data.publicUrl;
    }

    const metadataName =
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split("@")[0] ??
      "TalenzoX member";
    const authorName =
      typeof metadataName === "string"
        ? metadataName.trim().slice(0, 80) || "TalenzoX member"
        : "TalenzoX member";
    const { data: post, error: insertError } = await supabase
      .from("showcase_posts")
      .insert({
        auth_uid: user.id,
        author_name: authorName,
        caption,
        media_url: mediaUrl,
      })
      .select(postFields)
      .single();

    if (insertError) {
      if (mediaPath) {
        const { error: cleanupError } = await supabase.storage
          .from(storageBucket)
          .remove([mediaPath]);
        if (cleanupError) {
          console.error("Failed to remove media from an unsaved post:", cleanupError);
        }
      }
      throw insertError;
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Failed to create Showcase post:", error);
    return NextResponse.json(
      { message: "We could not publish your post. Please try again." },
      { status: 500 },
    );
  }
}
