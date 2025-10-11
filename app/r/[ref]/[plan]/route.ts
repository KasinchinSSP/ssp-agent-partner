import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../../../lib/supabaseServer";
// เส้นทาง relative: route.ts อยู่ใน app/r/[ref]/[plan]/route.ts
// ขึ้นไป root 4 ชั้น => ../../../../.. แล้วเข้า lib/supabaseServer

type Params = { ref: string; plan: string };

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const { ref, plan } = await context.params;

  // บันทึก event ไว้ดูสถิติ
  await supabaseServer.from("ref_events").insert({
    ref,
    plan,
    path: request.nextUrl.pathname,
    user_agent: request.headers.get("user-agent") || "",
  });

  // redirect ไปหน้าแผน พร้อมติด ref
  const target = new URL(
    `/plans/${plan}?ref=${encodeURIComponent(ref)}`,
    request.nextUrl.origin
  );
  return NextResponse.redirect(target, { status: 302 });
}
