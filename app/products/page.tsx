"use client";
import { useEffect, useState } from "react";
import type { PlansFile } from "@/lib/premium/client/types";

export default function ProductsListPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/data/pla_insurance.json", {
        cache: "no-store",
      });
      const raw: PlansFile = await res.json();
      setPlans(raw.plans || []);
    })();
  }, []);
  return (
    <main style={{ padding: 24 }}>
      <h1>ผลิตภัณฑ์แบบประกันทั้งหมด</h1>
      <p>คลิกเพื่อเข้าไปคำนวณเบี้ยแบบคร่าว ๆ</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
          marginTop: 16,
        }}
      >
        {plans.map((p) => (
          <a
            key={p.planKey}
            href={`/products/${encodeURIComponent(p.planKey)}`}
            style={{
              border: "1px solid #eee",
              padding: 16,
              borderRadius: 12,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontWeight: 600 }}>{p.planName}</div>
            <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
              อายุรับประกัน: {p.ageRange?.min}–{p.ageRange?.max} ปี
            </div>
            <div style={{ color: "#666", fontSize: 13 }}>
              ทุนขั้นต่ำ: {Number(p.minSumAssured || 0).toLocaleString()} บาท
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
