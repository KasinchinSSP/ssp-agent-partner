export function Section({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}
    >
      {title ? (
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 text-slate-700 font-semibold">
          {title}
        </div>
      ) : null}
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}
