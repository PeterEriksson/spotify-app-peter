import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Runs on every request
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow requests for:
  // 1. next-auth endpoints
  // 2. static files (_next, images, etc.)
  // 3. the login page itself
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // Get token (user session)
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  // If no token and requesting a protected page, redirect to login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, allow access
  return NextResponse.next();
}
