"use client";
export default function LeadsTable({ rows }: { rows: any[] }) {
  if (!rows?.length)
    return <div className="text-sm text-slate-600 mt-2">ยังไม่มีข้อมูล</div>;
  return (
    <div className="mt-2 overflow-auto">
      <table
        className="w-full text-sm border-separate"
        style={{ borderSpacing: 0 }}
      >
        <thead>
          <tr className="text-slate-500">
            <th className="text-left p-2 border-b">เวลา</th>
            <th className="text-left p-2 border-b">ชื่อ</th>
            <th className="text-left p-2 border-b">แผน</th>
            <th className="text-left p-2 border-b">เพศ</th>
            <th className="text-left p-2 border-b">วันเกิด</th>
            <th className="text-right p-2 border-b">ทุน (บาท)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id} className="hover:bg-slate-50">
              <td className="p-2 border-b text-slate-600">
                {formatDT(r.createdAt)}
              </td>
              <td className="p-2 border-b">{r.fullName || "-"}</td>
              <td className="p-2 border-b">{r.planKey || "-"}</td>
              <td className="p-2 border-b">{r.gender || "-"}</td>
              <td className="p-2 border-b">{r.dob || "-"}</td>
              <td className="p-2 border-b text-right">
                {Number(r.sumAssured || 0).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDT(x: any) {
  try {
    return new Date(x).toLocaleString("th-TH");
  } catch {
    return String(x || "");
  }
}
