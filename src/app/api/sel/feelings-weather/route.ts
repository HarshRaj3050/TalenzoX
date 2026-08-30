import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", reports: [] }, { status: 401 });
  }

  try {
    const { data: reports, error } = await supabase
      .from("feelings_weather_reports")
      .select("*")
      .eq("auth_uid", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.warn("Notice fetching feelings weather reports:", error.message);
      return NextResponse.json({ reports: [] });
    }

    return NextResponse.json({ reports: reports || [] });
  } catch (error) {
    console.error("Error fetching feelings weather reports:", error);
    return NextResponse.json({ reports: [] });
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { weather_id, weather_label, emotion, emoji, intensity, note, image_url } = body;

    if (!weather_id || !weather_label || !emotion || !emoji || !intensity) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const { data: report, error } = await supabase
      .from("feelings_weather_reports")
      .insert({
        auth_uid: user.id,
        weather_id,
        weather_label,
        emotion,
        emoji,
        intensity: Number(intensity) || 3,
        note: note ? String(note).trim() : "",
        image_url: image_url ? String(image_url).trim() : "",
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error inserting feelings weather report:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // Increment completed_practices in sel_profiles if profile exists
    try {
      const { data: profile } = await supabase
        .from("sel_profiles")
        .select("completed_practices")
        .eq("auth_uid", user.id)
        .maybeSingle();

      if (profile) {
        await supabase
          .from("sel_profiles")
          .update({
            completed_practices: (profile.completed_practices || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("auth_uid", user.id);
      }
    } catch (profileErr) {
      console.warn("Non-fatal error updating SEL practice count:", profileErr);
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Error creating feelings weather report:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing id parameter" }, { status: 400 });
    }

    const { error } = await supabase
      .from("feelings_weather_reports")
      .delete()
      .eq("id", id)
      .eq("auth_uid", user.id);

    if (error) {
      console.error("Error deleting feelings weather report:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting feelings weather report:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
