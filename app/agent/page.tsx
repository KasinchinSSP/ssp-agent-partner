import { supabaseServer } from "../../lib/supabaseServer";

export default async function AgentPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const ref = (searchParams.ref || "").trim();

  // ดึง leads โดยกรองตาม ref (ถ้าไม่ใส่ ref จะแสดงว่าง)
  const query = supabaseServer
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data, error } = ref
    ? await query.eq("ref", ref)
    : await query.eq("ref", "__none__");

  return (
    <main style={{ padding: 24 }}>
      <h1>กล่องงานตัวแทน</h1>
      <p>
        ใส่โค้ดตัวแทนใน URL เช่น <code>/agent?ref=AG123</code>
      </p>

      {error && <p style={{ color: "red" }}>เกิดข้อผิดพลาด: {error.message}</p>}
      {!ref && (
        <p style={{ marginTop: 12 }}>
          ยังไม่ได้ใส่ <code>?ref=...</code> จึงยังไม่แสดงรายการ
        </p>
      )}

      <table
        border={1}
        cellPadding={6}
        style={{ marginTop: 16, width: "100%", maxWidth: 1000 }}
      >
        <thead>
          <tr>
            <th>วันที่</th>
            <th>ชื่อ</th>
            <th>เบอร์</th>
            <th>อายุ</th>
            <th>แผน</th>
            <th>Ref</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((x: any) => (
            <tr key={x.id}>
              <td>{new Date(x.created_at).toLocaleString()}</td>
              <td>{x.full_name}</td>
              <td>{x.phone}</td>
              <td>{x.age ?? ""}</td>
              <td>{x.plan ?? ""}</td>
              <td>{x.ref ?? ""}</td>
              <td>
                <a href={`/tools/open-apply?lead=${x.id}`}>เปิด iAPPLY/BIS</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
