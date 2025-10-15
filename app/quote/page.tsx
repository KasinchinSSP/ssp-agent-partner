// app/quote/page.tsx — Server Component Wrapper
// หน้าที่: รับ searchParams จาก App Router (ฝั่ง Server) + อ่าน cookie 'agent_ref'
// แล้วส่งต่อให้ Client Component เพื่อใช้เป็นค่าเริ่มต้นของ ref
import QuoteClient from "./QuoteClient";
import { cookies } from "next/headers";

export default function Page({
  searchParams,
}: {
  searchParams: { plan?: string; ref?: string };
}) {
  const cookieStore = cookies();
  const cookieRef = cookieStore.get("agent_ref")?.value || null;

  return <QuoteClient searchParams={searchParams} cookieRef={cookieRef} />;
}
