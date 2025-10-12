"use client";
import { useEffect, useMemo, useState } from "react";
import type { PlansFile, PlanStd, CalcInput } from "@/lib/premium/client/types";
import { adaptPlans } from "@/lib/premium/client/adapter";
import { calcPremiumClient } from "@/lib/premium/client/engine";

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
  const [sumAssured, setSumAssured] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/data/pla_insurance.json", {
        cache: "no-store",
      });
      const raw: PlansFile = await res.json();
      const std = adaptPlans(raw);
      const found = std.find((x) => x.key === planKey);
      if (found) {
        setPlan(found);
        setSumAssured(found.minSumAssured);
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
      sumAssured: sumAssured ?? plan.minSumAssured,
      payMode: "annual",
    };
    const out = calcPremiumClient(plan, input);
    setResult(out);
  }, [plan, gender, dob, sumAssured]);

  if (!plan)
    return (
      <main style={{ padding: 24 }}>
        <h1>กำลังโหลด...</h1>
      </main>
    );

  return (
    <main style={{ padding: 24, maxWidth: 840, margin: "0 auto" }}>
      <a href="/products" style={{ textDecoration: "none", color: "#666" }}>
        ← กลับไปหน้าผลิตภัณฑ์
      </a>
      <h1 style={{ marginTop: 8 }}>{plan.name}</h1>
      <section
        style={{
          marginTop: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
        }}
      >
        <div
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}
        >
          <label>
            เพศ
            <br />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
            >
              <option value="M">ชาย</option>
              <option value="F">หญิง</option>
            </select>
          </label>
          <label>
            วันเกิด (ค.ศ.)
            <br />
            <input
              type="date"
              value={dob}
              max={todayISO()}
              onChange={(e) => setDob(e.target.value)}
            />
          </label>
          <label>
            ทุนเอาประกัน (ขั้นต่ำ {plan.minSumAssured.toLocaleString()} บาท)
            <br />
            <input
              type="number"
              min={plan.minSumAssured}
              step={10000}
              value={sumAssured ?? plan.minSumAssured}
              onChange={(e) =>
                setSumAssured(Number(e.target.value) || plan.minSumAssured)
              }
            />
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          {result?.ok ? (
            <>
              <div>
                อายุ (ปีเต็ม): <b>{result.age}</b>
              </div>
              <div>
                ทุนเอาประกัน: <b>{(result.sumAssured || 0).toLocaleString()}</b>{" "}
                บาท
              </div>
              <div style={{ marginTop: 8 }}>
                <b>เบี้ยโดยประมาณ</b>
                <ul>
                  <li>
                    รายปี: <b>{result.premiums.annual.toLocaleString()}</b> บาท
                  </li>
                  <li>
                    ราย 6 เดือน: {result.premiums.semiannual.toLocaleString()}{" "}
                    บาท
                  </li>
                  <li>
                    ราย 3 เดือน: {result.premiums.quarterly.toLocaleString()}{" "}
                    บาท
                  </li>
                  <li>
                    รายเดือน: {result.premiums.monthly.toLocaleString()} บาท
                  </li>
                </ul>
                <div style={{ color: "#888", fontSize: 12 }}>
                  เรทต่อหน่วย (≈/{plan.calc.unit}): {result.ratePerUnit} ·
                  เบี้ยรายปีฐาน: {result.baseAnnual?.toLocaleString()} บาท
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: "crimson" }}>
              {result?.message || "คำนวณไม่สำเร็จ"}
            </div>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <a
            href={`/quote?plan=${encodeURIComponent(plan.key)}${
              ref ? `&ref=${encodeURIComponent(ref)}` : ""
            }`}
          >
            ขอใบเสนอราคา
          </a>
        </div>
      </section>
    </main>
  );
}
