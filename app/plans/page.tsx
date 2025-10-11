const PLANS = [
  {
    key: "happy-value",
    name: "Happy Value",
    teaser: "คุ้มครองหลัก จุดเด่นเข้าใจง่าย",
  },
  {
    key: "happy-protect",
    name: "Happy Protect",
    teaser: "โฟกัสความคุ้มครองสูง",
  },
];

export default function Plans() {
  return (
    <main style={{ padding: 24 }}>
      <h1>แบบประกันที่โฟกัส</h1>
      <ul>
        {PLANS.map((p) => (
          <li key={p.key} style={{ margin: "12px 0" }}>
            <a href={`/plans/${p.key}`}>{p.name}</a> – {p.teaser}
          </li>
        ))}
      </ul>
    </main>
  );
}
