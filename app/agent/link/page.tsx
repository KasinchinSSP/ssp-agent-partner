"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// แผนที่อยากให้เลือก (เริ่มจาก 2-3 แบบก่อน)
const PLANS = [
  { key: "happy-value", name: "Happy Value" },
  { key: "happy-protect", name: "Happy Protect" },
];

export default function LinkBuilder({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const [ref, setRef] = useState(searchParams.ref || "");
  const [plan, setPlan] = useState(PLANS[0].key);
  const [url, setUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (!ref) {
      setUrl("");
      return;
    }
    setUrl(
      `${baseUrl}/r/${encodeURIComponent(ref)}/${encodeURIComponent(plan)}`
    );
  }, [ref, plan, baseUrl]);

  // สร้าง QR ด้วย dynamic import (ลดขนาด bundle)
  useEffect(() => {
    (async () => {
      if (!url || !canvasRef.current) return;
      const QRCode = (await import("qrcode")).default;
      await QRCode.toCanvas(canvasRef.current, url, { margin: 2, width: 240 });
    })();
  }, [url]);

  function downloadPng() {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement("a");
    link.download = `qr-${ref}-${plan}.png`;
    link.href = c.toDataURL("image/png");
    link.click();
  }

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
      <h1>สร้างลิงก์ + QR สำหรับตัวแทน</h1>

      <div style={{ marginTop: 12 }}>
        <label>
          โค้ดตัวแทน (ref) <br />
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value.trim())}
            placeholder="เช่น AG123"
          />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          เลือกแบบประกัน <br />
          <select value={plan} onChange={(e) => setPlan(e.target.value)}>
            {PLANS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 16 }}>
        <b>ลิงก์สำหรับแชร์:</b>
        <br />
        {url ? (
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        ) : (
          <em>กรอก ref เพื่อสร้างลิงก์</em>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <b>QR Code</b>
        <br />
        <canvas ref={canvasRef} style={{ border: "1px solid #ddd" }} />
        <div>
          <button
            onClick={downloadPng}
            disabled={!url}
            style={{ marginTop: 8 }}
          >
            ดาวน์โหลด PNG
          </button>
        </div>
      </div>

      <p style={{ marginTop: 12 }}>
        ทิป: แชร์ลิงก์นี้ให้ลูกค้า หรือพิมพ์ QR ติดสื่อ—เมื่อสแกน
        ระบบจะนับคลิกใน <code>ref_events</code> และส่งต่อไปหน้าแบบประกันพร้อม{" "}
        <code>?ref=...</code>
      </p>
    </main>
  );
}
