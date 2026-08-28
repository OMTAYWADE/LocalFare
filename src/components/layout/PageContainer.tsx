import type { ReactNode } from "react";

interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

export default function PageContainer({
    children,
    className = "",
}: PageContainerProps) {
    return (
        <div
            className={[
                "mx-auto w-full",
                "max-w-[1440px]",
                "px-3 sm:px-5 lg:px-8 xl:px-10",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}