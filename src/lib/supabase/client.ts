
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AUTH_STORAGE_KEYS, type AuthAudience } from "./auth";

type SupabaseSchema = Record<string, never>;

const clients: Partial<Record<AuthAudience, SupabaseClient<SupabaseSchema>>> = {};

export function getSupabaseBrowserClient(
  audience: AuthAudience = "learner",
): SupabaseClient<SupabaseSchema> {
  const existingClient = clients[audience];
  if (existingClient) {
    return existingClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const storageKey = AUTH_STORAGE_KEYS[audience];
  const client = createBrowserClient<SupabaseSchema>(supabaseUrl, supabaseAnonKey, {
    cookieOptions: { name: storageKey },
  });

  clients[audience] = client;
  return client;
}