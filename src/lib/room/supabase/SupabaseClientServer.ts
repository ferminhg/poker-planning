import { createClient, SupabaseClient } from '@supabase/supabase-js';

let serverInstance: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (serverInstance) return serverInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  serverInstance = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return serverInstance;
}
