import {
  ArrowUpRight,
  Binoculars,
  Send,
  type LucideIcon,
} from "lucide-react";

interface JourneyOptionProps {
  type: "nearby" | "destination";
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function JourneyOption({ type, icon: Icon, title, description, onClick,}: JourneyOptionProps) {
  const nearby = type === "nearby";

  return (
    <button type="button" onClick={onClick}
      className={` group relative min-h-[260px] overflow-hidden rounded-[30px] p-7 text-left transition-all duration-300 hover:-translate-y-1 sm:p-8
        ${ nearby ? "bg-[#e8f58d] text-[#123c35] hover:bg-[#e3f27e]" : "bg-[#f9dfd0] text-[#123c35] hover:bg-[#f7d8c7]" } `}>
      {/* contour pattern */}
      <div className=" topographic-lines -right-20 -top-20 h-[300px] w-[300px] rounded-full "/>

      {/* Icon */}
      <div className={` relative z-10 flex h-14 w-14 items-center justify-center rounded-[18px] border
          ${ nearby ? "border-[#123c35]/10 bg-[#cbe95b]" : "border-[#ef713d]/20 bg-[#f8d4c1]" }`}>
        <Icon className={` h-7 w-7 ${ nearby ? "text-[#123c35]" : "text-[#ef713d]" }`}
        />
      </div>

      {/* Text */}
      <div className="relative z-10 mt-7 max-w-[340px]">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-50">
          {nearby ? "I don't know where to go" : "I already know"}
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
          {title}
        </h2>

        <p className="mt-3 max-w-[300px] text-sm leading-6 opacity-70 sm:text-[15px]">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <span className={` absolute bottom-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110
          ${ nearby ? "border-[#123c35]/15 bg-[#cbe95b]" : "border-[#ef713d]/20 bg-[#f8d4c1]" } `}>
        <ArrowUpRight className={` h-5 w-5 ${ nearby ? "text-[#123c35]" : "text-[#ef713d]"}
          `}
        />
      </span>
    </button>
  );
}

export { Binoculars, Send };