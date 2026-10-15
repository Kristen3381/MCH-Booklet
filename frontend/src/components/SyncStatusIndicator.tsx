"use client";

import React from "react";
import { SyncCheckIcon, SyncPendingIcon, CloudOfflineIcon } from "./icons";
import { SyncState } from "../lib/api";

export interface SyncStatusIndicatorProps {
  state: SyncState;
  pendingCount?: number;
  onTriggerSync?: () => void;
  isSyncing?: boolean;
  compact?: boolean;
  className?: string;
}

export function SyncStatusIndicator({
  state,
  pendingCount = 1,
  onTriggerSync,
  isSyncing = false,
  compact = false,
  className = "",
}: SyncStatusIndicatorProps) {
  if (compact) {
    if (state === "synced") {
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-forest-light text-forest border border-forest-border select-none ${className}`}
          title="All records are safely backed up"
        >
          <SyncCheckIcon size={14} className="stroke-[2.5]" />
          <span>Synced</span>
        </div>
      );
    }

    if (state === "pending") {
      return (
        <button
          type="button"
          onClick={onTriggerSync}
          disabled={isSyncing}
          className={`touch-target inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold bg-ochre-light text-ochre-dark border border-ochre-border hover:bg-ochre/25 transition-colors select-none ${className}`}
          title="Click to sync pending records"
        >
          <SyncPendingIcon
            size={14}
            className={`stroke-[2.5] ${isSyncing ? "animate-spin" : ""}`}
          />
          <span className="font-tabular">{pendingCount} Pending</span>
        </button>
      );
    }

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-terracotta-light text-terracotta-body border border-terracotta-border select-none ${className}`}
        title="Offline: Saved records available locally"
      >
        <CloudOfflineIcon size={14} className="stroke-[2]" />
        <span>Offline</span>
      </div>
    );
  }

  // Expanded card view with nurse-like microcopy
  return (
    <div
      className={`p-4 rounded-md border text-sm transition-all ${
        state === "synced"
          ? "bg-forest-surface border-forest-border/40 text-forest-dark"
          : state === "pending"
          ? "bg-ochre-surface border-ochre-border/50 text-ochre-dark"
          : "bg-terracotta-surface border-terracotta-border/40 text-terracotta-body"
      } ${className}`}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
              state === "synced"
                ? "bg-forest-light border-forest text-forest"
                : state === "pending"
                ? "bg-ochre-light border-ochre-dark text-ochre-dark"
                : "bg-terracotta-light border-terracotta-border text-terracotta-body"
            }`}
          >
            {state === "synced" && <SyncCheckIcon size={18} className="stroke-[2.5]" />}
            {state === "pending" && (
              <SyncPendingIcon
                size={18}
                className={`stroke-[2.5] ${isSyncing ? "animate-spin" : ""}`}
              />
            )}
            {state === "offline" && <CloudOfflineIcon size={18} className="stroke-[2]" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base text-ink">
                {state === "synced" && "Up to date / Imesasishwa"}
                {state === "pending" &&
                  `${pendingCount} ${
                    pendingCount === 1 ? "Update Waiting" : "Updates Waiting"
                  } / Mabadiliko Yanasubiri`}
                {state === "offline" && "Offline Mode / Hali ya Bila Mtandao"}
              </span>
            </div>

            <p className="text-xs text-ink-muted mt-1 leading-relaxed font-body">
              {state === "synced" &&
                "All medical records, clinic visits, and lab slips are securely backed up."}
              {state === "pending" &&
                "Your latest entries are saved safely on this phone. They will automatically upload when network is restored."}
              {state === "offline" &&
                "No cellular connection needed. Your blood group, allergy warnings, and emergency card remain 100% accessible."}
            </p>
          </div>
        </div>

        {state === "pending" && onTriggerSync && (
          <button
            type="button"
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="touch-target px-4 py-2 rounded bg-ochre text-ink font-heading font-bold text-xs border border-ochre-dark hover:bg-ochre/80 transition-all shrink-0 self-center"
          >
            {isSyncing ? "Syncing..." : "Sync Now"}
          </button>
        )}
      </div>
    </div>
  );
}
