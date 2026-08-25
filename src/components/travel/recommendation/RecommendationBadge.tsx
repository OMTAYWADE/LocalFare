interface RecommendationBadgeProps {
  level:
    | "best"
    | "good"
    | "possible"
    | "not-ideal";

  score: number;
}

const styles = {
  best: {
    label: "Best match",
    className: "bg-[#e8f58d] text-[#123c35]",
  },

  good: {
    label: "Good option",
    className: "bg-[#dff1e5] text-[#347653]",
  },

  possible: {
    label: "Possible",
    className: "bg-[#fff0cf] text-[#98732b]",
  },

  "not-ideal": {
    label: "Not ideal",
    className: "bg-[#f9dfd0] text-[#b84f2c]",
  },
};

export default function RecommendationBadge({ level, score,}: RecommendationBadgeProps) {
  const style = styles[level];

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] ${style.className}`}>
      {style.label}

      <span className="opacity-60">
        {score}% match
      </span>
    </div>
  );
}