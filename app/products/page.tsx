"use client";
import { useEffect, useMemo, useState } from "react";
import type { PlansFile } from "@/lib/premium/client/types";
import { Badge } from "@/components/Badge";

export default function ProductsListPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "life" | "takaful">("all");

  useEffect(() => {
    (async () => {
      const res = await fetch("/data/pla_insurance.json", {
        cache: "no-store",
      });
      const raw: PlansFile = await res.json();
      setPlans(raw.plans || []);
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = tab;
    return (plans || []).filter((p: any) => {
      const passTab =
        t === "all" ? true : (p.category || "life").toLowerCase() === t;
      const passQ = !q
        ? true
        : String(p.planName).toLowerCase().includes(q.toLowerCase());
      return passTab && passQ;
    });
  }, [plans, q, tab]);

  return (
    <main className="mx-auto max-w-screen-lg px-4 pb-24 pt-4">
      <h1 className="text-2xl font-semibold text-[#003366]">
        ผลิตภัณฑ์แบบประกัน
      </h1>

      <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex rounded-xl border border-slate-200 overflow-hidden w-full sm:w-96">
          <input
            className="px-3 py-2 outline-none flex-1"
            placeholder="ค้นหาชื่อแบบประกัน"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1.5 rounded-lg border ${
              tab === "all"
                ? "bg-[#003366] text-white border-[#003366]"
                : "border-slate-200"
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setTab("life")}
            className={`px-3 py-1.5 rounded-lg border ${
              tab === "life"
                ? "bg-[#003366] text-white border-[#003366]"
                : "border-slate-200"
            }`}
          >
            ประกันชีวิต
          </button>
          <button
            onClick={() => setTab("takaful")}
            className={`px-3 py-1.5 rounded-lg border ${
              tab === "takaful"
                ? "bg-[#003366] text-white border-[#003366]"
                : "border-slate-200"
            }`}
          >
            ตะกาฟุล
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p: any) => (
          <a
            key={p.planKey}
            href={`/products/${encodeURIComponent(p.planKey)}`}
            className="group rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition"
          >
            <div className="h-28 rounded-xl bg-gradient-to-r from-[#003366] to-sky-600 relative overflow-hidden">
              <div className="absolute right-3 bottom-3 text-white/90 text-sm">
                ทุนขั้นต่ำ {Number(p.minSumAssured || 0).toLocaleString()} บ.
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2">
                <Badge>
                  {(p.category || "life").toLowerCase() === "takaful"
                    ? "Takaful"
                    : "Life"}
                </Badge>
              </div>
              <div className="font-semibold text-slate-800 group-hover:text-[#003366]">
                {p.planName}
              </div>
              <div className="text-xs text-slate-500">
                อายุรับประกัน {p.ageRange?.min}–{p.ageRange?.max} ปี
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
