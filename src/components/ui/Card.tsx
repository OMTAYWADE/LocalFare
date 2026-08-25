import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false,}: CardProps) {
  return (
    <div className={` rounded-[24px] border border-[#e3e7e2] bg-white shadow-[0_8px_30px_rgba(25,45,38,0.04)] ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(25,45,38,0.10)]" : ""} ${className} `} >
      {children}
    </div>
  );
}