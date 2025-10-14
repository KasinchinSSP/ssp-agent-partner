import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Record<string, any>;

    if (data.hp) {
      return new Response(JSON.stringify({ ok: false, error: "blocked" }), {
        status: 400,
      });
    }

    if (!data.pdpa_ok) {
      return new Response(
        JSON.stringify({ ok: false, error: "pdpa_required" }),
        { status: 400 }
      );
    }

    if (!data.full_name || !data.phone) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing_fields" }),
        { status: 400 }
      );
    }

    if (!/^0[0-9]{9}$/.test(String(data.phone))) {
      return new Response(
        JSON.stringify({ ok: false, error: "invalid_phone" }),
        { status: 400 }
      );
    }

    const row = {
      full_name: String(data.full_name),
      phone: String(data.phone),
      age: data.age ? Number(data.age) : null,

      plan_key: data.plan_key ? String(data.plan_key) : null,

      sum_assured: data.sum_assured ? Number(data.sum_assured) : null,

      ref: data.ref ? String(data.ref) : null,

      pdpa_ok: true,

      gender: data.gender ?? null, // "M" | "F" | null
      birth_date: data.birth_date ?? null, // "YYYY-MM-DD" | null
      source_url:
        data.source_url ??
        (typeof window === "undefined" ? null : window.location.href),
      user_agent: req.headers.get("user-agent") || data.user_agent || null,

      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
    };

    const { error } = await supabaseServer.from("leads").insert(row);
    if (error) {
      console.error("[leads.insert] error:", error);
      // ถ้า ref ไม่ถูกต้อง/ไม่มี agent_profiles จะโดน RLS block ตรงนี้
      return new Response(JSON.stringify({ ok: false, error: "db_error" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: "server_error" }), {
      status: 500,
    });
  }
}
