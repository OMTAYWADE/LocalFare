import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#183c34] text-white hover:bg-[#102f29] hover:shadow-lg",
    secondary: "border border-[#dfe5df] bg-white text-[#183c34] hover:bg-[#f4f7f3]",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-[#183c34]",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-4 text-sm",
    lg: "h-13 px-6 text-sm",
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#183c34]/20 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}