// app/quote/page.tsx — Server Component Wrapper (Next 15.5)
// หมายเหตุ: ใน Next.js 15.5 ฟังก์ชัน cookies() เป็น async → ต้อง await
import QuoteClient from "./QuoteClient";
import { cookies } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: { plan?: string; ref?: string };
}) {
  const cookieStore = await cookies();
  const cookieRef = cookieStore.get("agent_ref")?.value || null;

  return <QuoteClient searchParams={searchParams} cookieRef={cookieRef} />;
}
