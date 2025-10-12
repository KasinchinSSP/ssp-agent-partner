import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Record<string, any>;

    // กันสแปมแบบง่าย: ถ้า honeypot ไม่ว่าง => block
    if (data.hp) {
      return new Response(JSON.stringify({ ok: false, error: "blocked" }), {
        status: 400,
      });
    }

    // ต้องยินยอม PDPA (checkbox ส่งค่า "on")
    if (data.pdpa !== "on") {
      return new Response(
        JSON.stringify({ ok: false, error: "pdpa_required" }),
        { status: 400 }
      );
    }

    // ตรวจฟิลด์จำเป็น
    if (!data.fullName || !data.phone) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing fields" }),
        { status: 400 }
      );
    }

    // ตรวจเบอร์แบบง่าย: 0 + ตัวเลขอีก 9 ตำแหน่ง
    if (!/^0[0-9]{9}$/.test(String(data.phone))) {
      return new Response(
        JSON.stringify({ ok: false, error: "invalid phone" }),
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
