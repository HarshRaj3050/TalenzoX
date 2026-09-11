import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TeacherDashboardPage() {
  const supabase = await createSupabaseServerClient("teacher");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const name = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "Teacher";

  return (
    <main className="min-h-svh bg-slate-950 p-6 text-slate-100 md:p-12">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-sky-300">TalenzoX Teacher Portal</p>
        <h1 className="mt-2 text-4xl font-bold">Welcome, {name}</h1>
        <p className="mt-3 text-slate-400">Your teacher dashboard is ready.</p>
      </section>
    </main>
  );
}
