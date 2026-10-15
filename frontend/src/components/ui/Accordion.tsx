"use client";

import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "../icons";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className = "",
  children,
  ...props
}: AccordionPrimitive.AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={`border-b border-ink/15 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  );
}

export function AccordionTrigger({
  className = "",
  children,
  ...props
}: AccordionPrimitive.AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={`touch-target flex flex-1 items-center justify-between py-4 text-left font-heading font-bold text-ink transition-all hover:text-forest group [&[data-state=open]>svg]:rotate-90 ${className}`}
        {...props}
      >
        {children}
        <ChevronRightIcon
          size={18}
          className="shrink-0 text-ink-muted transition-transform duration-200 stroke-[2]"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className = "",
  children,
  ...props
}: AccordionPrimitive.AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className={`overflow-hidden text-sm text-ink-muted pb-4 pt-1 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </AccordionPrimitive.Content>
  );
}
