"use client";
import { useEffect, useState } from "react";

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
        if (!id) throw new Error("ไม่พบ lead");

        // ดึงข้อมูล lead จาก API ของเรา (ทำ route เพิ่มเล็กน้อย)
        const res = await fetch(`/api/lead/${id}`);
        const lead = await res.json();

        // ตัวอย่าง payload (ปรับชื่อคีย์ให้ตรงกับสคริปต์ Tampermonkey ของคุณ)
        const payload = {
          insured: {
            fullName: lead.full_name,
            age: lead.age,
            phone: lead.phone,
          },
          plan: lead.plan,
        };

        // วิธีส่ง: 1) URL fragment ให้สคริปต์ดึงจาก location.hash
        const url = `https://iapply.pla.example/path#data=${encodeURIComponent(
          JSON.stringify(payload)
        )}`;

        window.open(url, "_blank"); // เปิด iAPPLY/BIS
        setStatus("เปิด iAPPLY/BIS แล้ว");
      } catch (e: any) {
        setStatus("ผิดพลาด: " + e.message);
      }
    })();
  }, [searchParams.lead]);

  return (
    <main style={{ padding: 24 }}>
      <p>{status}</p>
    </main>
  );
}
