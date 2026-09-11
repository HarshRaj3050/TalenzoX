import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TeacherLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient("teacher");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.user_metadata?.role === "teacher") {
    redirect("/teacher/dashboard");
  }

  return children;
}
