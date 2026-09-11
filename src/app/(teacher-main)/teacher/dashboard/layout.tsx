import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SidebarTeacher } from "../../_components/ui/SideBar-teacher";

export default async function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient("teacher");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "teacher") {
    redirect("/teacher/login");
  }

  return <SidebarTeacher>{children}</SidebarTeacher>;
}
