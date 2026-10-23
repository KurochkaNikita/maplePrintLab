import { auth } from "@/lib/auth/server";

// Redirects anonymous visitors to /login and refreshes the session cookie.
// The session check is repeated in the (admin) layout and requireAdmin().
export default auth.middleware({ loginUrl: "/login" });

// Only protected pages: a catch-all matcher would block JS/CSS on the login page.
export const config = {
  matcher: ["/", "/products/:path*", "/categories/:path*", "/collections/:path*", "/redirects/:path*"],
};
