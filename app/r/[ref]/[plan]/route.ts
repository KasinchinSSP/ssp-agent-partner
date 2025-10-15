import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabaseServer";

type Params = { ref: string; plan: string };

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { ref, plan } = params;

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
  return NextResponse.redirect(target, { status: 302 });
}
