import { NextRequest, NextResponse } from "next/server";
import { supabaseServer, supabaseService } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Record<string, any>;

    // Honeypot
    if (typeof data.hp === "string" && data.hp.trim() !== "") {
      return NextResponse.json(
        { ok: false, error: "blocked" },
        { status: 400 }
      );
    }

    // PDPA
    const pdpaOk =
      data.pdpa_ok === true || data.pdpa_ok === "true" || data.pdpa_ok === "on";
    if (!pdpaOk)
      return NextResponse.json(
        { ok: false, error: "pdpa_required" },
        { status: 400 }
      );

    const fullName = (data.full_name || "").toString().trim();
    const phone = (data.phone || "").toString().trim();
    const refFromBody = (data.ref || "").toString().trim();
    const refFromCookie = req.cookies.get("agent_ref")?.value?.trim() || "";
    const ref = refFromBody || refFromCookie;

    if (!fullName || !phone)
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    if (!/^0[0-9]{9}$/.test(phone))
      return NextResponse.json(
        { ok: false, error: "invalid_phone" },
        { status: 400 }
      );
    if (!ref)
      return NextResponse.json(
        { ok: false, error: "ref_required" },
        { status: 400 }
      );

    const admin = supabaseService();
    const { data: agent, error: agentErr } = await admin
      .from("agent_profiles")
      .select("id, code")
      .eq("code", ref)
      .maybeSingle();

    if (agentErr) {
      console.error("[api/lead] agent lookup error:", agentErr);
      return NextResponse.json(
        { ok: false, error: "db_error", detail: agentErr.message },
        { status: 500 }
      );
    }
    if (!agent) {
      return NextResponse.json(
        { ok: false, error: "ref_unknown" },
        { status: 400 }
      );
    }

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
      gender: data.gender ?? null,
      birth_date: data.birth_date ?? null,
      source_url: data.source_url ?? null,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
    } as const;

    // ✅ ใช้ service role เพื่อหลีกเลี่ยง RLS ระหว่างยังไม่ตั้ง policy
    const { error } = await admin.from("leads").insert(row);

    if (error) {
      console.error("[leads.insert]", error);
      // ส่งรายละเอียดช่วยดีบัก (หากกังวล security สามารถตัด detail ออกได้ภายหลัง)
      return NextResponse.json(
        { ok: false, error: "db_error", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error("[api/lead] POST error:", e);
    return NextResponse.json(
      { ok: false, error: "server_error", detail: e?.message || null },
      { status: 500 }
    );
  }
}
