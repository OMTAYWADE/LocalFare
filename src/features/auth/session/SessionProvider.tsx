"use client";

import {
    SessionProvider as NextAuthSessionProvider,
    useSession,
    signIn,
    signOut,
} from "next-auth/react";

interface SessionProviderProps {
    children: React.ReactNode;
}

export default function SessionProvider({
    children,
}: SessionProviderProps) {
    return (
        <NextAuthSessionProvider>
            {children}
        </NextAuthSessionProvider>
    );
}

export { useSession, signIn, signOut };