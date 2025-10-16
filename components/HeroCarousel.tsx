"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export type Slide = { src: string; alt: string };

export function HeroCarousel({
  slides,
  autoPlayMs = 5000,
  className = "",
  fullBleed = false,
}: {
  slides: Slide[];
  autoPlayMs?: number;
  className?: string;
  fullBleed?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const wrap = useCallback(
    (i: number) => {
      const n = slides.length;
      return (i + n) % n;
    },
    [slides.length]
  );

  const go = useCallback(
    (next: number) => setIndex((i) => wrap(i + next)),
    [wrap]
  );
  const to = useCallback((i: number) => setIndex(() => wrap(i)), [wrap]);

  const pauseRef = useRef(false);
  const onMouseEnter = () => {
    pauseRef.current = true;
  };
  const onMouseLeave = () => {
    pauseRef.current = false;
  };

  useEffect(() => {
    if (slides.length <= 1) return; // ไม่ต้องเล่นอัตโนมัติถ้ามีสไลด์เดียว
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (!pauseRef.current) go(1);
    }, Math.max(2800, autoPlayMs));
    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, [autoPlayMs, go, slides.length]);

  // รองรับคีย์บอร์ด (ซ้าย/ขวา)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const idBase = useMemo(
    () => `hero-${Math.random().toString(36).slice(2)}`,
    []
  );

  return (
    <section className={`w-full ${className}`} aria-roledescription="carousel">
      <div
        className={`${
          fullBleed ? "max-w-none px-0" : "mx-auto max-w-screen-lg px-0 sm:px-4"
        } relative`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* ความสูง & อัตราส่วน: มือถือ 9:16, แท็บเล็ต 16:9, เดสก์ท็อป 2.4:1 */}
        <div
          className={`relative aspect-[9/16] sm:aspect-[16/9] lg:aspect-[12/5] ${
            fullBleed ? "rounded-none" : "rounded-none sm:rounded-2xl"
          } overflow-hidden`}
        >
          {/* แทร็ครูป: translateX ตาม index */}
          <div
            ref={trackRef}
            className="h-full w-full flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s, i) => (
              <div key={i} className="relative shrink-0 grow-0 basis-full">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes={
                    fullBleed ? "100vw" : "(max-width: 640px) 100vw, 1024px"
                  }
                />
              </div>
            ))}
          </div>

          {/* overlay gradient บาง ๆ ให้ภาพอ่านง่ายขึ้น */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-black/0 to-black/10" />

          {/* ปุ่มซ้าย/ขวา */}
          {slides.length > 1 && (
            <>
              <button
                aria-label="สไลด์ก่อนหน้า"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 text-white w-10 h-10 flex items-center justify-center backdrop-blur-sm hover:bg-black/45"
              >
                ‹
              </button>
              <button
                aria-label="สไลด์ถัดไป"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 text-white w-10 h-10 flex items-center justify-center backdrop-blur-sm hover:bg-black/45"
              >
                ›
              </button>
            </>
          )}

          {/* ตัวบอกสถานะ */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={`${idBase}-dot-${i}`}
                  aria-label={`ไปยังสไลด์ที่ ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => to(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
