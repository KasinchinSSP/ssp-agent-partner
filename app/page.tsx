"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PlansFile } from "@/lib/premium/client/types";
import { AgentContactCard } from "@/components/AgentContactCard";
import { withRef } from "@/lib/utils/ref";

const LIFE_KEYS = [
  "HappyValue90_20",
  "HappyProtection95_20",
  "PremiumReturn25_15",
];
const TAKAFUL_KEYS = ["TakafulFamilyWholeLife90_20"];

function Section({
  title,
  children,
  tint,
}: {
  title?: string;
  children: React.ReactNode;
  tint?: "life" | "takaful";
}) {
  const color = tint === "takaful" ? "#01680b" : "#003366";
  return (
    <section className="mx-auto max-w-screen-lg px-4 mt-8">
      {title && (
        <h2 className="text-xl font-semibold mb-3" style={{ color }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export default function HomePage() {
  const sp = useSearchParams();
  const ref = sp.get("ref") || "";
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/data/pla_insurance.json", {
        cache: "force-cache",
      });
      const raw: PlansFile = await res.json();
      setPlans(raw.plans || []);
    })();
  }, []);

  const life = useMemo(
    () => plans.filter((p) => LIFE_KEYS.includes(p.planKey)),
    [plans]
  );
  const takaful = useMemo(
    () => plans.filter((p) => TAKAFUL_KEYS.includes(p.planKey)),
    [plans]
  );

  return (
    <div>
      {/* 1) Hero */}
      <section className="bg-gradient-to-br from-[var(--brand-life)] to-sky-600">
        <div className="mx-auto max-w-screen-lg px-4 py-10 text-white">
          <div className="text-xs opacity-90">
            เว็บไซต์ทีมตัวแทนในสังกัดบริษัท ฟิลลิปประกันชีวิต
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">
            วางแผนวันนี้ เพื่อความสบายใจวันหน้า กับฟิลลิปประกันชีวิต
          </h1>
          <p className="mt-2 text-white/90 max-w-[52ch]">
            แนะนำผลิตภัณฑ์เด่น ขั้นตอนสมัครชัดเจน
            บริการโดยทีมตัวแทนมืออาชีพภายใต้แบรนด์ที่คุณเชื่อมั่น
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href={withRef("/products", ref)}
              className="rounded-xl bg-white text-[var(--brand-life)] px-4 py-2.5 font-medium shadow hover:bg-slate-50"
            >
              ดูผลิตภัณฑ์
            </Link>
            <Link
              href={withRef("/quote", ref)}
              className="rounded-xl bg-black/20 text-white px-4 py-2.5 font-medium shadow hover:bg-black/30"
            >
              ขอใบเสนอราคา
            </Link>
          </div>
        </div>
      </section>

      {/* Agent contact (ref) */}
      <section className="mx-auto max-w-screen-lg px-4 -mt-6">
        <AgentContactCard />
      </section>

      {/* 2) เกี่ยวกับบริษัทแบบย่อ */}
      <Section title="เกี่ยวกับฟิลลิปประกันชีวิต">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 text-sm text-slate-700">
          ฟิลลิปประกันชีวิตมุ่งเน้นความคุ้มครองและการออมระยะยาวด้วยมาตรฐานการให้บริการแบบมืออาชีพ
          ดูแลโดยทีมตัวแทนที่ผ่านการอบรมและอยู่ภายใต้การกำกับดูแลตามกฎหมาย
          ให้คุณวางแผนได้อย่างมั่นใจ โปร่งใส และตรวจสอบได้
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <li className="flex gap-2">
              <span className="text-green-600">✓</span> แบบประกันหลากหลาย
              ตอบโจทย์คุ้มครองและออม
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span> ขั้นตอนสมัครชัดเจน
              เอกสารครบ โปร่งใส
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>{" "}
              บริการหลังการขายโดยทีมงานมืออาชีพ
            </li>
          </ul>
        </div>
      </Section>

      {/* 3) ผลิตภัณฑ์เด่น – Life */}
      <Section title="ผลิตภัณฑ์เด่น – ประกันชีวิต" tint="life">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {life.map((p: any) => (
            <Link
              key={p.planKey}
              href={withRef(`/products/${encodeURIComponent(p.planKey)}`, ref)}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden group"
            >
              <div className="h-24 bg-[var(--brand-life)]/90" />
              <div className="p-4">
                <div className="font-semibold group-hover:text-[var(--brand-life)]">
                  {p.planName}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  อายุรับประกัน {p.ageRange?.min}–{p.ageRange?.max} ปี •
                  ทุนขั้นต่ำ {Number(p.minSumAssured || 0).toLocaleString()} บ.
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 3) ผลิตภัณฑ์เด่น – Takaful */}
      <Section title="ผลิตภัณฑ์เด่น – ตะกาฟุล" tint="takaful">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {takaful.map((p: any) => (
            <Link
              key={p.planKey}
              href={withRef(`/products/${encodeURIComponent(p.planKey)}`, ref)}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden group"
            >
              <div className="h-24" style={{ backgroundColor: "#01680b" }} />
              <div className="p-4">
                <div className="font-semibold group-hover:text-[#01680b]">
                  {p.planName}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  อายุรับประกัน {p.ageRange?.min}–{p.ageRange?.max} ปี •
                  ทุนขั้นต่ำ {Number(p.minSumAssured || 0).toLocaleString()} บ.
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 4) ขั้นตอนการสมัครประกัน */}
      <Section title="สมัครง่ายใน 3 ขั้นตอน">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              t: "เลือกแบบประกัน",
              d: "เลือกแผนที่เหมาะกับเป้าหมายและงบประมาณ",
            },
            {
              t: "กรอกข้อมูลเบื้องต้น",
              d: "เพื่อประเมินเบี้ยและเอกสารที่ต้องใช้",
            },
            {
              t: "ยืนยันและส่งเรื่อง",
              d: "ทีมตัวแทนช่วยดูแลผ่านระบบของบริษัท",
            },
          ].map((x, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="text-[var(--brand-life)] font-semibold">
                {i + 1}. {x.t}
              </div>
              <div className="text-sm text-slate-700 mt-1">{x.d}</div>
            </div>
          ))}
        </div>
        <div className="text-[12px] text-slate-500 mt-2">
          หมายเหตุ: ตัวเลขเบี้ยบนเว็บไซต์เป็นการประมาณการเบื้องต้น
          ตัวเลขจริงขึ้นกับการพิจารณาและเงื่อนไขบริษัท
        </div>
      </Section>

      {/* 5) ความน่าเชื่อถือ/ประวัติ/ผู้บริหาร (placeholder เนื้อหากลาง) */}
      <Section title="ความน่าเชื่อถือของฟิลลิป">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              t: "มาตรฐานการให้บริการ",
              d: "ยึดมั่นความโปร่งใส ตรวจสอบได้ อยู่ภายใต้การกำกับดูแลตามกฎหมาย",
            },
            {
              t: "ผลิตภัณฑ์ตอบโจทย์",
              d: "พัฒนาแบบประกันเพื่อคนไทย ครอบคลุมทั้งคุ้มครองและออมระยะยาว",
            },
            {
              t: "ทีมบริหารมืออาชีพ",
              d: "มุ่งเน้นคุณภาพการให้คำแนะนำและบริการหลังการขาย",
            },
          ].map((x, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="font-semibold text-slate-800">{x.t}</div>
              <div className="text-sm text-slate-700 mt-1">{x.d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 6) FAQ + Contact */}
      <Section title="คำถามที่พบบ่อย">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          {[
            [
              "เบี้ยที่เห็นในเว็บเป็นตัวเลขสุดท้ายไหม?",
              "เป็นการประมาณการเบื้องต้น ตัวเลขจริงขึ้นกับการพิจารณารับประกันและเงื่อนไขของบริษัท",
            ],
            [
              "ต้องเตรียมเอกสารอะไรบ้าง?",
              "บัตรประชาชน ข้อมูลส่วนตัว/สุขภาพ และเอกสารเพิ่มเติมตามประเภทแบบประกัน",
            ],
            [
              "ชำระเบี้ยแบบไหนได้บ้าง?",
              "รายปี / ราย 6 เดือน / ราย 3 เดือน / รายเดือน (ขึ้นกับแบบประกัน)",
            ],
            [
              "หากต้องการยกเลิกหรือเปลี่ยนแปลงทำได้ไหม?",
              "ทำได้ตามเงื่อนไขกรมธรรม์ โปรดติดต่อทีมตัวแทนเพื่อรับคำแนะนำ",
            ],
          ].map(([q, a], i) => (
            <details
              key={i}
              className="group border-b last:border-b-0 border-slate-200 py-2"
            >
              <summary className="list-none flex items-center justify-between cursor-pointer font-medium text-slate-800">
                {q}
                <span className="text-slate-400 group-open:rotate-180 transition">
                  ⌄
                </span>
              </summary>
              <p className="text-sm text-slate-700 mt-1">{a}</p>
            </details>
          ))}
          <div className="mt-3 flex items-center gap-3">
            <Link
              href={withRef("/quote", ref)}
              className="rounded-xl bg-[var(--brand-life)] text-white px-4 py-2.5 font-medium hover:bg-[#00264d]"
            >
              ขอให้ติดต่อกลับ
            </Link>
            <Link
              href="https://www.philliplife.com/"
              target="_blank"
              className="text-sm text-[var(--brand-life)] underline"
            >
              เว็บไซต์บริษัททางการ
            </Link>
          </div>
        </div>
      </Section>

      {/* 7) Disclaimer */}
      <Section title="ข้อสงวนสิทธิ์">
        <div
          id="disclaimer"
          className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
        >
          เว็บไซต์นี้จัดทำโดยทีมตัวแทนในสังกัดบริษัท ฟิลลิปประกันชีวิต
          มีวัตถุประสงค์เพื่อให้ข้อมูลผลิตภัณฑ์และการคำนวณเบื้องต้นเท่านั้น
          ไม่ใช่เว็บไซต์ทางการของบริษัทฯ
          ข้อมูลและตัวเลขบนเว็บไซต์อาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
          ผลิตภัณฑ์และความคุ้มครองเป็นไปตามเงื่อนไขการรับประกันภัยของบริษัทฯ
          และกฎหมายที่เกี่ยวข้อง โปรดศึกษารายละเอียดความคุ้มครอง เงื่อนไข
          และข้อยกเว้นในเอกสารกรมธรรม์ก่อนตัดสินใจทำประกันภัย
        </div>
      </Section>
    </div>
  );
}
