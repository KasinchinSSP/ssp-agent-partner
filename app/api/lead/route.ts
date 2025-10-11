// app/api/lead/route.ts
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.fullName || !data.phone) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing fields" }),
        { status: 400 }
      );
    }

    const row = {
      full_name: String(data.fullName),
      phone: String(data.phone),
      age: data.age ? Number(data.age) : null,
      plan: data.plan ? String(data.plan) : null,
      ref: data.ref ? String(data.ref) : null,
      user_agent: req.headers.get("user-agent") || "",
      pdpa_ok: true,
    };

    const { error } = await supabaseServer.from("leads").insert(row);
    if (error) {
      console.error("[leads.insert] error:", error);
      return new Response(JSON.stringify({ ok: false }), { status: 500 });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}
