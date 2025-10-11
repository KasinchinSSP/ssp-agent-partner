import { supabaseServer } from "../../../../lib/supabaseServer";
import { NextResponse } from "next/server";

type Params = { ref: string; plan: string };

export async function GET(_req: Request, { params }: { params: Params }) {
  const { ref, plan } = params;

  // บันทึก event
  await supabaseServer.from("ref_events").insert({
    ref,
    plan,
    path: `/r/${ref}/${plan}`,
  });

  // ส่งต่อไปหน้าแบบประกัน พร้อม ref
  const url = new URL(
    `/plans/${plan}?ref=${encodeURIComponent(ref)}`,
    process.env.NEXT_PUBLIC_BASE_URL || "https://" + _req.headers.get("host")
  );
  return NextResponse.redirect(url, { status: 302 });
}
