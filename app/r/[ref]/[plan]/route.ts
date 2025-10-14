import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: NextRequest, context: any) {
  const params = (await context?.params) ?? {};
  const ref = String(params.ref || "");
  const plan = String(params.plan || "");

  if (!ref || !plan) {
    return NextResponse.json(
      { ok: false, error: "bad_params" },
      { status: 400 }
    );
  }

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

  const target = new URL(
    `/plans/${encodeURIComponent(plan)}`,
    request.nextUrl.origin
  );
  target.searchParams.set("ref", ref);
  return NextResponse.redirect(target, { status: 302 });
}
