import { supabaseServer } from "../../lib/supabaseServer";

export default async function AgentPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const ref = searchParams.ref || "";
  const { data: leads, error } = await supabaseServer
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)
    .maybeSingle(); // NOTE: ถ้าต้องการหลายแถวให้เอา maybeSingle() ออก

  // เวอร์ชันหลายแถว (แนะนำ):
  // const { data: leads, error } = await supabaseServer
  //   .from("leads")
  //   .select("*")
  //   .eq(ref ? "ref" : "ref", ref || "") // ถ้ากำหนด ref คัดเฉพาะ, ไม่งั้นว่าง
  //   .order("created_at", { ascending: false })
  //   .limit(100);

  // แก้ให้ถูก: ใช้แบบนี้แทนด้านบน (หลายแถว + เงื่อนไข ref):
  const query = supabaseServer
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const { data, error: err } = ref ? await query.eq("ref", ref) : await query;
  const list = data || [];

  return (
    <main style={{ padding: 24 }}>
      <h1>กล่องงานตัวแทน</h1>
      <p>
        ใส่โค้ดตัวแทนใน URL เช่น <code>/agent?ref=AG123</code>
      </p>
      {err && <p style={{ color: "red" }}>{String(err.message)}</p>}
      <table border={1} cellPadding={6} style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>วันที่</th>
            <th>ชื่อ</th>
            <th>เบอร์</th>
            <th>อายุ</th>
            <th>แผน</th>
            <th>Ref</th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {list.map((x: any) => (
            <tr key={x.id}>
              <td>{new Date(x.created_at).toLocaleString()}</td>
              <td>{x.full_name}</td>
              <td>{x.phone}</td>
              <td>{x.age ?? ""}</td>
              <td>{x.plan ?? ""}</td>
              <td>{x.ref ?? ""}</td>
              <td>
                {/* ปุ่มเตรียมไป Autofill (ใส่ payload พื้นฐาน) */}
                <a href={`/tools/open-apply?lead=${x.id}`}>เปิด iAPPLY/BIS</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
