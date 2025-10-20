"use client";

import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholderSrc?: string; // Optional custom placeholder
}

const FallbackImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  placeholderSrc = "/placeholder.png", // Make sure this exists in /public
}: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc || placeholderSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(placeholderSrc)}
      unoptimized // Needed if using external URLs not in next.config.js
    />
  );
};

export default FallbackImage;
