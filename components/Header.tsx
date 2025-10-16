"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { withRef } from "@/lib/utils/ref";

function useCookieRef() {
  return useMemo(() => {
    if (typeof document === "undefined") return "";
    const m = document.cookie.match(/(?:^|; )agent_ref=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  }, []);
}

export function Header() {
  const sp = useSearchParams();
  const cookieRef = useCookieRef();
  const ref = sp.get("ref") || cookieRef || "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    if (open) {
      const prev = el.style.overflow;
      el.style.overflow = "hidden";
      return () => {
        el.style.overflow = prev;
      };
    }
  }, [open]);

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
            <div className="text-[11px] text-slate-500">SSP Agent Partner</div>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-3 text-sm sm:flex">
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

        <div className="ml-auto sm:hidden">
          <button
            aria-label="เปิดเมนู"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="p-2 rounded-md border border-slate-300"
          >
            <span className="block h-0.5 w-5 bg-slate-800 mb-1"></span>
            <span className="block h-0.5 w-5 bg-slate-800 mb-1"></span>
            <span className="block h-0.5 w-5 bg-slate-800"></span>
          </button>
        </div>
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-white">
            <div className="mx-auto flex h-full max-w-sm flex-col">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <Link
                  href={withRef("/", ref)}
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="h-8 w-8 rounded-md bg-[var(--brand-life)] flex items-center justify-center text-white font-bold">
                    P
                  </div>
                </Link>
                <button
                  aria-label="ปิดเมนู"
                  onClick={() => setOpen(false)}
                  className="p-2 text-slate-700"
                >
                  ✕
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-2 py-2 text-slate-800">
                <MenuItem
                  href={withRef("/products", ref)}
                  label="ผลิตภัณฑ์"
                  onClick={() => setOpen(false)}
                />
                <MenuItem
                  href={withRef("/products?t=takaful", ref)}
                  label="Health&Wellness / ตะกาฟุล"
                  onClick={() => setOpen(false)}
                />
                <MenuItem
                  href={withRef("/products?promo=1", ref)}
                  label="โปรโมชั่นและกิจกรรม"
                  onClick={() => setOpen(false)}
                />
                <MenuItem
                  href={withRef("/tools/open-apply", ref)}
                  label="บริการลูกค้า"
                  onClick={() => setOpen(false)}
                />
                <MenuItem
                  href={withRef("/about", ref)}
                  label="เกี่ยวกับเรา"
                  onClick={() => setOpen(false)}
                />

                <div className="mt-8 border-t bg-slate-50/80 px-4 py-3 grid grid-cols-2 gap-3 sticky bottom-0">
                  <button className="rounded-xl border border-[#c21b3a] text-[#c21b3a] py-2.5 font-medium">
                    Login
                  </button>
                  <button className="rounded-xl bg-[#c21b3a] text-white py-2.5 font-medium">
                    ติดต่อเรา
                  </button>
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}

function MenuItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between rounded-lg px-2 py-4 text-base hover:bg-slate-100"
    >
      <span>{label}</span>
      <span className="text-slate-400">›</span>
    </Link>
  );
}
