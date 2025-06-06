import type { NextAuthConfig } from "next-auth";
import type { Session } from "next-auth";
import type { NextRequest } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }: {
      auth: Session | null;
      request: { nextUrl: URL };
    }) {
      console.log("Auth callback triggered:", {
        isLoggedIn: !!auth?.user,
        pathname: nextUrl.pathname,
        auth: auth ? "present" : "missing",
      });

      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      console.log("Auth check:", {
        isLoggedIn,
        isOnDashboard,
        pathname: nextUrl.pathname,
      });

      if (isOnDashboard) {
        if (isLoggedIn) {
          console.log(
            "User is logged in and accessing dashboard - allowing access"
          );
          return true;
        }
        console.log(
          "User is not logged in and trying to access dashboard - denying access"
        );
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        console.log(
          "User is logged in and accessing non-dashboard page - redirecting to dashboard"
        );
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      console.log(
        "User is not logged in and accessing public page - allowing access"
      );
      return true;
    },
  },
} satisfies NextAuthConfig;
