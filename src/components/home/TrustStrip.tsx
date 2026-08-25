import { ArrowRight } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="flex items-center gap-4 px-2 py-5 sm:px-4">
      {/* avatars */}

      <div className="flex -space-x-3">
        <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#f7f3ea] bg-[#d7b7a3]">
          <div className="flex h-full items-end justify-center text-xl">
            👩🏻
          </div>
        </div>

        <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#f7f3ea] bg-[#a9c7ba]">
          <div className="flex h-full items-end justify-center text-xl">
            👨🏽
          </div>
        </div>

        <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#f7f3ea] bg-[#d7c7a0]">
          <div className="flex h-full items-end justify-center text-xl">
            👩🏽
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#f7f3ea] bg-[#dfe0d7] text-xs font-black text-[#123c35]">
          1K+
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#123c35]">
          Trusted by travelers across India
        </p>

        <p className="mt-0.5 text-xs text-[#6d7974]">
          Local insights made easier.
        </p>
      </div>

      <button type="button" className=" flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#123c35] shadow-sm transition hover:scale-105">
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}