import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/auth/signin",
    },

    session: {
        strategy: "jwt",
    },

    providers: [],

    callbacks: {
        authorized({
            auth,
            request,
        }) {
            const pathname =
                request.nextUrl.pathname;

            const isAuthPage =
                pathname === "/auth/signin" ||
                pathname === "/auth/register";

            const isLoggedIn =
                Boolean(auth?.user);

            // Authentication pages are public.
            if (isAuthPage) {
                // Don't allow an already signed-in
                // user to remain on the auth pages.
                if (isLoggedIn) {
                    return Response.redirect(
                        new URL(
                            "/",
                            request.nextUrl,
                        ),
                    );
                }

                return true;
            }

            // Everything else requires authentication.
            return isLoggedIn;
        },
    },
} satisfies NextAuthConfig;

export default authConfig;