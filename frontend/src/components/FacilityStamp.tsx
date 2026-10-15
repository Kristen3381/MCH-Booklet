import React, { useId } from "react";

export interface FacilityStampProps {
  facilityName: string;
  date: string;
  stampNumber?: string;
  rotation?: number; // degrees, e.g. -2.4, 1.2
  variant?: "terracotta" | "forest" | "indigo" | "ink";
  size?: "sm" | "md" | "lg";
  doubleStrike?: boolean;
  swLabel?: boolean;
  className?: string;
}

export function FacilityStamp({
  facilityName,
  date,
  stampNumber,
  rotation = -2.2,
  variant = "terracotta",
  size = "md",
  doubleStrike = false,
  swLabel = false,
  className = "",
}: FacilityStampProps) {
  const filterId = useId().replace(/:/g, "_");

  // Colors: using #9F3E1A for terracotta text if small, or #C4572F for borders/large text
  const colorMap = {
    terracotta: {
      border: "#C4572F",
      text: "#9F3E1A",
      largeText: "#C4572F",
      bgWash: "rgba(196, 87, 47, 0.08)",
      ghost: "rgba(196, 87, 47, 0.22)",
    },
    forest: {
      border: "#1E4D3B",
      text: "#1E4D3B",
      largeText: "#1E4D3B",
      bgWash: "rgba(30, 77, 59, 0.07)",
      ghost: "rgba(30, 77, 59, 0.2)",
    },
    indigo: {
      border: "#26346B",
      text: "#26346B",
      largeText: "#26346B",
      bgWash: "rgba(38, 52, 107, 0.08)",
      ghost: "rgba(38, 52, 107, 0.22)",
    },
    ink: {
      border: "#1F2A24",
      text: "#1F2A24",
      largeText: "#1F2A24",
      bgWash: "rgba(31, 42, 36, 0.06)",
      ghost: "rgba(31, 42, 36, 0.2)",
    },
  }[variant];

  const sizeDimensions = {
    sm: { width: 170, height: 86, pY: "py-1.5", pX: "px-2.5" },
    md: { width: 210, height: 104, pY: "py-2.5", pX: "px-3.5" },
    lg: { width: 250, height: 124, pY: "py-3", pX: "px-4" },
  }[size];

  const topLabel = swLabel ? "IMETHIBITISHWA KITUONI" : "FACILITY CONFIRMED";

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none transition-transform duration-300 hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      role="note"
      aria-label={`Facility confirmation stamp: ${facilityName}, date ${date}`}
      tabIndex={0}
    >
      {/* SVG Ink Texture Definitions (Distressed bled edges & uneven density on borders/wash only) */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <filter id={`inkFilter_${filterId}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Faint Double-Strike (Ghost Offset Outline) */}
        {doubleStrike && (
          <rect
            x="3"
            y="3"
            width="calc(100% - 6px)"
            height="calc(100% - 6px)"
            rx="5"
            fill="none"
            stroke={colorMap.ghost}
            strokeWidth="1.5"
            filter={`url(#inkFilter_${filterId})`}
          />
        )}

        {/* Primary Hand-Stamped Distressed Border */}
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="5"
          fill={colorMap.bgWash}
          stroke={colorMap.border}
          strokeWidth="2.2"
          filter={`url(#inkFilter_${filterId})`}
        />

        {/* Inner Hand-Stamped Hairline Frame */}
        <rect
          x="5"
          y="5"
          width="calc(100% - 10px)"
          height="calc(100% - 10px)"
          rx="3"
          fill="none"
          stroke={colorMap.border}
          strokeWidth="0.85"
          opacity="0.75"
          filter={`url(#inkFilter_${filterId})`}
        />

        {/* Partially Faded Corner Overlay (Simulating uneven pressure in top-right corner) */}
        <rect
          x="60%"
          y="0"
          width="40%"
          height="45%"
          fill="url(#fadeMask)"
          opacity="0.3"
        />
      </svg>

      {/* Layered Crisp Typography (Not blurred by SVG filter, crisp at 360px) */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center text-center w-full ${sizeDimensions.pX} ${sizeDimensions.pY}`}
        style={{
          minWidth: `${sizeDimensions.width}px`,
        }}
      >
        {/* Top Official Banner */}
        <div
          className="flex items-center justify-center gap-1 font-heading font-extrabold uppercase tracking-widest text-[10px] leading-tight w-full pb-1 border-b"
          style={{
            color: colorMap.largeText,
            borderColor: colorMap.border,
          }}
        >
          <span>★</span>
          <span>{topLabel}</span>
          <span>★</span>
        </div>

        {/* Facility Name (Crisp Bricolage Grotesque) */}
        <div
          className="font-heading font-bold leading-tight my-1 text-xs sm:text-sm tracking-tight px-1"
          style={{
            color: colorMap.largeText,
          }}
        >
          {facilityName}
        </div>

        {/* Date (Crisp Tabular Figures) */}
        <div
          className="font-tabular font-bold text-xs uppercase tracking-wider w-full pt-1 border-t"
          style={{
            color: colorMap.text,
            borderColor: colorMap.border,
          }}
        >
          {date}
        </div>

        {/* REF Line: strictly >= 12px with AA contrast */}
        {stampNumber && (
          <div
            className="font-tabular font-semibold text-xs tracking-tight mt-0.5"
            style={{
              color: colorMap.text,
            }}
          >
            REF: {stampNumber}
          </div>
        )}
      </div>
    </div>
  );
}
