import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";

/**
 * Route protection. Next.js 16 renamed `middleware.ts` to `proxy.ts`; the file
 * still has to sit beside `app/`, so `src/proxy.ts`, and the export has to be
 * named `proxy`.
 *
 * NextAuth is initialised from `auth.config.ts` alone — no adapter, so no
 * Prisma client in this bundle. The session is read from the JWT cookie, which
 * is the whole reason `src/auth.ts` forces `strategy: "jwt"`.
 */
const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  if (req.auth) return NextResponse.next();

  // NextAuth's built-in sign-in page (no custom `pages.signIn` this phase).
  const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);

  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
