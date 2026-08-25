import { ArrowLeft, Clock3, MapPin, } from "lucide-react";
import type { DestinationDetails } from "@/features/travel/types";

interface Props {
    destination: DestinationDetails;
    sourceName: string;
    onBack?: () => void;
    onMore?: () => void;
}

export default function DestinationSummary({ destination, sourceName, onBack, onMore, }: Props) {
    return (
        <section>
            <button type="button" onClick={onBack} className=" mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#31544d] transition hover:text-[#123c35]">
                <ArrowLeft className="h-4 w-4" />

                Change journey
            </button>

            <div className=" overflow-hidden rounded-[32px] border border-[#123c35]/10 bg-[#fffdf8] shadow-[0_18px_55px_rgba(18,60,53,0.06)]">
                <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
                    {/* Image */}

                    <div className="relative min-h-[280px] bg-[#ccecf3] lg:min-h-[360px]">
                        {destination.image ? (
                            <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-[#123c35]/30">
                                <MapPin className="h-16 w-16" />
                            </div>
                        )}

                        <div className=" absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#123c35] shadow-sm backdrop-blur">
                            {destination.category}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ef713d]">
                            Your destination
                        </p>

                        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#123c35] sm:text-4xl">
                            {destination.name}
                        </h1>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#6d7974]">
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />

                                {destination.city}
                            </span>

                            <span>•</span>

                            <span>
                                {destination.distanceKm} km away
                            </span>

                            <span>•</span>

                            <span className="inline-flex items-center gap-1.5">
                                <Clock3 className="h-3.5 w-3.5" />

                                {destination.travelMinutes} min
                            </span>
                        </div>

                        <p className="mt-5 max-w-xl text-sm leading-6 text-[#6d7974]">
                            {destination.shortDescription}
                        </p>

                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#123c35]/8 pt-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6d7974]">
                                    Estimated visit budget
                                </p>

                                <p className="mt-1 text-xl font-black text-[#123c35]">
                                    ₹{destination.estimatedBudget}
                                </p>
                            </div>

                            <button type="button" onClick={onMore}
                                className=" rounded-full bg-[#e8f58d] px-4 py-2.5 text-xs font-black text-[#123c35] transition hover:bg-[#cbe95b]">
                                More about this place
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}