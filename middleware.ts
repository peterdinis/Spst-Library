import { NextRequest, NextResponse } from "next/server";

const roleProtectedRoutes: Record<string, string[]> = {
  "/student": ["STUDENT"],
  "/teacher": ["TEACHER"],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const profileRes = await fetch(`${baseUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!profileRes.ok) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const user = await profileRes.json();
    const userRole = user.role?.name?.toUpperCase();

    for (const route in roleProtectedRoutes) {
      if (req.nextUrl.pathname.startsWith(route)) {
        if (!roleProtectedRoutes[route].includes(userRole)) {
          url.pathname = "/unauthorized";
          return NextResponse.redirect(url);
        }
      }
    }

    return NextResponse.next();
  } catch (err) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*"],
};
