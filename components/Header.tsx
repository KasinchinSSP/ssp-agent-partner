"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { withRef } from "@/lib/utils/ref";

export function Header() {
  const sp = useSearchParams();
  const ref = sp.get("ref") || "";
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-screen-lg px-4 py-2.5 flex items-center gap-3">
        <Link href={withRef("/", ref)} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-[var(--brand-life)] flex items-center justify-center text-white font-bold">
            P
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-[var(--brand-life)]">
              Phillip Life
            </div>
            <div className="text-[11px] text-slate-500">ทีมตัวแทนในสังกัด</div>
          </div>
        </Link>
        <nav className="ml-auto flex items-center gap-3 text-sm">
          <Link
            href={withRef("/products", ref)}
            className="hover:text-[var(--brand-life)]"
          >
            ผลิตภัณฑ์
          </Link>
          <Link
            href={withRef("/products?t=takaful", ref)}
            className="hover:text-[var(--brand-life)]"
          >
            ตะกาฟุล
          </Link>
          <Link
            href={withRef("/quote", ref)}
            className="rounded-lg bg-[var(--brand-life)] text-white px-3 py-1.5 hover:bg-[#00264d]"
          >
            ขอใบเสนอราคา
          </Link>
        </nav>
      </div>
    </header>
  );
}
