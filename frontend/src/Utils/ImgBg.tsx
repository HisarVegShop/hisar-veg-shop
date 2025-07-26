import React, { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";

// Function to lighten a hex color
const lightenHex = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + 255 * percent);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + 255 * percent);
  const b = Math.min(255, (num & 0x0000ff) + 255 * percent);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

const ImageWithLighterBg = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");

  useEffect(() => {
    const fac = new FastAverageColor();
    const img = imgRef.current;

    if (img) {
      img.crossOrigin = "anonymous";

      img.onload = () => {
        fac
          .getColorAsync(img)
          .then((color) => {
            const lighter = lightenHex(color.hex, 0.4); // 0.4 = 40% lighter
            setBgColor(lighter);
          })
          .catch((e) => {
            console.error("Color extraction failed:", e);
          });
      };
    }
  }, [src]);

  return (
    <div
      className="p-2 rounded-lg transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <img
        ref={imgRef}
        src={src}
        alt="Product"
        className={`w-full object-contain mix-blend-multiply ${className}`}
      />
    </div>
  );
};

export default ImageWithLighterBg;
