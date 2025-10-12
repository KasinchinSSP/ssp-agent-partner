export function StickyQuoteBar({
  annual,
  onClick,
}: {
  annual?: number;
  onClick: () => void;
}) {
  if (!(annual && annual > 0)) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-screen-lg px-4 py-3 flex items-center justify-between gap-4">
        <div className="text-sm text-slate-600">ยอดเบี้ยโดยประมาณ / ปี</div>
        <div className="text-xl font-semibold text-[#003366]">
          {annual.toLocaleString()} บาท
        </div>
        <button
          onClick={onClick}
          className="ml-auto rounded-xl bg-[#003366] text-white px-4 py-2.5 font-medium shadow hover:bg-[#00264d]"
        >
          ขอใบเสนอราคา
        </button>
      </div>
    </div>
  );
}
