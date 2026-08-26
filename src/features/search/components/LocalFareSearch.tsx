"use client";

import { Loader2, Search, SlidersHorizontal, } from "lucide-react";
import { useState } from "react";
import type { SearchResponse, } from "../types";
import SearchResults from "./SearchResults";

interface Props {
    initialQuery?: string;
}

export default function LocalFareSearch({ initialQuery = "", }: Props) {
    const [query, setQuery] = useState(initialQuery);
    const [data, setData] = useState<SearchResponse | null>(null,);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    async function handleSearch() {
        if (!query.trim()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query,)}`,);

            if (!response.ok) {
                throw new Error("Search failed.",);
            }
            const result = (await response.json()) as SearchResponse;
            setData(result);
        } catch {
            setError("We couldn't find places right now. Try again.",);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="mt-8">
            <div className="flex items-center gap-2 rounded-[22px] border border-[#123c35]/10 bg-white p-2 shadow-[0_18px_50px_rgba(18,60,53,0.06)]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#f7f3ea]">
                    <Search className="h-5 w-5 text-[#123c35]" />
                </div>

                <input value={query} onChange={(event) => setQuery(event.target.value,)} onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        handleSearch();
                    }
                }} placeholder="Try: cheap spicy vadapav near Gateway of India"
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-[#123c35] outline-none placeholder:text-[#8b9792]"
                />

                <button type="button" onClick={handleSearch} disabled={loading}
                    className="flex h-11 items-center gap-2 rounded-full bg-[#123c35] px-5 text-xs font-black text-white disabled:opacity-60">
                    {loading ? ( <Loader2 className="h-4 w-4 animate-spin" />) : (
                        <Search className="h-4 w-4" />
                    )}

                    <span className="hidden sm:inline">
                        Search
                    </span>
                </button>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#6d7974]">
                <SlidersHorizontal className="h-3 w-3" />

                Search understands places,
                food, budget and preferences.
            </div>

            {error && (
                <div className="mt-4 rounded-[18px] bg-[#f9dfd0] px-4 py-3 text-xs font-semibold text-[#b84f2c]">
                    {error}
                </div>
            )}

            {data && (<SearchResults data={data} />)}
        </section>
    );
}