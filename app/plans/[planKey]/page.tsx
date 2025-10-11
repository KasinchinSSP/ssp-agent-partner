type Props = { params: { planKey: string }; searchParams: { ref?: string } };

const PLAN_CONTENT: Record<string, { name: string; highlights: string[] }> = {
  "happy-value": {
    name: "Happy Value",
    highlights: ["จุดเด่น 1", "จุดเด่น 2", "จุดเด่น 3"],
  },
  "happy-protect": {
    name: "Happy Protect",
    highlights: ["จุดเด่น A", "จุดเด่น B"],
  },
};

export default function PlanDetail({ params, searchParams }: Props) {
  const data = PLAN_CONTENT[params.planKey] ?? {
    name: params.planKey,
    highlights: [],
  };
  const ref = searchParams.ref || ""; // เก็บ ref ไว้ส่งต่อ

  return (
    <main style={{ padding: 24 }}>
      <a href="/plans">← กลับ</a>
      <h1>{data.name}</h1>
      <ul>
        {data.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>

      <div style={{ marginTop: 24 }}>
        <a href={`/quote?plan=${params.planKey}${ref ? `&ref=${ref}` : ""}`}>
          ขอใบเสนอราคา
        </a>
      </div>
    </main>
  );
}
