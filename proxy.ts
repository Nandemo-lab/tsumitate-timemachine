import { NextRequest, NextResponse } from "next/server";

const OLD_HOST = "tsumitate-timemachine.vercel.app";
const NEW_HOST = "tsumitate-timemachine.com";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const url = req.nextUrl.clone();
  let shouldRedirect = false;

  // 旧ドメインと統合済みURLを、一段の恒久リダイレクトで正規URLへ寄せる。
  if (host === OLD_HOST) {
    url.host = NEW_HOST;
    url.protocol = "https:";
    shouldRedirect = true;
  }

  if (url.pathname === "/fang") {
    url.pathname = "/fund/fangplus";
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
