"use client";
import { useEffect, useRef, useState } from "react";
import { ProductCard, type ProductCardProps } from "./ProductCard";

export function ProductCarousel({ items }: { items: ProductCardProps[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);

  // sync page ตามการเลื่อนจริง
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.querySelector<HTMLElement>("[data-card]");
      const cardW = card ? card.offsetWidth + 16 : el.clientWidth; // +gap 4
      const p = Math.round(el.scrollLeft / cardW);
      setPage(p);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollByCard = (dir: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const cardW = card ? card.offsetWidth + 16 : el.clientWidth;
    el.scrollBy({ left: dir * cardW, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* ขอบซีดซ้าย/ขวา */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--background)] to-transparent" />

      {/* ปุ่มบนเดสก์ท็อป */}
      <button
        onClick={() => scrollByCard(-1)}
        aria-label="ก่อนหน้า"
        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/50"
      >
        ‹
      </button>
      <button
        onClick={() => scrollByCard(1)}
        aria-label="ถัดไป"
        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/50"
      >
        ›
      </button>

      {/* แทร็คการ์ด */}
      <div
        ref={wrapRef}
        className="-mx-2 flex gap-4 overflow-x-auto px-2 snap-x snap-mandatory scroll-smooth"
      >
        {items.map((it, idx) => (
          <div
            key={idx}
            data-card
            className="snap-start shrink-0 w-[88%] sm:w-[60%] lg:w-[32%]"
          >
            <ProductCard {...it} />
          </div>
        ))}
      </div>

      {/* ดอทบอกหน้า (มือถือ/แท็บเล็ต) */}
      <div className="mt-3 flex justify-center gap-2 lg:hidden">
        {items.map((_, i) => (
          <span
            key={i}
            className={`h-2.5 rounded-full ${
              i === page ? "w-6 bg-slate-800" : "w-2.5 bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
