import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ตรวจค่าเบื้องต้น (กันฟอร์มว่าง)
    if (!data.fullName || !data.phone) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing fields" }),
        { status: 400 }
      );
    }

    // เตรียมแถวสำหรับบันทึก
    const row = {
      full_name: String(data.fullName),
      phone: String(data.phone),
      age: data.age ? Number(data.age) : null,
      plan: data.plan ? String(data.plan) : null,
      ref: data.ref ? String(data.ref) : null,
      user_agent: req.headers.get("user-agent") || "",
      pdpa_ok: true, // ฟอร์มเราติ๊ก PDPA แล้วค่อยส่ง (MVP ตั้ง true)
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
