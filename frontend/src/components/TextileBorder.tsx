import React, { useId } from "react";

export interface TextileBorderProps {
  className?: string;
  variant?: "primary" | "subtle" | "accent";
  size?: "sm" | "md" | "lg";
}

export function TextileBorder({
  className = "",
  variant = "primary",
  size = "md",
}: TextileBorderProps) {
  const patternId = useId().replace(/:/g, "_");

  const colors = {
    primary: {
      primary: "#1E4D3B", // Forest
      accent: "#C4572F",  // Terracotta
      highlight: "#E0A030", // Ochre
      hairline: "rgba(31, 42, 36, 0.22)",
    },
    subtle: {
      primary: "rgba(31, 42, 36, 0.35)",
      accent: "rgba(196, 87, 47, 0.3)",
      highlight: "rgba(224, 160, 48, 0.3)",
      hairline: "rgba(31, 42, 36, 0.12)",
    },
    accent: {
      primary: "#C4572F",
      accent: "#E0A030",
      highlight: "#1E4D3B",
      hairline: "rgba(196, 87, 47, 0.2)",
    },
  }[variant];

  // Heights for standard vs prominent signature divider
  const dimensions = {
    sm: { height: 12, viewBox: "0 0 64 12", patternH: 12, py: "my-2" },
    md: { height: 16, viewBox: "0 0 64 16", patternH: 16, py: "my-4" },
    lg: { height: 28, viewBox: "0 0 80 28", patternH: 28, py: "my-6 sm:my-8" },
  }[size];

  if (size === "lg") {
    return (
      <div
        className={`w-full overflow-hidden select-none ${dimensions.py} ${className}`}
        role="separator"
        aria-hidden="true"
      >
        <svg
          className="w-full h-7 block"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="repeat-x"
          viewBox={dimensions.viewBox}
        >
          <pattern
            id={patternId}
            width="80"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            {/* Top and Bottom Hairline Framing Rules */}
            <line x1="0" y1="2" x2="80" y2="2" stroke={colors.hairline} strokeWidth="1" />
            <line x1="0" y1="26" x2="80" y2="26" stroke={colors.hairline} strokeWidth="1" />

            {/* Central Stepped Diamond Motif */}
            <path
              d="M 6 14 L 14 6 L 22 14 L 14 22 Z"
              fill="none"
              stroke={colors.primary}
              strokeWidth="1.8"
            />
            <rect x="12" y="12" width="4" height="4" fill={colors.accent} />

            {/* Stitched Vertical Ladder Ticks */}
            <line x1="28" y1="5" x2="28" y2="23" stroke={colors.hairline} strokeWidth="1.2" />
            <line x1="32" y1="8" x2="32" y2="20" stroke={colors.highlight} strokeWidth="1.5" />
            <line x1="36" y1="5" x2="36" y2="23" stroke={colors.hairline} strokeWidth="1.2" />

            {/* Opposing Geometric Chevron Weave */}
            <polygon
              points="42,6 52,14 42,22"
              fill="none"
              stroke={colors.accent}
              strokeWidth="1.8"
            />
            <polygon
              points="62,6 52,14 62,22"
              fill="none"
              stroke={colors.primary}
              strokeWidth="1.8"
            />

            {/* Secondary Rhythm Diamonds */}
            <line x1="68" y1="8" x2="68" y2="20" stroke={colors.highlight} strokeWidth="1.5" />
            <circle cx="74" cy="14" r="2.2" fill={colors.primary} />
          </pattern>

          <rect width="100%" height="28" fill={`url(#${patternId})`} />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-hidden select-none ${dimensions.py} ${className}`}
      role="separator"
      aria-hidden="true"
    >
      <svg
        className={`w-full ${size === "sm" ? "h-3" : "h-4"} block`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="repeat-x"
        viewBox={dimensions.viewBox}
      >
        <pattern
          id={patternId}
          width="64"
          height={dimensions.patternH}
          patternUnits="userSpaceOnUse"
        >
          {/* Top hairline rule */}
          <line
            x1="0"
            y1="1.5"
            x2="64"
            y2="1.5"
            stroke={colors.hairline}
            strokeWidth="0.75"
          />

          {/* Stepped chevron */}
          <path
            d="M 4 8 L 8 4 L 12 8 L 8 12 Z"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1.2"
          />
          <circle cx="8" cy="8" r="1" fill={colors.accent} />

          {/* Stitched rhythm ticks */}
          <line
            x1="16"
            y1="4"
            x2="16"
            y2="12"
            stroke={colors.hairline}
            strokeWidth="1"
          />
          <line
            x1="19"
            y1="6"
            x2="19"
            y2="10"
            stroke={colors.highlight}
            strokeWidth="1.2"
          />

          {/* Opposing triangles */}
          <polygon
            points="24,4 32,8 24,12"
            fill="none"
            stroke={colors.accent}
            strokeWidth="1.2"
          />
          <polygon
            points="40,4 32,8 40,12"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1.2"
          />

          {/* Stitched rhythm ticks */}
          <line
            x1="45"
            y1="6"
            x2="45"
            y2="10"
            stroke={colors.highlight}
            strokeWidth="1.2"
          />
          <line
            x1="48"
            y1="4"
            x2="48"
            y2="12"
            stroke={colors.hairline}
            strokeWidth="1"
          />

          {/* Small diamond */}
          <path
            d="M 56 3 L 61 8 L 56 13 L 51 8 Z"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1.2"
          />
          <rect
            x="55"
            y="7"
            width="2"
            height="2"
            fill={colors.accent}
          />

          {/* Bottom hairline rule */}
          <line
            x1="0"
            y1="14.5"
            x2="64"
            y2="14.5"
            stroke={colors.hairline}
            strokeWidth="0.75"
          />
        </pattern>

        <rect width="100%" height={dimensions.patternH} fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
