"use client";

import SessionProvider from "@/features/auth/session/SessionProvider";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({
    children,
}: ProvidersProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}