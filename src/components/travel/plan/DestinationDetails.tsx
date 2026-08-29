import { BookOpen, Camera, Clock3, Heart, MapPinned } from "lucide-react";
import type { ComponentType } from "react";
import type { DestinationDetails as DestinationDetailsType } from "@/features/travel/types";

interface Props {
  destination: DestinationDetailsType;
}

export default function DestinationDetails({ destination }: Props) {
  return (
    <section className="mt-4 rounded-[28px] border border-[#123c35]/10 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_18px_50px_rgba(18,60,53,0.06)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-2 text-[#ef713d]">
            <BookOpen className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em]">
              About this place
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#5f6e68]">{destination.history}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoBox icon={Camera} title="Famous for" items={destination.famousFor} />
          <InfoBox icon={Heart} title="Popular with" items={destination.popularWith} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 border-t border-[#123c35]/8 pt-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-[#123c35]">
            <MapPinned className="h-4 w-4" />
            <span className="text-xs font-black">Things to experience</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {destination.highlights.map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#e8f58d]/60 px-3 py-1.5 text-[11px] font-bold text-[#31544d] transition-all duration-200 hover:scale-105 hover:bg-[#e8f58d]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-[#123c35]">
            <Clock3 className="h-4 w-4" />
            <span className="text-xs font-black">Best time to visit</span>
          </div>
          <p className="mt-3 text-sm font-bold text-[#5f6e68]">{destination.bestTimeToVisit}</p>
        </div>
      </div>
    </section>
  );
}

function InfoBox({
  icon: Icon,
  title,
  items,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[20px] bg-[#f7f3ea] p-4 transition-colors duration-300 hover:bg-[#f2ede0]">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#ef713d]" />
        <span className="text-xs font-black text-[#123c35]">{title}</span>
      </div>

      <div className="mt-3 space-y-1.5">
        {items.slice(0, 4).map((item) => (
          <p key={item} className="text-[11px] leading-5 text-[#6d7974]">
            • {item}
          </p>
        ))}
      </div>
    </div>
  );
}