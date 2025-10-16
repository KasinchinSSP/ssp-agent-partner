"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PlansFile } from "@/lib/premium/client/types";
import { AgentContactCard } from "@/components/AgentContactCard";
import { withRef } from "@/lib/utils/ref";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCarousel } from "@/components/ProductCarousel";

function useCookieRef() {
  return useMemo(() => {
    if (typeof document === "undefined") return "";
    const m = document.cookie.match(/(?:^|; )agent_ref=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  }, []);
}

const LIFE_KEYS = [
  "HappyValue90_20",
  "HappyProtection95_20",
  "PremiumReturn25_15",
];
const TAKAFUL_KEYS = ["TakafulFamilyWholeLife90_20"];

// แผนที่อยากโชว์ในส่วน "แบบประกันแนะนำ"
const FEATURED_KEYS = [
  "PremiumReturn25_15",
  "HappyValue90_20",
  "HappyProtection95_20",
];

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

function FeaturedSkeleton() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--background)] to-transparent" />
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-2 -mx-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[88%] sm:w-[60%] lg:w-[32%]"
          >
            <div className="animate-pulse rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-[4/3] rounded-t-2xl bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-2/3 bg-slate-200 rounded" />
                <div className="h-3 w-11/12 bg-slate-200 rounded" />
                <div className="h-3 w-10/12 bg-slate-200 rounded" />
                <div className="h-9 w-full bg-slate-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeClient() {
  const sp = useSearchParams();
  const cookieRef = useCookieRef();
  const ref = sp.get("ref") || cookieRef || ""; // ✅ fallback จาก cookie
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/data/pla_insurance.json", {
          cache: "force-cache",
        });
        const raw: PlansFile = await res.json();
        setPlans(raw.plans || []);
      } finally {
        setLoading(false);
      }
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

  const featured = useMemo(() => {
    const f = plans.filter((p) => FEATURED_KEYS.includes(p.planKey));
    // map เป็นรูปแบบที่ ProductCard ใช้
    return f.map((p: any, idx: number) => ({
      planKey: p.planKey,
      title: p.planName,
      image: `/products/${encodeURIComponent(p.planKey)}.webp`,
      bullets: [
        p.tagline || "ออมสั้น ผลตอบแทนคุ้มค่า",
        `อายุรับประกัน ${p.ageRange?.min}–${p.ageRange?.max} ปี`,
        `ทุนขั้นต่ำ ${Number(p.minSumAssured || 0).toLocaleString()} บ.`,
      ]
        .filter(Boolean)
        .slice(0, 3),
      href: withRef(`/products/${encodeURIComponent(p.planKey)}`, ref),
      highlight: idx === 0,
    }));
  }, [plans, ref]);

  return (
    <div>
      {/* Hero */}
      <HeroCarousel
        slides={[
          {
            srcMobile: "/banners/mobile/banner-01.webp",
            srcDesktop: "/banners/desktop/banner-d-01.webp",
            alt: "ฟิลลิปประกันชีวิต ดูแลคุณและคนที่คุณรัก",
          },
          {
            srcMobile: "/banners/mobile/banner-02.webp",
            srcDesktop: "/banners/desktop/banner-d-02.webp",
            alt: "รับ Cash Back สูงสุด 50,000 บาท",
          },
          {
            srcMobile: "/banners/mobile/banner-03.webp",
            srcDesktop: "/banners/desktop/banner-d-03.webp",
            alt: "ผ่อน 0% สูงสุด 4 เดือน",
          },
          {
            srcMobile: "/banners/mobile/banner-04.webp",
            srcDesktop: "/banners/desktop/banner-d-04.webp",
            alt: "รับ Cash Back สูงสุด 1,000,000 บาท",
          },
        ]}
        autoPlayMs={6000}
        fullBleed
        className="bg-gradient-to-br from-[var(--brand-life)] to-sky-600"
      />

      {/* เกี่ยวกับบริษัท */}
      <Section title="เกี่ยวกับฟิลลิปประกันชีวิต">
        <div className="rounded-2xl mt-4 border border-slate-200 bg-white p-4 sm:p-6 text-sm text-slate-700">
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

      {/* แบบประกันแนะนำ */}
      <Section title="แบบประกันแนะนำ">
        {loading ? <FeaturedSkeleton /> : <ProductCarousel items={featured} />}
      </Section>

      {/* ผลิตภัณฑ์เด่น – Takaful */}
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

      {/* ขั้นตอนการสมัคร */}
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

      {/* ความน่าเชื่อถือ */}
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

      {/* FAQ + ติดต่อ */}
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

      {/* Disclaimer */}
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
