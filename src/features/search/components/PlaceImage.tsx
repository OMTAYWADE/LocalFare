"use client";

import Image from "next/image";
import { useState } from "react";

interface PlaceImageProps {
    imageUrl: string;
    alt: string;
    fallbackUrl?: string;
}

export function PlaceImage({
    imageUrl,
    alt,
    fallbackUrl = "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=60",
}: PlaceImageProps) {
    const [src, setSrc] = useState(imageUrl);
    const [hasErrored, setHasErrored] = useState(false);

    return (
        <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            unoptimized={hasErrored}
            onError={() => {
                if (!hasErrored) {
                    setHasErrored(true);
                    setSrc(fallbackUrl);
                }
            }}
        />
    );
}