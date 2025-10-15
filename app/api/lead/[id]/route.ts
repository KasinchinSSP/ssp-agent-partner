import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type Params = { id: string };

type LeadRow = {
  id: string;
  full_name: string;
  phone: string;
  age: number | null;
  plan_key: string | null;
  sum_assured: number | null;
  ref: string;
  gender: string | null;
  birth_date: string | null;
  source_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
};

// ⚠️ Next.js 15.5: context.params เป็น Promise ต้อง await ก่อนใช้งาน
// GET /api/lead/:id — อ่านข้อมูล lead ตาม id (อยู่ภายใต้ RLS)
export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "missing_id" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("leads")
      .select(
        [
          "id",
          "full_name",
          "phone",
          "age",
          "plan_key",
          "sum_assured",
          "ref",
          "gender",
          "birth_date",
          "source_url",
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "utm_term",
          "created_at",
        ].join(",")
      )
      .eq("id", id)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }

    // กำหนดประเภทอย่างชัดเจนเพื่อเลี่ยง union type ของไลบรารี
    const row = data as unknown as LeadRow;

    const lead = {
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      age: row.age,
      planKey: row.plan_key,
      sumAssured: row.sum_assured,
      ref: row.ref,
      gender: row.gender,
      birthDate: row.birth_date,
      sourceUrl: row.source_url,
      utm: {
        source: row.utm_source,
        medium: row.utm_medium,
        campaign: row.utm_campaign,
        content: row.utm_content,
        term: row.utm_term,
      },
      createdAt: row.created_at,
    };

    return NextResponse.json({ ok: true, lead }, { status: 200 });
  } catch (e) {
    console.error("[api/lead/:id] GET error:", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
