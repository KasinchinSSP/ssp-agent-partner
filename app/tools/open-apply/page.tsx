"use client";

import { useEffect, useState } from "react";

// ตั้งใน Vercel → Environment Variables → NEXT_PUBLIC_IAPPLY_URL
const IAPPLY_URL =
  process.env.NEXT_PUBLIC_IAPPLY_URL || "https://example.com/iapply-entry";

export default function OpenApply({
  searchParams,
}: {
  searchParams: { lead?: string };
}) {
  const [status, setStatus] = useState("กำลังเตรียมข้อมูล...");

  useEffect(() => {
    (async () => {
      try {
        const id = searchParams.lead;
        if (!id) throw new Error("ไม่พบรหัส lead");

        // ดึงข้อมูล lead รายตัว
        const res = await fetch(`/api/lead/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("โหลดข้อมูล lead ไม่สำเร็จ");
        const lead = await res.json();

        // สร้าง payload สำหรับสคริปต์ Autofill (แก้คีย์ให้ตรงกับสคริปต์ของคุณได้)
        const payload = {
          leadId: lead.id,
          ref: lead.ref,
          insured: {
            fullName: lead.fullName,
            age: lead.age,
            phone: lead.phone,
            // ถ้าต้องการเพิ่ม ฟิลด์อื่นเช่น dob/title/address ให้เติมจากตาราง leads ภายหลัง
          },
          plan: {
            key: lead.plan,
            // sumAssured/mode ฯลฯ ใส่ในอนาคตได้
          },
          meta: {
            from: "agent-portal",
            at: new Date().toISOString(),
          },
        };

        // ส่งผ่าน URL hash (ง่ายสุด)
        const url = `${IAPPLY_URL}#data=${encodeURIComponent(
          JSON.stringify(payload)
        )}`;

        window.open(url, "_blank");
        setStatus("เปิด iAPPLY/BIS แล้ว (มี payload แนบไปใน URL hash)");
      } catch (e: any) {
        setStatus("ผิดพลาด: " + e.message);
      }
    })();
  }, [searchParams.lead]);

  return (
    <main style={{ padding: 24 }}>
      <h1>เปิด iAPPLY/BIS</h1>
      <p>{status}</p>
      <p style={{ marginTop: 12 }}>
        หมายเหตุ: ให้สคริปต์ Tampermonkey/Extension ฝั่ง iAPPLY อ่าน{" "}
        <code>location.hash</code> แล้วจัดการกรอกอัตโนมัติ
      </p>
    </main>
  );
}
