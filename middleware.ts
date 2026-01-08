import { boho } from "@/lib/boho";

export default boho.middleware;

export const config = {
  matcher: [
    // Run middleware on everything EXCEPT:
    // - /api routes
    // - next static/image assets
    // - favicon
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
