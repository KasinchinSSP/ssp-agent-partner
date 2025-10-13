import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";

const noto = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ฟิลลิปประกันชีวิต – ทีมตัวแทนในสังกัด | SSP Agent Partner",
  description:
    "หน้าอย่างเป็นทางการของทีมตัวแทนในสังกัดบริษัท ฟิลลิปประกันชีวิต แนะนำผลิตภัณฑ์เด่นและขั้นตอนการสมัครแบบโปร่งใส",
  openGraph: {
    title: "ฟิลลิปประกันชีวิต – ทีมตัวแทนในสังกัด",
    description: "แนะนำผลิตภัณฑ์เด่นและขั้นตอนการสมัครแบบโปร่งใส",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#003366",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="h-full">
      <body className={`${noto.className} h-full bg-white text-slate-800`}>
        <style>{`:root{--brand-life:#003366;--brand-takaful:#01680b}`}</style>
        <Suspense>
          <Header />
        </Suspense>
        <main className="min-h-[72vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
