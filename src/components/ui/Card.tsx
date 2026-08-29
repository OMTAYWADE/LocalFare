// Card.tsx (slightly richer hover)
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`rounded-[24px] border border-[#e3e7e2] bg-white shadow-[0_8px_30px_rgba(25,45,38,0.04)] ${
        hover
          ? "transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#e3e7e2]/60 hover:shadow-[0_24px_60px_rgba(25,45,38,0.12)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}