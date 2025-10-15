import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (typeof data.hp === "string" && data.hp.trim() !== "") {
      return NextResponse.json(
        { ok: false, error: "blocked" },
        { status: 400 }
      );
    }

    const pdpaOk =
      data.pdpa_ok === true || data.pdpa_ok === "true" || data.pdpa_ok === "on";
    if (!pdpaOk)
      return NextResponse.json(
        { ok: false, error: "pdpa_required" },
        { status: 400 }
      );

    const fullName = (data.full_name || "").trim();
    const phone = (data.phone || "").trim();
    const refFromBody = (data.ref || "").trim();
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

    const row = {
      full_name: fullName,
      phone,
      age: data.age ? Number(data.age) : null,
      plan_key: data.plan_key || null,
      sum_assured: data.sum_assured ? Number(data.sum_assured) : null,
      ref,
      pdpa_ok: true,
      user_agent: req.headers.get("user-agent") || data.user_agent || null,
      gender: data.gender ?? null,
      birth_date: data.birth_date ?? null,
      source_url: data.source_url ?? null,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
    };

    const supabase = supabaseServer();
    const { error } = await supabase.from("leads").insert(row);
    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[api/lead] error", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
