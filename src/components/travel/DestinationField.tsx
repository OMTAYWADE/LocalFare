"use client";

import { Search, MapPin,} from "lucide-react";

interface DestinationFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DestinationField({ value, onChange,}: DestinationFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-black uppercase tracking-[0.16em] text-[#6d7974]">
        Destination
      </label>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ef713d]" />

        <input value={value} onChange={(event) => onChange(event.target.value)}
          className=" h-14 w-full rounded-[18px] border border-[#123c35]/10 bg-white pl-12 pr-12 text-sm font-semibold text-[#123c35] outline-none transition placeholder:text-[#6d7974] focus:border-[#ef713d]/40 focus:ring-4 focus:ring-[#ef713d]/5"
          placeholder="Where do you want to go?"
        />

        <MapPin className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ef713d]" />
      </div>
    </div>
  );
}