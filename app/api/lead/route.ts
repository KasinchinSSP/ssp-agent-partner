export async function POST(req: Request) {
  const data = await req.json();
  // TODO: ต่อ DB (Supabase) ทีหลัง
  console.log("NEW LEAD:", data); // ชั่วคราว: ดูใน Vercel → Logs
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
