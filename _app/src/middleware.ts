import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const auth = await isAuthenticated(request);
  if (!auth) return NextResponse.redirect(new URL("/login", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard",
    "/workspaces/:path*",
    "/api/user",
    // "/((?!login|register|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
