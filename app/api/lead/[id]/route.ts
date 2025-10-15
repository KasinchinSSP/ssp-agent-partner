import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type Params = { id: string };

// GET /api/lead/:id — อ่านข้อมูล lead ตาม id (ต้องผ่าน RLS ตามสิทธิ์ของผู้เรียกใช้)
export async function GET(_req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
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
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }

    // Map เป็นรูปแบบ camelCase ฝั่ง API ให้ใช้งานง่ายใน Frontend
    const lead = {
      id: data.id,
      fullName: data.full_name,
      phone: data.phone,
      age: data.age,
      planKey: data.plan_key,
      sumAssured: data.sum_assured,
      ref: data.ref,
      gender: data.gender,
      birthDate: data.birth_date,
      sourceUrl: data.source_url,
      utm: {
        source: data.utm_source,
        medium: data.utm_medium,
        campaign: data.utm_campaign,
        content: data.utm_content,
        term: data.utm_term,
      },
      createdAt: data.created_at,
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
