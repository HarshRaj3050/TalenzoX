import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: selProfile, error } = await supabase
      .from("sel_profiles")
      .select("*")
      .eq("auth_uid", user.id)
      .maybeSingle();

    if (error) {
      console.warn("SEL Profile lookup notice (table may be empty or newly created):", error.message);
      return NextResponse.json({
        isNewUser: true,
        profile: null,
      });
    }

    if (!selProfile || !selProfile.has_completed_assessment) {
      return NextResponse.json({
        isNewUser: true,
        profile: null,
      });
    }

    return NextResponse.json({
      isNewUser: false,
      profile: selProfile,
    });
  } catch (error) {
    console.error("Error fetching SEL profile:", error);
    return NextResponse.json({
      isNewUser: true,
      profile: null,
    });
  }
}
