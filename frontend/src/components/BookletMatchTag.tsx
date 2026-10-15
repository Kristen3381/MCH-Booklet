import React from "react";
import { BookletIcon } from "./icons";

export interface BookletMatchTagProps {
  pageNumber?: number;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export function BookletMatchTag({
  pageNumber,
  label,
  className = "",
  size = "md",
}: BookletMatchTagProps) {
  const displayText = label || (pageNumber ? `In Booklet p. ${pageNumber}` : "In Paper Booklet");

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-tabular font-semibold rounded border border-ink/20 bg-clay-light text-ink hover:bg-clay/60 transition-colors cursor-default select-none ${sizeClasses} ${className}`}
      title={
        pageNumber
          ? `Also recorded in your physical clinic booklet on page ${pageNumber}`
          : "Also recorded in your physical clinic booklet"
      }
      role="status"
      aria-label={displayText}
    >
      <BookletIcon size={size === "sm" ? 13 : 15} className="text-forest stroke-[2.2]" />
      <span>{displayText}</span>
    </span>
  );
}
