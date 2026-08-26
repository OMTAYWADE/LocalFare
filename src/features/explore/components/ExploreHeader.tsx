import {
  MapPin,
  Sparkles,
} from "lucide-react";

export default function ExploreHeader() {
  return (
    <header className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#dcefcf] via-[#eaf3c9] to-[#f8d79a] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">

      {/* decorative landscape */}

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] overflow-hidden sm:block">

        <div className="absolute bottom-0 right-[-30px] h-32 w-[80%] rounded-[70%_40%_0_0] bg-[#75a779]/40" />

        <div className="absolute bottom-0 right-[10%] h-24 w-[55%] rounded-[80%_50%_0_0] bg-[#3d795f]/55" />

        <div className="absolute right-[25%] top-8 h-20 w-20 rounded-full bg-[#ffb52e]" />

        <div className="absolute bottom-6 right-[36%] h-2 w-28 rotate-[-8deg] rounded-full bg-[#f4d48b]" />

        <div className="absolute bottom-10 right-[20%] h-2 w-16 rotate-[6deg] rounded-full bg-[#f4d48b]" />

      </div>

      <div className="relative max-w-[650px]">

        <div className="inline-flex items-center gap-2 rounded-full bg-[#06483f] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#dff18c]">
          <Sparkles className="h-3 w-3" />

          Explore nearby
        </div>

        <h1 className="mt-4 max-w-[620px] text-[2.35rem] font-black leading-[0.98] tracking-[-0.06em] text-[#073f37] sm:text-5xl lg:text-[3.8rem]">
          Discover places
          <br />
          worth visiting
          <br />
          <span className="text-[#ed6b31]">
            from where you are.
          </span>
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-6 text-[#49625c] sm:text-base">
          Real distance. Real travel time.
          Real trip cost comparison.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-2 text-[9px] font-black text-[#123c35] backdrop-blur">
            <MapPin className="h-3 w-3 text-[#ef713d]" />
            Nearby places
          </span>

          <span className="rounded-full bg-[#06483f]/10 px-3 py-2 text-[9px] font-black text-[#123c35]">
            Travel comparison
          </span>

          <span className="rounded-full bg-[#06483f]/10 px-3 py-2 text-[9px] font-black text-[#123c35]">
            Fair prices
          </span>

        </div>
      </div>
    </header>
  );
}