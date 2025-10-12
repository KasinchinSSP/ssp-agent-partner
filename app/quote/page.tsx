"use client";
import { useState } from "react";

type Props = { searchParams: { plan?: string; ref?: string } };

export default function Quote({ searchParams }: Props) {
  const [saving, setSaving] = useState(false);
  const plan = searchParams.plan || "";
  const ref = searchParams.ref || "";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    alert(res.ok ? "ส่งคำขอแล้ว ขอบคุณครับ" : "มีข้อผิดพลาด ลองใหม่อีกครั้ง");
    if (res.ok) window.location.href = "/";
  }

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>ขอใบเสนอราคา</h1>
      <form onSubmit={submit} autoComplete="off">
        <label>
          ชื่อ-นามสกุล
          <br />
          <input name="fullName" required />
        </label>
        <br />
        <br />
        <label>
          เบอร์โทร
          <br />
          <input
            name="phone"
            required
            pattern="0[0-9]{9}"
            title="กรอกเบอร์ 10 หลักขึ้นต้น 0"
          />
        </label>
        <br />
        <br />
        <label>
          อายุ (ปี)
          <br />
          <input name="age" type="number" min={1} max={100} />
        </label>
        <br />
        <br />
        <label>
          แบบประกัน
          <br />
          <input name="plan" defaultValue={plan} />
        </label>
        <label>
          ทุนเอาประกัน (บาท)
          <br />
          <input name="sumAssured" type="number" min={0} step={1000} />
        </label>

        <input type="hidden" name="ref" value={ref} />

        {/* PDPA */}
        <div style={{ marginTop: 12 }}>
          <label>
            <input type="checkbox" name="pdpa" required />{" "}
            ยินยอมให้ติดต่อกลับตามข้อมูลที่กรอก (PDPA)
          </label>
        </div>

        {/* Honeypot (กันบอท): ช่องซ่อน ต้องว่างเสมอ */}
        <div style={{ display: "none" }}>
          <label>
            ห้ามกรอกช่องนี้
            <input name="hp" />
          </label>
        </div>

        <br />
        <button type="submit" disabled={saving}>
          {saving ? "กำลังส่ง..." : "ส่งคำขอ"}
        </button>
      </form>

      {ref ? (
        <p style={{ marginTop: 12 }}>
          Ref ตัวแทน: <b>{ref}</b>
        </p>
      ) : null}
    </main>
  );
}
