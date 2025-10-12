export function KeyPoints({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-slate-700 text-sm">
          <span className="mt-0.5 text-green-600">✓</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
