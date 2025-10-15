import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabaseServer";

type Params = { ref: string; plan: string };

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const { ref, plan } = await context.params;

  try {
    const admin = supabaseService();
    await admin.from("ref_events").insert({
      ref,
      plan,
      path: request.nextUrl.pathname,
      user_agent: request.headers.get("user-agent") || "",
    });
  } catch {}

  const target = new URL(
    `/products/${encodeURIComponent(plan)}?ref=${encodeURIComponent(ref)}`,
    request.nextUrl.origin
  );

  const res = NextResponse.redirect(target, { status: 302 });
  res.cookies.set("agent_ref", ref, {
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
    sameSite: "lax",
  });
  return res;
}
