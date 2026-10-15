"use client";

import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export function Switch({
  className = "",
  ...props
}: SwitchPrimitive.SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={`touch-target w-12 h-7 bg-paper-dark rounded-full relative border border-ink/25 data-[state=checked]:bg-forest data-[state=checked]:border-forest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest cursor-pointer p-0.5 inline-flex items-center ${className}`}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block w-5 h-5 bg-paper rounded-full shadow-xs border border-ink/15 transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-5.5 will-change-transform" />
    </SwitchPrimitive.Root>
  );
}
