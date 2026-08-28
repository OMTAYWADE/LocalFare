import type { Metadata } from "next";

import "./globals.css";

import {
    CurrencyProvider,
} from "@/features/currency/components/CurrencyProvider";

export const metadata: Metadata = {
    title: "FairTrip",
    description:
        "Travel smarter. Pay fairly.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <CurrencyProvider>
                    {children}
                </CurrencyProvider>
            </body>
        </html>
    );
}