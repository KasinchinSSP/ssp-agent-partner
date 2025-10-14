"use client";
import { useEffect, useMemo, useState } from "react";
import type { PlansFile, PlanStd, CalcInput } from "@/lib/premium/client/types";
import { adaptPlans } from "@/lib/premium/client/adapter";
import { calcPremiumClient } from "@/lib/premium/client/engine";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { KeyPoints } from "@/components/KeyPoints";
import { StickyQuoteBar } from "@/components/StickyQuoteBar";

function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function ProductDetailPage({
  params,
  searchParams,
}: {
  params: { planKey: string };
  searchParams: { ref?: string };
}) {
  const { planKey } = params;
  const ref = searchParams.ref || "";
  const [plan, setPlan] = useState<PlanStd | null>(null);
  const [gender, setGender] = useState<"M" | "F">("M");
  const [dob, setDob] = useState<string>("1990-01-01");
  const [sa, setSa] = useState<number | undefined>();
  const [out, setOut] = useState<any>(null);

  const keyPoints = [
    "ชำระเบี้ยระยะสั้น คุ้มครองยาว",
    "รับเงินคืน/ผลประโยชน์ตามเงื่อนไขแผน",
    "ออกแบบงวดชำระได้ รายปี/ราย 6 เดือน/รายเดือน",
  ];

  useEffect(() => {
    (async () => {
      const res = await fetch("/data/pla_insurance.json", {
        cache: "no-store",
      });
      const raw: PlansFile = await res.json();
      const std = adaptPlans(raw);
      const f = std.find((x) => x.key === planKey);
      if (f) {
        setPlan(f);
        setSa(f.minSumAssured);
        setDob("1990-01-01");
      }
    })();
  }, [planKey]);

  useEffect(() => {
    if (!plan) return;
    const input: CalcInput = {
      planKey: plan.key,
      gender,
      dob,
      sumAssured: sa ?? plan.minSumAssured,
      payMode: "annual",
    };
    const r = calcPremiumClient(plan, input);
    setOut(r);
  }, [plan, gender, dob, sa]);

  const annual = out?.ok ? out?.premiums?.annual : undefined;

  if (!plan)
    return (
      <main className="mx-auto max-w-screen-lg px-4 py-6">กำลังโหลด...</main>
    );

  return (
    <main className="mx-auto max-w-screen-lg px-4 pb-28 pt-4">
      <Hero title={plan.name} subtitle="เครื่องคำนวณเบี้ยโดยประมาณ (MVP)" />

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* left column */}
        <div className="lg:col-span-2 space-y-4">
          <Section title="จุดเด่นของแผน">
            <KeyPoints items={keyPoints} />
          </Section>

          <Section title="ข้อมูลแผนเบื้องต้น">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-slate-700">
              <div>
                <div className="text-slate-500">อายุรับประกัน</div>
                <div className="font-medium">
                  {plan.issueAgeMin}–{plan.issueAgeMax} ปี
                </div>
              </div>
              <div>
                <div className="text-slate-500">ทุนขั้นต่ำ</div>
                <div className="font-medium">
                  {plan.minSumAssured.toLocaleString()} บาท
                </div>
              </div>
              <div>
                <div className="text-slate-500">หน่วยอ้างอิงเรท</div>
                <div className="font-medium">
                  {plan.calc.unit?.toLocaleString?.() || 1000} บาท
                </div>
              </div>
            </div>
          </Section>

          <Section title="คำถามที่พบบ่อย">
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center justify-between py-2 text-slate-800 font-medium">
                1. แบบประกันนี้เหมาะกับใคร?
                <span className="text-slate-400 group-open:rotate-180 transition">
                  ⌄
                </span>
              </summary>
              <p className="text-sm text-slate-600">
                ผู้ที่ต้องการออมระยะกลาง มีความคุ้มครองชีวิต
                และต้องการทราบเบี้ยโดยประมาณล่วงหน้า
              </p>
            </details>
            <hr className="my-2" />
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center justify-between py-2 text-slate-800 font-medium">
                2. สามารถลดหย่อนภาษีได้หรือไม่?
                <span className="text-slate-400 group-open:rotate-180 transition">
                  ⌄
                </span>
              </summary>
              <p className="text-sm text-slate-600">
                ขึ้นอยู่กับกฎหมายภาษีและเงื่อนไขในปีภาษีนั้น ๆ
                โปรดตรวจสอบอีกครั้งก่อนยื่นภาษี
              </p>
            </details>
            <hr className="my-2" />
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center justify-between py-2 text-slate-800 font-medium">
                3. เบี้ยที่แสดงนี้เป็นตัวเลขสุดท้ายหรือไม่?
                <span className="text-slate-400 group-open:rotate-180 transition">
                  ⌄
                </span>
              </summary>
              <p className="text-sm text-slate-600">
                เป็นการคำนวณเบื้องต้นสำหรับการประเมินเท่านั้น
                ตัวเลขจริงขึ้นกับการพิจารณารับประกันและเงื่อนไขบริษัท
              </p>
            </details>
          </Section>
        </div>

        {/* right column – calculator card */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4 space-y-4">
            <Section title="คำนวณเบี้ยแบบย่อ">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-sm text-slate-700">
                  เพศ
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                  >
                    <option value="M">ชาย</option>
                    <option value="F">หญิง</option>
                  </select>
                </label>
                <label className="text-sm text-slate-700">
                  วันเกิด (ค.ศ.)
                  <input
                    type="date"
                    max={todayISO()}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </label>
                <label className="text-sm text-slate-700 sm:col-span-2">
                  ทุนเอาประกัน (ขั้นต่ำ {plan.minSumAssured.toLocaleString()}{" "}
                  บาท)
                  <input
                    type="number"
                    min={plan.minSumAssured}
                    step={10000}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                    value={sa ?? plan.minSumAssured}
                    onChange={(e) =>
                      setSa(Number(e.target.value) || plan.minSumAssured)
                    }
                  />
                </label>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
                {out?.ok ? (
                  <div className="space-y-1">
                    <div>
                      อายุ (ปีเต็ม): <b>{out.age}</b>
                    </div>
                    <div>
                      เบี้ยประมาณ / ปี:{" "}
                      <b className="text-[#003366]">
                        {out.premiums.annual.toLocaleString()}
                      </b>{" "}
                      บาท
                    </div>
                    <div className="text-slate-500">
                      6 เดือน: {out.premiums.semiannual.toLocaleString()} · 3
                      เดือน: {out.premiums.quarterly.toLocaleString()} · เดือน:{" "}
                      {out.premiums.monthly.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      เรทต่อหน่วย ≈ {out.ratePerUnit} /{" "}
                      {plan.calc.unit?.toLocaleString?.() || 1000} · ฐานรายปี{" "}
                      {out.baseAnnual?.toLocaleString()} บาท
                    </div>
                  </div>
                ) : (
                  <div className="text-rose-600">
                    {out?.message || "คำนวณไม่สำเร็จ"}
                  </div>
                )}
              </div>

              <a
                href={`/quote?plan=${encodeURIComponent(plan.key)}${
                  ref ? `&ref=${encodeURIComponent(ref)}` : ""
                }`}
                className="mt-4 block text-center rounded-xl bg-[#003366] text-white px-4 py-3 font-medium shadow hover:bg-[#00264d]"
              >
                ขอใบเสนอราคา
              </a>
              <p className="text-[11px] text-slate-500 mt-2">
                ตัวเลขนี้เป็นการประมาณการเพื่อประกอบการตัดสินใจเท่านั้น
              </p>
            </Section>
          </div>
        </div>
      </div>

      <StickyQuoteBar
        annual={annual}
        onClick={() => {
          window.location.href = `/quote?plan=${encodeURIComponent(plan.key)}${
            ref ? `&ref=${encodeURIComponent(ref)}` : ""
          }`;
        }}
      />
    </main>
  );
}
