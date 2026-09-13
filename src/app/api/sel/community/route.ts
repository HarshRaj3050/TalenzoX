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

  const [{ data: reports, error: reportsError }, { data: likes, error: likesError }, { data: comments, error: commentsError }] =
    await Promise.all([
      supabase
        .from("feelings_weather_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("feelings_weather_report_likes").select("report_id, auth_uid"),
      supabase
        .from("feelings_weather_report_comments")
        .select("id, report_id, auth_uid, author_name, body, created_at")
        .order("created_at", { ascending: true }),
    ]);

  if (reportsError || likesError || commentsError) {
    console.error("Failed to load SEL community feed:", reportsError || likesError || commentsError);
    return NextResponse.json({ message: "Unable to load community feed" }, { status: 500 });
  }

  const likesByReport = new Map<string, { count: number; likedByMe: boolean }>();
  for (const like of likes || []) {
    const current = likesByReport.get(like.report_id) || { count: 0, likedByMe: false };
    current.count += 1;
    current.likedByMe ||= like.auth_uid === user.id;
    likesByReport.set(like.report_id, current);
  }

  const commentsByReport = new Map<string, typeof comments>();
  for (const comment of comments || []) {
    const reportComments = commentsByReport.get(comment.report_id) || [];
    reportComments.push(comment);
    commentsByReport.set(comment.report_id, reportComments);
  }

  return NextResponse.json({
    reports: (reports || []).map((report) => ({
      ...report,
      likes: likesByReport.get(report.id) || { count: 0, likedByMe: false },
      comments: commentsByReport.get(report.id) || [],
    })),
  });
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
    const reportId = String(body.report_id || "");
    const action = String(body.action || "");

    if (!reportId || !["like", "comment"].includes(action)) {
      return NextResponse.json({ message: "Invalid community action" }, { status: 400 });
    }

    if (action === "like") {
      const { data: existingLike } = await supabase
        .from("feelings_weather_report_likes")
        .select("report_id")
        .eq("report_id", reportId)
        .eq("auth_uid", user.id)
        .maybeSingle();

      if (existingLike) {
        await supabase
          .from("feelings_weather_report_likes")
          .delete()
          .eq("report_id", reportId)
          .eq("auth_uid", user.id);
      } else {
        const { error } = await supabase.from("feelings_weather_report_likes").insert({
          report_id: reportId,
          auth_uid: user.id,
        });
        if (error) return NextResponse.json({ message: error.message }, { status: 500 });
      }

      const { count } = await supabase
        .from("feelings_weather_report_likes")
        .select("report_id", { count: "exact", head: true })
        .eq("report_id", reportId);

      return NextResponse.json({ liked: !existingLike, count: count || 0 });
    }

    const commentBody = String(body.body || "").trim().slice(0, 500);
    if (!commentBody) {
      return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 });
    }

    const authorName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Student";
    const { data: comment, error } = await supabase
      .from("feelings_weather_report_comments")
      .insert({ report_id: reportId, auth_uid: user.id, author_name: authorName, body: commentBody })
      .select("id, report_id, auth_uid, author_name, body, created_at")
      .single();

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Failed to update SEL community feed:", error);
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
