import { Suspense } from "react";
import SignInForm from "@/features/auth/components/SignInForm";

function SignInFallback() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8]">
            <div className="flex items-center gap-3">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#123c35]/15 border-t-[#ef713d]" />

                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#123c35]">
                    Finding your route…
                </span>
            </div>
        </main>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<SignInFallback />}>
            <SignInForm />
        </Suspense>
    );
}