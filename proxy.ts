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

  const permanentRedirects: Record<string, string> = {
    "/fang": "/fund/fangplus",
    "/schd": "/fund/schd",
    "/ranking/beginner": "/ranking",
  };
  const redirectTarget = permanentRedirects[url.pathname];
  if (redirectTarget) {
    url.pathname = redirectTarget;
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return NextResponse.redirect(url, { status: 301 });
  }

  const response = NextResponse.next();

  // Cloudflare preview URLs must never compete with the canonical production domain.
  if (host.endsWith(".workers.dev")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
