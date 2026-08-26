import {
    ArrowRight,
    Compass,
    Database,
    Sparkles,
} from "lucide-react";

interface TrustStripProps {
    onClick?: () => void;
}

export default function TrustStrip({
    onClick,
}: TrustStripProps) {
    return (
        <section className="rounded-[26px] border border-[#123c35]/10 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
                        <Compass className="h-4 w-4" />
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9dfd0] text-[#ef713d]">
                        <Sparkles className="h-4 w-4" />
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ccecf3] text-[#245d78]">
                        <Database className="h-4 w-4" />
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-[#123c35]">
                        Built around your journey
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-[#6d7974]">
                        Discover places, compare travel options
                        and make decisions with your budget in mind.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClick}
                    className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#f7f3ea] px-4 text-xs font-black text-[#123c35] transition hover:bg-[#e8f58d]"
                >
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </section>
    );
}