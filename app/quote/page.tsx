// app/quote/page.tsx — Server Component Wrapper
// หน้าที่: รับ searchParams จาก App Router (ฝั่ง Server) แล้วส่งต่อให้ Client Component
import QuoteClient from "./QuoteClient";

export default function Page({
  searchParams,
}: {
  searchParams: { plan?: string; ref?: string };
}) {
  return <QuoteClient searchParams={searchParams} />;
}
