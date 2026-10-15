"use client";

import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className = "",
  children,
  ...props
}: TabsPrimitive.TabsListProps) {
  return (
    <TabsPrimitive.List
      className={`inline-flex items-center gap-1 p-1 rounded-md bg-paper-dark border border-ink/15 font-heading text-xs ${className}`}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({
  className = "",
  children,
  ...props
}: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={`touch-target px-3 py-1.5 rounded font-medium text-ink-muted transition-all select-none data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-xs data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-ink/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${className}`}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({
  className = "",
  children,
  ...props
}: TabsPrimitive.TabsContentProps) {
  return (
    <TabsPrimitive.Content
      className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest mt-4 ${className}`}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  );
}
