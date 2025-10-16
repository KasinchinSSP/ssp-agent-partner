"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

function useCookieRef() {
  return useMemo(() => {
    if (typeof document === "undefined") return "";
    const m = document.cookie.match(/(?:^|; )agent_ref=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  }, []);
}

export function AgentContactCard() {
  const sp = useSearchParams();
  const cookieRef = useCookieRef();
  const ref = sp.get("ref") || cookieRef || ""; // ✅ fallback จาก cookie
  if (!ref) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-[var(--brand-life)] text-white flex items-center justify-center">
        A
      </div>
      <div className="text-sm">
        <div className="font-medium">ที่ปรึกษาส่วนตัวของคุณ · รหัส {ref}</div>
        <div className="text-slate-600">
          ส่งข้อความหาเราได้ทันที ทีมงานจะติดต่อกลับโดยเร็ว
        </div>
      </div>
      <div className="ml-auto flex gap-2">
        <a
          href={`/quote?ref=${encodeURIComponent(ref)}`}
          className="rounded-lg bg-[var(--brand-life)] text-white px-3 py-1.5 text-sm hover:bg-[#00264d]"
        >
          ขอให้ติดต่อกลับ
        </a>
      </div>
    </div>
  );
}
