import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function UserDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("user_details")
    .select("dob, phone, college, status, focus")
    .eq("auth_uid", user.id)
    .maybeSingle();

  const profileComplete = Boolean(
    profile?.dob &&
      profile.phone &&
      profile.college &&
      profile.status &&
      profile.focus,
  );

  if (profileComplete) {
    redirect("/home");
  }

  return <>{children}</>;
}