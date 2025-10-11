import { supabaseServer } from "@/lib/supabaseServer";

function toDateKey(d: string) {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function AgentStats({
  searchParams,
}: {
  searchParams: { ref?: string; days?: string };
}) {
  const ref = (searchParams.ref || "").trim();
  const days = Number(searchParams.days || "30");
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  if (!ref) {
    return (
      <main style={{ padding: 24 }}>
        <h1>สถิติการตลาด (Agent Stats)</h1>
        <p>
          ใส่โค้ดตัวแทนใน URL เช่น <code>/agent/stats?ref=AG123</code>{" "}
          (ปรับช่วงวันด้วย <code>&days=30</code>)
        </p>
      </main>
    );
  }

  // 1) ดึง ref_events (คลิก/สแกน)
  const { data: events, error: errE } = await supabaseServer
    .from("ref_events")
    .select("id, created_at, plan")
    .eq("ref", ref)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);

  // 2) ดึง leads (ลีดจริง)
  const { data: leads, error: errL } = await supabaseServer
    .from("leads")
    .select("id, created_at, plan")
    .eq("ref", ref)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);

  const clicksByDay: Record<string, number> = {};
  const leadsByDay: Record<string, number> = {};
  (events || []).forEach((e) => {
    const k = toDateKey(e.created_at);
    clicksByDay[k] = (clicksByDay[k] || 0) + 1;
  });
  (leads || []).forEach((l) => {
    const k = toDateKey(l.created_at);
    leadsByDay[k] = (leadsByDay[k] || 0) + 1;
  });

  // รวมคีย์วันทุกวัน
  const daysKeys = Array.from(
    new Set([...Object.keys(clicksByDay), ...Object.keys(leadsByDay)])
  ).sort();
  const totalClicks = (events || []).length;
  const totalLeads = (leads || []).length;
  const conversion = totalClicks ? totalLeads / totalClicks : 0;

  return (
    <main style={{ padding: 24 }}>
      <h1>สถิติการตลาด</h1>
      <p>
        Agent: <b>{ref}</b> | ช่วง: <b>{days}</b> วันล่าสุด
      </p>

      {(errE || errL) && (
        <p style={{ color: "red" }}>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
      )}

      <div style={{ marginTop: 12 }}>
        <b>สรุปรวม:</b> คลิก/สแกน: {totalClicks} ครั้ง · ลีดจริง: {totalLeads}{" "}
        ราย · Conversion: {(conversion * 100).toFixed(1)}%
      </div>

      <table
        border={1}
        cellPadding={6}
        style={{ marginTop: 12, width: "100%", maxWidth: 800 }}
      >
        <thead>
          <tr>
            <th>วันที่</th>
            <th>คลิก/สแกน</th>
            <th>ลีดจริง</th>
            <th>Conversion</th>
          </tr>
        </thead>
        <tbody>
          {daysKeys.map((k) => {
            const c = clicksByDay[k] || 0;
            const l = leadsByDay[k] || 0;
            const cv = c ? l / c : 0;
            return (
              <tr key={k}>
                <td>{k}</td>
                <td>{c}</td>
                <td>{l}</td>
                <td>{(cv * 100).toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
