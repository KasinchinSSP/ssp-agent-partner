export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#003366]/10 text-[#003366] px-2.5 py-1 text-xs font-medium">
      {children}
    </span>
  );
}
