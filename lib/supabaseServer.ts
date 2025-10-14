import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY; // อย่าใส่ NEXT_PUBLIC

if (!SUPABASE_URL) throw new Error("SUPABASE_URL is required.");
if (!SUPABASE_ANON) throw new Error("SUPABASE_ANON_KEY is required.");

export function supabaseServer() {
  // ใช้ ANON + cookies per-request (เหมาะกับ RLS/auth ฝั่ง SSR)
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL!, SUPABASE_ANON!, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set() {}, // เราไม่ได้ตั้งคุกกี้ตอบกลับในเพจนี้
      remove() {},
    },
  });
}

// ใช้เฉพาะบนเซิร์ฟเวอร์เท่านั้น (Route handlers/Server Components)
// เพื่อ “อ่านข้อมูลที่ RLS บล็อก” เช่น ดึง agent_profiles ด้วย agent_secret
export function supabaseService() {
  if (!SUPABASE_SERVICE)
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");
  return createAdminClient(SUPABASE_URL!, SUPABASE_SERVICE!, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "server" } },
  });
}
