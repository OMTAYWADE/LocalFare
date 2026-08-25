"use client";

import { ArrowDown } from "lucide-react";
import { useState } from "react";

import LocationField from "./LocationField";
import DestinationField from "./DestinationField";

interface SourceDestinationProps {
  onSearch?: (
    source: string,
    destination: string,
  ) => void;
}

export default function SourceDestination({ onSearch,}: SourceDestinationProps) {
  const [source, setSource] = useState("Current location");
  const [destination, setDestination] = useState("");
  const useCurrentLocation = () => { setSource("Detecting current location...");

    window.setTimeout(() => {
      setSource("Mumbai Airport");
    }, 600);
  };

  const handleContinue = () => {
    if (!source.trim() || !destination.trim()) {
      return;
    }

    onSearch?.(source, destination);
  };

  return (
    <div className=" rounded-[30px] border border-[#123c35]/10 bg-[#fffdf8] p-5 shadow-[0_20px_60px_rgba(18,60,53,0.07)] sm:p-7" >
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <LocationField label="Starting from" value={source} onChange={setSource} onCurrentLocation={useCurrentLocation}/>

        <div className="hidden h-14 items-center justify-center md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f58d] text-[#123c35]">
            <ArrowDown className="h-4 w-4 rotate-[-90deg]" />
          </div>
        </div>

        <DestinationField value={destination} onChange={setDestination}/>
      </div>

      <div className="mt-5 flex justify-end">
        <button type="button" disabled={ !source.trim() || !destination.trim() } onClick={handleContinue}
          className=" h-12 rounded-full bg-[#123c35] px-7 text-sm font-black text-white transition hover:bg-[#0d312b] disabled:cursor-not-allowed disabled:opacity-40">
          Calculate my trip →
        </button>
      </div>
    </div>
  );
}