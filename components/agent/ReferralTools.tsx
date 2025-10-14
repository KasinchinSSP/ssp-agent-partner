"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { makeLineShareUrl, tryNativeShare } from "@/lib/utils/share";

export default function ReferralTools({
  agentCode,
  alias,
}: {
  agentCode: string;
  alias: string | null;
}) {
  const [planKey, setPlanKey] = useState<string>("");
  const [plans, setPlans] = useState<any[]>([]);
  const [homeUrl, setHomeUrl] = useState<string>("");
  const [productsUrl, setProductsUrl] = useState<string>("");
  const [planUrl, setPlanUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>(""); // /r/[alias]/[planKey]
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // โหลดรายการแผนสำหรับ dropdown
  useEffect(() => {
    (async () => {
      const res = await fetch("/data/pla_insurance.json", {
        cache: "force-cache",
      });
      const raw = await res.json();
      setPlans(raw?.plans || []);
    })();
  }, []);

  useEffect(() => {
    const origin = window.location.origin;
    const h = new URL("/", origin);
    h.searchParams.set("ref", agentCode);
    setHomeUrl(h.toString());

    const p = new URL("/products", origin);
    p.searchParams.set("ref", agentCode);
    setProductsUrl(p.toString());
  }, [agentCode]);

  // เมื่อ planKey เปลี่ยน ประกอบลิงก์เฉพาะแผน
  useEffect(() => {
    const origin = window.location.origin;
    if (!planKey) {
      setPlanUrl("");
      setShortUrl("");
      return;
    }

    const u = new URL(`/products/${encodeURIComponent(planKey)}`, origin);
    u.searchParams.set("ref", agentCode);
    setPlanUrl(u.toString());

    if (alias) {
      const s = new URL(
        `/r/${encodeURIComponent(alias)}/${encodeURIComponent(planKey)}`,
        origin
      );
      setShortUrl(s.toString());
    } else {
      setShortUrl("");
    }
  }, [planKey, agentCode, alias]);

  // วาด QR จาก URL ที่เลือก (เลือกแผน → วาด QR ของลิงก์สั้น ถ้ามี alias, ไม่งั้นใช้ลิงก์ยาว)
  useEffect(() => {
    (async () => {
      if (!canvasRef.current) return;
      const QRCode = (await import("qrcode")).default; // ต้องมี @types/qrcode ติดตั้งแล้ว
      const url = shortUrl || planUrl || homeUrl;
      if (!url) return;
      await QRCode.toCanvas(canvasRef.current, url, { margin: 2, width: 220 });
    })();
  }, [shortUrl, planUrl, homeUrl]);

  async function share(url: string, type: string) {
    const text =
      type === "plan"
        ? "แนะนำแบบประกันของฟิลลิปครับ/ค่ะ ลองดูรายละเอียดได้เลย"
        : "เข้าหน้าผลิตภัณฑ์ของฟิลลิปได้ที่นี่";
    const ok = await tryNativeShare({ title: "Phillip Life", text, url });
    if (!ok) window.open(makeLineShareUrl(url, text), "_blank");
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
    alert("คัดลอกแล้ว");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="font-semibold text-slate-800">Referral Tools</div>
      <div className="text-xs text-slate-500 mt-1">
        ลิงก์ทุกอันจะติดตามผลด้วยรหัสตัวแทนของคุณ (ref = {agentCode})
      </div>

      <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="block text-sm text-slate-700">
            ลิงก์หน้าแรก
            <div className="mt-1 flex gap-2">
              <input
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={homeUrl}
                readOnly
              />
              <button
                onClick={() => copy(homeUrl)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                คัดลอก
              </button>
              <button
                onClick={() => share(homeUrl, "home")}
                className="rounded-lg bg-[var(--brand-life)] text-white px-3 py-2 text-sm"
              >
                แชร์ LINE
              </button>
            </div>
          </label>

          <label className="block text-sm text-slate-700">
            ลิงก์หน้าผลิตภัณฑ์
            <div className="mt-1 flex gap-2">
              <input
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={productsUrl}
                readOnly
              />
              <button
                onClick={() => copy(productsUrl)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                คัดลอก
              </button>
              <button
                onClick={() => share(productsUrl, "products")}
                className="rounded-lg bg-[var(--brand-life)] text-white px-3 py-2 text-sm"
              >
                แชร์ LINE
              </button>
            </div>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-slate-700">
            เลือกแบบประกัน (เพื่อสร้างลิงก์เฉพาะแผน)
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={planKey}
              onChange={(e) => setPlanKey(e.target.value)}
            >
              <option value="">— เลือกแผน —</option>
              {plans.map((p: any) => (
                <option key={p.planKey} value={p.planKey}>
                  {p.planName}
                </option>
              ))}
            </select>
          </label>

          {planKey ? (
            <div className="space-y-2">
              <div className="text-xs text-slate-500">ลิงก์เฉพาะแผน (ยาว):</div>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={planUrl}
                  readOnly
                />
                <button
                  onClick={() => copy(planUrl)}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  คัดลอก
                </button>
                <button
                  onClick={() => share(planUrl, "plan")}
                  className="rounded-lg bg-[var(--brand-life)] text-white px-3 py-2 text-sm"
                >
                  แชร์ LINE
                </button>
              </div>

              {alias ? (
                <>
                  <div className="text-xs text-slate-500">
                    ลิงก์เฉพาะแผน (สั้น/สำหรับลูกค้า):
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      value={shortUrl}
                      readOnly
                    />
                    <button
                      onClick={() => copy(shortUrl)}
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      คัดลอก
                    </button>
                    <a
                      href={shortUrl}
                      target="_blank"
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      เปิดดู
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-amber-700 bg-amber-50 rounded-md p-2">
                  ยังไม่มี alias สำหรับลิงก์สั้น โปรดขอให้ผู้ดูแลเพิ่มให้ในระบบ
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-sm font-medium text-slate-800">
            QR สำหรับแชร์
          </div>
          <canvas ref={canvasRef} className="mt-2 mx-auto" />
          <div className="text-[11px] text-slate-500 mt-2 text-center">
            จะใช้ลิงก์สั้นถ้ามี alias, ไม่งั้นใช้ลิงก์ยาว
          </div>
        </div>
      </div>
    </section>
  );
}
