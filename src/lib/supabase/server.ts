import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AUTH_STORAGE_KEYS, type AuthAudience } from "./auth";

export async function createSupabaseServerClient(
  audience: AuthAudience = "learner",
) {
  const cookieStore = await cookies();
  const storageKey = AUTH_STORAGE_KEYS[audience];

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: storageKey },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore if called from a Server Component.
            // Cookies should instead be refreshed by middleware.
          }
        },
      },
    }
  );
}