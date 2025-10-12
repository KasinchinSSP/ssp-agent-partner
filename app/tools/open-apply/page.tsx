"use client";

import { useEffect, useState } from "react";

const BIS_MAIN_URL =
  process.env.NEXT_PUBLIC_BIS_MAIN_URL ||
  "https://iservice.philliplife.com/bis2/#/main";
const BIS_LOGIN_URL =
  process.env.NEXT_PUBLIC_BIS_LOGIN_URL ||
  "https://iservice.philliplife.com/bis2/#/login";

/** ต่อพารามิเตอร์ data ให้ถูกต้องกับ URL ที่มี hash routing (#/...) */
function attachDataParam(baseUrl: string, encodedData: string) {
  if (baseUrl.includes("#")) {
    const [prefix, hash] = baseUrl.split("#", 2); // "https://.../bis2/" + "/main"
    const sep = hash.includes("?") ? "&" : "?";
    return `${prefix}#${hash}${sep}data=${encodedData}`;
  }
  return `${baseUrl}#data=${encodedData}`;
}

/** แยกชื่อ-นามสกุลแบบง่าย (ถ้าฐานเก็บเป็น fullName เดียว) */
function splitName(fullName: string | undefined) {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.slice(-1).join(" "),
  };
}

/** map คีย์แผนภายใน → ชื่อ/โค้ดที่ปรากฏใน select ของ BIS (ปรับให้ตรงกับของจริง) */
const PLAN_MAP: Record<string, { name?: string; code?: string }> = {
  "happy-value": { name: "Happy Value 20/10" },
  "happy-protect": { name: "Happy Protect 20/10" },
  // เติม mapping อื่นๆ ตามที่มีจริงใน BIS
};

export default function OpenApply({
  searchParams,
}: {
  searchParams: { lead?: string; via?: "login" | "main" };
}) {
  const [status, setStatus] = useState("กำลังเตรียมข้อมูล...");
  const via = (searchParams.via as "login" | "main") || "main";

  useEffect(() => {
    (async () => {
      try {
        const id = searchParams.lead;
        if (!id) throw new Error("ไม่พบรหัส lead");

        // 1) ดึงข้อมูล lead จาก API ของเรา
        const res = await fetch(`/api/lead/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("โหลดข้อมูล lead ไม่สำเร็จ");
        const lead = await res.json();

        // 2) เตรียมข้อมูลพื้นฐาน
        const { firstName, lastName } = splitName(lead.fullName);
        const planKey = String(lead.plan || "")
          .trim()
          .toLowerCase();
        const planDef = PLAN_MAP[planKey] || { name: lead.plan }; // fallback ใช้ชื่อเดิม
        const sumAssured = lead.sumAssured || ""; // ถ้ายังไม่มีในฐาน เดี๋ยวข้อ C จะอธิบายเพิ่ม

        // 3) สร้าง payload ขั้นต่ำ (ให้ตรงกับ Tampermonkey minimal)
        const payload = {
          leadId: lead.id,
          ref: lead.ref,
          insured: {
            firstName,
            lastName,
            gender: lead.gender || "", // ถ้ายังไม่มีในฐาน จะเป็น "" แล้วสคริปต์จะข้ามเอง
            // dob: { d: 15, m: 3, y: 1992 }, // ถ้ามีวันเกิดในฐาน ให้เติมเป็น ค.ศ.
          },
          plan: {
            name: planDef.name, // หรือใช้ code ถ้าคุณทราบ value ใน <option>
            // code: planDef.code,
            sumAssured,
          },
        };

        const encoded = encodeURIComponent(JSON.stringify(payload));

        // 4) เลือกปลายทาง BIS: main หรือ login
        const targetBase = via === "login" ? BIS_LOGIN_URL : BIS_MAIN_URL;
        const finalUrl = attachDataParam(targetBase, encoded);

        window.open(finalUrl, "_blank");
        setStatus(
          `เปิด BIS แล้ว: ${
            finalUrl.includes("#/") ? "#/...?data=" : "#data="
          } แนบ payload เรียบร้อย`
        );
      } catch (e: any) {
        console.error(e);
        setStatus("ผิดพลาด: " + e.message);
      }
    })();
  }, [searchParams.lead, via]);

  return (
    <main style={{ padding: 24 }}>
      <h1>เปิด BIS</h1>
      <p>{status}</p>
      <p style={{ marginTop: 12 }}>
        หมายเหตุ: ฝั่ง Tampermonkey ต้องอ่านพารามิเตอร์ <code>data</code> ในส่วน
        hash (รองรับรูปแบบ <code>#/main?data=...</code> และ{" "}
        <code>#data=...</code>).
      </p>
    </main>
  );
}
