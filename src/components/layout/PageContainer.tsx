import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "",}: PageContainerProps) {
  return (
    <div className={` mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}