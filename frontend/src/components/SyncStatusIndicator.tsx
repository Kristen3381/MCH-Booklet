"use client";

import React from "react";
import { SyncCheckIcon, SyncPendingIcon, CloudOfflineIcon } from "./icons";
import { SyncState } from "../lib/api";
import { useAppLocale, SupportedLocale } from "../lib/i18n-context";

export interface SyncStatusIndicatorProps {
  state: SyncState;
  pendingCount?: number;
  locale?: SupportedLocale;
  onTriggerSync?: () => void;
  isSyncing?: boolean;
  compact?: boolean;
  className?: string;
}

export function SyncStatusIndicator({
  state,
  pendingCount = 1,
  locale: propLocale,
  onTriggerSync,
  isSyncing = false,
  compact = false,
  className = "",
}: SyncStatusIndicatorProps) {
  let contextLocale: SupportedLocale = "en";
  try {
    const appLocale = useAppLocale();
    contextLocale = appLocale.locale;
  } catch {
    contextLocale = "en";
  }

  const locale = propLocale || contextLocale;
  const isSw = locale === "sw";

  if (compact) {
    if (state === "synced") {
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-forest-light text-forest border border-forest-border select-none ${className}`}
          title={isSw ? "Rekodi zote zimehifadhiwa salama" : "All records are safely backed up"}
        >
          <SyncCheckIcon size={14} className="stroke-[2.5]" />
          <span className="hidden sm:inline">{isSw ? "Imesasishwa" : "Synced"}</span>
        </div>
      );
    }

    if (state === "pending") {
      return (
        <button
          type="button"
          onClick={onTriggerSync}
          disabled={isSyncing}
          className={`touch-target inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-heading font-bold bg-ochre-light text-ochre-dark border border-ochre-border hover:bg-ochre/25 transition-colors select-none ${className}`}
          title={isSw ? "Bonyeza ili kusawazisha taarifa zinazosubiri" : "Click to sync pending records"}
        >
          <SyncPendingIcon
            size={14}
            className={`stroke-[2.5] ${isSyncing ? "animate-spin" : ""}`}
          />
          <span className="font-tabular">
            <span className="sm:hidden">{pendingCount}</span>
            <span className="hidden sm:inline">
              {pendingCount} {isSw ? "Inasubiri" : "Pending"}
            </span>
          </span>
        </button>
      );
    }

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-terracotta-light text-terracotta-body border border-terracotta-border select-none ${className}`}
        title={isSw ? "Bila mtandao: Rekodi zako zipo salama kwenye simu" : "Offline: Saved records available locally"}
      >
        <CloudOfflineIcon size={14} className="stroke-[2]" />
        <span className="hidden sm:inline">{isSw ? "Bila Mtandao" : "Offline"}</span>
      </div>
    );
  }

  // Expanded card view with single-language nurse-like microcopy
  return (
    <div
      className={`p-4 rounded-md border text-sm transition-all ${
        state === "synced"
          ? "bg-forest-surface border-forest-border/40 text-forest"
          : state === "pending"
          ? "bg-ochre-surface border-ochre-border/40 text-ochre-dark"
          : "bg-terracotta-surface border-terracotta-border/40 text-terracotta-body"
      } ${className}`}
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
                {state === "synced" && (isSw ? "Imesasishwa Kikamilifu" : "Up to date")}
                {state === "pending" &&
                  (isSw
                    ? `${pendingCount} ${
                        pendingCount === 1 ? "Badiliko Linasubiri" : "Mabadiliko Yanasubiri"
                      }`
                    : `${pendingCount} ${
                        pendingCount === 1 ? "Update Waiting" : "Updates Waiting"
                      }`)}
                {state === "offline" &&
                  (isSw ? "Hali ya Bila Mtandao (Offline)" : "Offline Mode")}
              </span>
            </div>

            <p className="text-xs text-ink-muted mt-1 leading-relaxed font-body">
              {state === "synced" &&
                (isSw
                  ? "Rekodi zote za afya, kliniki, na maabara zimehifadhiwa salama."
                  : "All medical records, clinic visits, and lab slips are securely backed up.")}
              {state === "pending" &&
                (isSw
                  ? "Taarifa zako za hivi punde zimehifadhiwa salama kwenye simu hii. Zitasawazishwa mara intaneti ikipatikana."
                  : "Your latest entries are saved safely on this phone. They will automatically upload when network is restored.")}
              {state === "offline" &&
                (isSw
                  ? "Hakuna intaneti inayohitajika. Kundi lako la damu, mzio, na kadi ya dharura vipo tayari wakati wote."
                  : "No cellular connection needed. Your blood group, allergy warnings, and emergency card remain 100% accessible.")}
            </p>
          </div>
        </div>

        {state === "pending" && onTriggerSync && (
          <button
            type="button"
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="touch-target px-3.5 py-1.5 rounded-md bg-ochre text-ink border border-forest font-heading font-bold text-xs hover:bg-ochre-dark hover:text-paper transition-colors shrink-0 shadow-2xs"
          >
            {isSyncing
              ? isSw
                ? "Inasawazisha..."
                : "Syncing..."
              : isSw
              ? "Sawazisha Sasa"
              : "Sync Now"}
          </button>
        )}
      </div>
    </div>
  );
}
