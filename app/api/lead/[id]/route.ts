// app/api/lead/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer"; // ↑ ขึ้น 4 ชั้นให้พอดี

type Params = { id: string };

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;

  const { data, error } = await supabaseServer
    .from("leads")
    .select("id, full_name, phone, age, plan, ref, sum_assured, created_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 404 }
    );
  }

  const lead = {
    id: data.id,
    fullName: data.full_name,
    phone: data.phone,
    age: data.age,
    plan: data.plan,
    ref: data.ref,
    sumAssured: data.sum_assured, // ← เพิ่ม
    createdAt: data.created_at,
  };

  return NextResponse.json(lead, { status: 200 });
}
