import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// POST /api/lead — รับคำขอจากแบบฟอร์มหน้า /quote แล้วบันทึกลงตาราง public.leads
export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Record<string, any>;

    // กันบอทแบบง่ายด้วย Honeypot
    if (typeof data.hp === "string" && data.hp.trim() !== "") {
      return NextResponse.json(
        { ok: false, error: "blocked" },
        { status: 400 }
      );
    }

    // ตรวจ PDPA
    const pdpaOk =
      data.pdpa_ok === true || data.pdpa_ok === "true" || data.pdpa_ok === "on";
    if (!pdpaOk) {
      return NextResponse.json(
        { ok: false, error: "pdpa_required" },
        { status: 400 }
      );
    }

    // ตรวจฟิลด์บังคับ
    const fullName = (data.full_name || "").toString().trim();
    const phone = (data.phone || "").toString().trim();

    // ✅ ref: รับจาก body หรือสำรองจาก cookie 'agent_ref'
    const refFromBody = (data.ref || "").toString().trim();
    const refFromCookie = req.cookies.get("agent_ref")?.value?.trim() || "";
    const ref = refFromBody || refFromCookie;

    if (!fullName || !phone) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }
    if (!/^0[0-9]{9}$/.test(phone)) {
      return NextResponse.json(
        { ok: false, error: "invalid_phone" },
        { status: 400 }
      );
    }
    if (!ref) {
      return NextResponse.json(
        { ok: false, error: "ref_required" },
        { status: 400 }
      );
    }

    // Map ค่าลง schema ของตาราง leads (snake_case)
    const row = {
      full_name: fullName,
      phone,
      age: data.age != null && data.age !== "" ? Number(data.age) : null,
      plan_key: data.plan_key ? String(data.plan_key) : null,
      sum_assured:
        data.sum_assured != null && data.sum_assured !== ""
          ? Number(data.sum_assured)
          : null,
      ref,
      pdpa_ok: true,
      user_agent:
        req.headers.get("user-agent") || String(data.user_agent || ""),

      // ฟิลด์เสริมสำหรับการทำ Attribution/Analytics
      gender: data.gender ?? null,
      birth_date: data.birth_date ?? null,
      source_url: data.source_url ?? null,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
    } as const;

    const supabase = supabaseServer();
    const { error } = await supabase.from("leads").insert(row);
    if (error) {
      console.error("[leads.insert]", error);
      return NextResponse.json(
        { ok: false, error: "db_error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[api/lead] POST error:", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
