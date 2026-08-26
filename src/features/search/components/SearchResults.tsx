"use client";

import { Clock3, ExternalLink, MapPin, Star, } from "lucide-react";
import type { SearchResponse, } from "../types";

interface Props {
    data: SearchResponse;
}

export default function SearchResults({ data, }: Props) {
    return (
        <section className="mt-8">
            <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ef713d]">
                    Real data results
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123c35]">
                    Places LocalFare found
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#6d7974]">
                    {data.metadata.resultCount} places
                    found around{" "}
                    {data.searchLocation?.displayName ??
                        "your search"}
                    .
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {data.results.map((place) => (
                    <article key={place.id} className="rounded-[26px] border border-[#123c35]/10 bg-white p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="rounded-full bg-[#f7f3ea] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#31544d]">
                                    {place.category}
                                </span>

                                <h3 className="mt-4 text-lg font-black tracking-[-0.03em] text-[#123c35]">
                                    {place.name}
                                </h3>
                            </div>

                            {place.rating && (
                                <div className="flex items-center gap-1 rounded-full bg-[#e8f58d]/60 px-3 py-1.5 text-[10px] font-black text-[#123c35]">
                                    <Star className="h-3 w-3 fill-current" />

                                    {place.rating}
                                </div>
                            )}
                        </div>

                        {place.address && (
                            <div className="mt-3 flex gap-2 text-xs leading-5 text-[#6d7974]">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                                {place.address}
                            </div>
                        )}

                        <div className="mt-5 grid grid-cols-2 gap-2">
                            <div className="rounded-[16px] bg-[#f7f3ea] p-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d7974]">
                                    Distance
                                </p>

                                <p className="mt-1 text-sm font-black text-[#123c35]">
                                    {place.distanceKm?.toFixed(1,) ?? "--"}{" "}
                                    km
                                </p>
                            </div>

                            <div className="rounded-[16px] bg-[#e8f58d]/50 p-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6d7974]">
                                    Travel
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-sm font-black text-[#123c35]">
                                    <Clock3 className="h-3.5 w-3.5" />

                                    {place.durationMinutes ? `${place.durationMinutes} min` : "--"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-[9px] font-semibold text-[#8b9792]">
                                OpenStreetMap
                            </span>

                            <a href={place.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-[#123c35] px-4 py-2.5 text-[10px] font-black text-white">
                                Map
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </article>
                ),
                )}
            </div>

            <p className="mt-6 text-center text-[9px] font-semibold text-[#8b9792]">
                © OpenStreetMap contributors
            </p>
        </section>
    );
}