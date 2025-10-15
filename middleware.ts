import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { searchParams, pathname } = req.nextUrl;
  const ref = searchParams.get("ref");

  if (pathname.startsWith("/_next") || /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  if (ref) {
    const res = NextResponse.next();
    res.cookies.set("agent_ref", ref, {
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
      sameSite: "lax",
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|.*\\..*).*)",
};
