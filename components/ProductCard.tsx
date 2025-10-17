"use client";
import Image from "next/image";
import Link from "next/link";

export type ProductCardProps = {
  title: string;
  image: string; // แนะนำ WebP 4:3
  bullets?: string[];
  href: string;
  highlight?: boolean;
  brand?: "life" | "takaful"; // ✅ เพิ่ม
};

export function ProductCard({
  title,
  image,
  bullets = [],
  href,
  highlight,
  brand = "life", // ✅ default
}: ProductCardProps) {
  const brandBg =
    brand === "takaful" ? "var(--brand-takaful)" : "var(--brand-life)";

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        highlight
          ? `bg-[${brandBg}] text-white border-transparent`
          : "bg-white border-slate-200"
      }`}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width:640px) 88vw, (max-width:1024px) 60vw, 32vw"
        />
      </div>
      <div className={`p-4 ${highlight ? "" : "text-slate-800"}`}>
        <div
          className={`font-semibold ${
            highlight ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </div>
        {bullets.length > 0 && (
          <ul
            className={`mt-2 space-y-1 text-sm ${
              highlight ? "text-white/90" : "text-slate-700"
            }`}
          >
            {bullets.slice(0, 3).map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href={href}
          className={`mt-3 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm ${
            highlight
              ? "bg-white text-[var(--brand-life)] hover:bg-slate-100"
              : brand === "takaful"
              ? "bg-[var(--brand-takaful)] text-white hover:brightness-95"
              : "bg-[var(--brand-life)] text-white hover:bg-[#00264d]"
          }`}
        >
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
}
