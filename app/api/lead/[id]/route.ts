import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type Params = { id: string };

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "missing id" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer(); //
    const { data, error } = await supabase
      .from("leads")
      .select(
        "id, full_name, phone, age, plan_key, ref, sum_assured, created_at"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }

    const lead = {
      id: data.id,
      fullName: data.full_name,
      phone: data.phone,
      age: data.age,
      planKey: data.plan_key,
      ref: data.ref,
      sumAssured: data.sum_assured,
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
