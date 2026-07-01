import { NextRequest, NextResponse } from "next/server";

const OLD_HOST = "tsumitate-timemachine.vercel.app";
const NEW_HOST = "tsumitate-timemachine.com";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  // 旧ドメインへのアクセスを新ドメインへ 301 リダイレクト
  if (host === OLD_HOST) {
    const url = req.nextUrl.clone();
    url.host = NEW_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
