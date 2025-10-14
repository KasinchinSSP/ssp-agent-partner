import { redirect } from "next/navigation";

export default function AgentPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const ref = (searchParams.ref || "").trim();
  redirect(
    ref ? `/agent/profile?ref=${encodeURIComponent(ref)}` : "/agent/profile"
  );
}
