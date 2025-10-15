"use client";
import { useMemo, useState } from "react";

export type QuoteClientProps = {
  searchParams: { plan?: string; ref?: string };
  cookieRef?: string | null; // ← ต้องมีบรรทัดนี้ เพื่อรับ prop จาก page.tsx
};

export default function QuoteClient({ searchParams }: QuoteClientProps) {
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const rawPlan = (searchParams.plan || "").trim();
  let ref = (searchParams.ref || "").trim();
  let plan_key = rawPlan;
  if (!ref && rawPlan.includes("?ref=")) {
    const [p, tail] = rawPlan.split("?ref=");
    plan_key = p.trim();
    ref = (tail || "").split("&")[0].trim();
  }

  const utm = useMemo(() => {
    if (typeof window === "undefined")
      return {} as Record<string, string | null>;
    const sp = new URLSearchParams(window.location.search);
    return {
      utm_source: sp.get("utm_source") || null,
      utm_medium: sp.get("utm_medium") || null,
      utm_campaign: sp.get("utm_campaign") || null,
      utm_content: sp.get("utm_content") || null,
      utm_term: sp.get("utm_term") || null,
      // สำรอง: เก็บ ref จาก URL ด้วย (ใช้ตอน payload ถ้า ref ว่าง)
      _ref_from_url: sp.get("ref") || null,
    } as Record<string, string | null>;
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOk(false);

    const form = new FormData(e.currentTarget);

    if ((form.get("hp") as string)?.trim()) {
      setOk(true);
      return;
    }

    const full_name = (form.get("full_name") as string)?.trim();
    const phone = (form.get("phone") as string)?.trim();
    const ageRaw = (form.get("age") as string)?.trim();
    const sumRaw = (form.get("sum_assured") as string)?.trim();
    const pdpa_ok = form.get("pdpa_ok") === "on";

    const gender = (form.get("gender") as string) || null; // 'M' | 'F' | ''
    const birth_date = (form.get("birth_date") as string) || null; // YYYY-MM-DD

    const age = ageRaw ? Number(ageRaw) : null;
    const sum_assured = sumRaw ? Number(sumRaw) : null;

    let refValue = ((form.get("ref") as string) || ref || "").trim();
    if (!refValue && (utm as any)._ref_from_url) {
      refValue = ((utm as any)._ref_from_url as string).trim();
    }

    if (!full_name) return setErr("กรุณากรอกชื่อ-นามสกุล");
    if (!phone || !/^0[0-9]{9}$/.test(phone))
      return setErr("กรอกเบอร์ 10 หลักขึ้นต้น 0");
    if (!pdpa_ok) return setErr("กรุณายินยอม PDPA เพื่อให้ติดต่อกลับได้");
    if (!refValue) return setErr("ลิงก์ไม่ครบ: ไม่พบรหัสตัวแทน (ref)");

    setSaving(true);
    try {
      const payload = {
        full_name,
        phone,
        age,
        plan_key: plan_key || null,
        sum_assured,
        ref: refValue || null,
        pdpa_ok,
        gender: gender || null,
        birth_date,
        source_url: typeof window !== "undefined" ? window.location.href : null,
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : null,
        ...utm,
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await safeMsg(res);
        throw new Error(msg || "มีข้อผิดพลาดจากเซิร์ฟเวอร์");
      }

      setOk(true);
      // นำทางกลับหน้าแรกอย่างนุ่มนวล
      setTimeout(() => {
        try {
          window.location.href = "/";
        } catch {}
      }, 900);
    } catch (e: any) {
      setErr(e?.message || "มีข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-svh w-full flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-[560px]">
        <header className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#003366]">
            ขอใบเสนอราคา
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            กรอกข้อมูลสั้นๆ เราจะติดต่อกลับพร้อมรายละเอียดความคุ้มครอง
          </p>
        </header>

        <div className="rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 bg-white">
          {(plan_key || ref) && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {plan_key ? (
                <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                  <span className="text-gray-600">แบบประกัน:</span>{" "}
                  <b className="text-[#003366]">{plan_key}</b>
                </div>
              ) : null}
              {ref ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
                  <span className="text-gray-600">รหัสตัวแทน:</span>{" "}
                  <b className="text-emerald-700">{ref}</b>
                </div>
              ) : null}
            </div>
          )}

          <form onSubmit={submit} autoComplete="off" className="space-y-4">
            <Field>
              <Label>
                ชื่อ-นามสกุล<span className="text-red-500">*</span>
              </Label>
              <Input name="full_name" required placeholder="เช่น สมชาย ใจดี" />
            </Field>

            <Field>
              <Label>
                เบอร์โทร<span className="text-red-500">*</span>
              </Label>
              <Input
                name="phone"
                required
                inputMode="numeric"
                pattern="0[0-9]{9}"
                title="กรอกเบอร์ 10 หลักขึ้นต้น 0"
                placeholder="0XXXXXXXXX"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <Label>เพศ</Label>
                <select
                  name="gender"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
                  defaultValue=""
                >
                  <option value="">— เลือก —</option>
                  <option value="M">ชาย</option>
                  <option value="F">หญิง</option>
                </select>
              </Field>

              <Field>
                <Label>วันเกิด</Label>
                <Input name="birth_date" type="date" />
              </Field>
            </div>

            <Field>
              <Label>อายุ (ปี)</Label>
              <Input
                name="age"
                type="number"
                min={1}
                max={100}
                placeholder="เช่น 35"
              />
            </Field>

            <Field>
              <Label>ทุนเอาประกัน (บาท)</Label>
              <Input
                name="sum_assured"
                type="number"
                min={0}
                step={10000}
                placeholder="เช่น 1000000"
              />
            </Field>

            <input type="hidden" name="ref" value={ref} />
            <input type="hidden" name="plan_key" value={plan_key} />

            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-3">
              <label className="inline-flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="pdpa_ok"
                  required
                  className="mt-0.5"
                />
                <span>
                  ข้าพเจ้ายินยอมให้เก็บและใช้ข้อมูลที่กรอก
                  เพื่อการติดต่อกลับและให้ข้อมูลผลิตภัณฑ์ (PDPA)
                </span>
              </label>
            </div>

            {/* Honeypot สำหรับกันบอท */}
            <div className="hidden">
              <label>
                ห้ามกรอกช่องนี้
                <input name="hp" />
              </label>
            </div>

            {err && <p className="text-red-600 text-sm">{err}</p>}
            {ok && (
              <p className="text-emerald-700 text-sm">ส่งคำขอแล้ว ขอบคุณครับ</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#003366] text-white px-4 py-2.5 hover:opacity-95 disabled:opacity-60"
              >
                {saving ? "กำลังส่ง..." : "ส่งคำขอ"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          * แบบฟอร์มนี้เป็นการเก็บข้อมูลเบื้องต้น
          เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันและให้รายละเอียดเพิ่มเติม
        </p>
      </div>
    </main>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm text-gray-800">{children}</label>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#003366]/30 " +
        (props.className || "")
      }
    />
  );
}

async function safeMsg(res: Response) {
  try {
    const j = await res.json();
    return j?.error || j?.message || null;
  } catch {
    return null;
  }
}
