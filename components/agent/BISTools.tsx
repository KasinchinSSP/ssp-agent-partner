"use client";
export default function BISTools() {
  const bisLogin =
    process.env.NEXT_PUBLIC_BIS_LOGIN_URL ||
    "https://iservice.philliplife.com/bis2/#/login";
  const bisMain =
    process.env.NEXT_PUBLIC_BIS_MAIN_URL ||
    "https://iservice.philliplife.com/bis2/#/main";
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="font-semibold text-slate-800">BIS Tools</div>
      <div className="text-sm text-slate-700 mt-2 space-y-2">
        <a
          target="_blank"
          href={bisLogin}
          className="block rounded-lg border px-3 py-2 hover:bg-slate-50"
        >
          เปิดหน้า Login (BIS)
        </a>
        <a
          target="_blank"
          href={bisMain}
          className="block rounded-lg border px-3 py-2 hover:bg-slate-50"
        >
          เปิดหน้ากรอกข้อมูล (BIS Main)
        </a>
      </div>
      <p className="text-[11px] text-slate-500 mt-2">
        ทิป: ใช้ปุ่มคัดลอก JSON เคสล่าสุดจากหน้า Leads แล้ววางในสคริปต์ Autofill
      </p>
    </section>
  );
}
