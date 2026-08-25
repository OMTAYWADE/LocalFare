"use client";

import { Menu, UserRound,} from "lucide-react";

export default function AppHeader() {
  return (
    <header className="relative z-50 flex h-20 items-center justify-between">
      {/* Logo */}
      <button type="button" className="group" aria-label="FairTrip home">
        <span className="text-[19px] font-black tracking-[-0.04em] text-[#123c35]">
          FAIRTRIP
        </span>
      </button>

      {/* Desktop navigation */}
      <nav className="hidden items-center gap-1 md:flex">
        <button type="button" className="rounded-full px-4 py-2 text-sm font-semibold text-[#31544d] transition hover:bg-white/70">
          Explore
        </button>

        <button type="button" className="rounded-full px-4 py-2 text-sm font-semibold text-[#31544d] transition hover:bg-white/70">
          Food
        </button>

        <button type="button" className="rounded-full px-4 py-2 text-sm font-semibold text-[#31544d] transition hover:bg-white/70">
          My trips
        </button>

        <button type="button" aria-label="Profile" className=" ml-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#123c35]/10 bg-white/80 text-[#123c35] shadow-sm transition hover:scale-105 ">
          <UserRound className="h-4 w-4" />
        </button>
      </nav>

      {/* Mobile */}
      <button type="button" aria-label="Open menu" className=" flex h-10 w-10 items-center justify-center rounded-full border border-[#123c35]/10 bg-white/80 text-[#123c35] md:hidden">
        <Menu className="h-5 w-5" />
      </button>
    </header>
  );
}