import { Suspense } from "react";

import RegisterForm from "@/features/auth/components/RegisterForm";

function RegisterFallback() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f4ec]">
            <div className="flex items-center gap-3">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#123c35]/15 border-t-[#ef713d]" />

                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#123c35]">
                    Preparing your journey…
                </span>
            </div>
        </main>
    );
}

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <RegisterFallback />
            }
        >
            <RegisterForm />
        </Suspense>
    );
}