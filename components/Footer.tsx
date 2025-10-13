import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-screen-lg px-4 py-8 text-sm text-slate-600">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <div className="font-semibold text-slate-800">
              Phillip Life – ทีมตัวแทนในสังกัด
            </div>
            <div className="text-[12px]">
              © {new Date().getFullYear()} SSP Agent Partner
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-[var(--brand-life)]">
              หน้าแรก
            </Link>
            <Link href="/products" className="hover:text-[var(--brand-life)]">
              ผลิตภัณฑ์
            </Link>
            <Link href="#disclaimer" className="hover:text-[var(--brand-life)]">
              ข้อสงวนสิทธิ์
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
