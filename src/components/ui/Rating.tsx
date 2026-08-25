import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  reviewCount?: number;
}

export default function Rating({ rating, reviewCount,}: RatingProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Star className=" h-3.5 w-3.5 fill-[#e7a34f] text-[#e7a34f] "/>
      <span className="font-bold text-slate-700">
        {rating.toFixed(1)}
      </span>

      {reviewCount !== undefined && (
        <span className="text-slate-400">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}