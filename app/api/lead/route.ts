import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type Params = { id: string };

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;

  // ดึงเฉพาะฟิลด์ที่จำเป็นต่อการทำ payload
  const { data, error } = await supabaseServer
    .from("leads")
    .select("id, full_name, phone, age, plan, ref, created_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 404 }
    );
  }

  // ปรับชื่อคีย์ให้ตรงที่ฝั่ง client จะใช้
  const lead = {
    id: data.id,
    fullName: data.full_name,
    phone: data.phone,
    age: data.age,
    plan: data.plan,
    ref: data.ref,
    createdAt: data.created_at,
  };

  return NextResponse.json(lead, { status: 200 });
}
