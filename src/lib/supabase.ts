import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let currentUrl =
  import.meta.env?.VITE_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://placeholder.supabase.co";

let currentKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "placeholder-key";

export let supabase: SupabaseClient = createClient(currentUrl, currentKey);

export function isSupabaseConfigured(): boolean {
  return (
    Boolean(currentUrl) &&
    currentUrl !== "https://placeholder.supabase.co" &&
    Boolean(currentKey) &&
    currentKey !== "placeholder-key"
  );
}

export function updateSupabaseCredentials(url: string, key: string) {
  if (url && key && (url !== currentUrl || key !== currentKey)) {
    currentUrl = url;
    currentKey = key;
    supabase = createClient(url, key);
    return true;
  }
  return false;
}

export async function syncClientAuthConfig(): Promise<boolean> {
  if (typeof window === "undefined") return isSupabaseConfigured();
  try {
    const res = await fetch("/api/auth/config");
    if (res.ok) {
      const data = (await res.json()) as { supabaseUrl?: string; supabaseAnonKey?: string };
      if (data.supabaseUrl && data.supabaseAnonKey) {
        updateSupabaseCredentials(data.supabaseUrl, data.supabaseAnonKey);
        return true;
      }
    }
  } catch (e) {
    console.warn("Could not sync auth config from server:", e);
  }
  return isSupabaseConfigured();
}
