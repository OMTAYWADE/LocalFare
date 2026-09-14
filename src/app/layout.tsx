import type { Metadata } from "next";

import "./globals.css";

import Providers from "./providers";

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
                <Providers>
                    <CurrencyProvider>
                        {children}
                    </CurrencyProvider>
                </Providers>
            </body>
        </html>
    );
}