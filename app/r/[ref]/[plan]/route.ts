import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type Params = { ref: string; plan: string };

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { ref, plan } = params;

  try {
    const supabase = supabaseServer();
    await supabase.from("ref_events").insert({
      ref,
      plan,
      path: request.nextUrl.pathname,
      user_agent: request.headers.get("user-agent") || "",
    });
  } catch (e) {
    console.error("[ref_events.insert] skip error:", e);
  }

  const target = new URL(`/plans/${plan}`, request.nextUrl.origin);
  target.searchParams.set("ref", ref);

  return NextResponse.redirect(target, { status: 302 });
}
