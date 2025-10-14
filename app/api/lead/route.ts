import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Record<string, any>;

    if (data.hp) {
      return NextResponse.json(
        { ok: false, error: "blocked" },
        { status: 400 }
      );
    }

    const pdpaOk =
      data.pdpa_ok === true || data.pdpa_ok === "true" || data.pdpa_ok === "on";
    if (!pdpaOk) {
      return NextResponse.json(
        { ok: false, error: "pdpa_required" },
        { status: 400 }
      );
    }

    if (!data.full_name || !data.phone) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    if (!/^0[0-9]{9}$/.test(String(data.phone))) {
      return NextResponse.json(
        { ok: false, error: "invalid_phone" },
        { status: 400 }
      );
    }

    const ref = (data.ref || "").trim();
    if (!ref) {
      return NextResponse.json(
        { ok: false, error: "ref_required" },
        { status: 400 }
      );
    }

    const row = {
      full_name: String(data.full_name),
      phone: String(data.phone),
      age: data.age ? Number(data.age) : null,
      plan_key: data.plan_key ? String(data.plan_key) : null,
      sum_assured: data.sum_assured ? Number(data.sum_assured) : null,
      ref,
      pdpa_ok: true,
      user_agent:
        req.headers.get("user-agent") || String(data.user_agent || ""),
    };

    const supabase = supabaseServer();
    const { error } = await supabase.from("leads").insert(row);

    if (error) {
      console.error("[leads.insert] error:", error);
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
