"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
    compact?: boolean;
}

export default function LogoutButton({
    compact = false,
}: LogoutButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);

        await signOut({
            callbackUrl: "/auth/signin",
        });
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className={
                compact
                    ? "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#123c35]/60 transition hover:bg-[#ef713d]/10 hover:text-[#ef713d] disabled:opacity-50"
                    : "flex w-full items-center justify-center gap-2 rounded-xl bg-[#123c35] px-4 py-3 text-sm font-bold text-[#f5f1e8] transition hover:bg-[#0d302a] disabled:cursor-not-allowed disabled:opacity-50"
            }
        >
            <LogOut size={16} />

            {loading ? "Signing out..." : "Sign out"}
        </button>
    );
}