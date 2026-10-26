"use client";

import React, { useState } from "react";
import { CheckIcon, CalendarIcon, BookletIcon } from "./icons";
import { Encounter } from "../lib/models/fhir";
import { useAppLocale, SupportedLocale } from "../lib/i18n-context";

export interface JourneyPathProps {
  encounters?: Encounter[];
  currentWeek?: number;
  locale?: SupportedLocale;
  onSelectVisit?: (contactNumber: number) => void;
  className?: string;
}

interface VisitMetadata {
  contact: number;
  weeksLabel: string;
  titleEn: string;
  titleSw: string;
  focusEn: string;
  focusSw: string;
  defaultStatus: "done" | "next" | "upcoming";
  bookletPage: number;
  // Coordinates for mobile vertical winding path (viewBox: 0 0 340 680)
  mobile: { x: number; y: number; labelSide: "left" | "right" };
  // Coordinates for desktop undulating path (viewBox: 0 0 840 250)
  desktop: { x: number; y: number };
}

const ANC_SCHEDULE: VisitMetadata[] = [
  {
    contact: 1,
    weeksLabel: "< 12w",
    titleEn: "1st Contact: Early Booking",
    titleSw: "Kliniki ya 1: Kujiandikisha Mapema",
    focusEn: "Baseline blood & urine labs, booklet registration, IFAS start",
    focusSw: "Vipimo vya mwanzo vya damu na mkojo, usajili wa kijitabu, kuanza IFAS",
    defaultStatus: "done",
    bookletPage: 3,
    mobile: { x: 85, y: 50, labelSide: "right" },
    desktop: { x: 60, y: 125 },
  },
  {
    contact: 2,
    weeksLabel: "20w",
    titleEn: "2nd Contact: Anomaly Scan",
    titleSw: "Kliniki ya 2: Picha ya Ultrasound",
    focusEn: "Ultrasound anomaly scan, Td1 immunization, Deworming",
    focusSw: "Uchunguzi wa ultrasound, chanjo ya Td1, dawa ya minyoo",
    defaultStatus: "done",
    bookletPage: 6,
    mobile: { x: 255, y: 135, labelSide: "left" },
    desktop: { x: 165, y: 55 },
  },
  {
    contact: 3,
    weeksLabel: "26w",
    titleEn: "3rd Contact: Mid-Pregnancy Check",
    titleSw: "Kliniki ya 3: Uchunguzi wa Katikati",
    focusEn: "Hemoglobin re-test, Malaria IPTp-SP dose 1, IFAS refill",
    focusSw: "Kipimo cha pili cha Hb (damu), kinga ya malaria IPTp, kuongeza IFAS",
    defaultStatus: "done",
    bookletPage: 7,
    mobile: { x: 85, y: 220, labelSide: "right" },
    desktop: { x: 275, y: 180 },
  },
  {
    contact: 4,
    weeksLabel: "28w",
    titleEn: "4th Contact: Fetal Well-being",
    titleSw: "Kliniki ya 4: Hali ya Mtoto",
    focusEn: "Fundal height 27cm, fetal heart rate 142 bpm, BP check",
    focusSw: "Urefu wa tumbo 27cm, mapigo ya moyo wa mtoto 142 bpm, shinikizo la damu",
    defaultStatus: "done",
    bookletPage: 8,
    mobile: { x: 255, y: 305, labelSide: "left" },
    desktop: { x: 385, y: 60 },
  },
  {
    contact: 5,
    weeksLabel: "30w",
    titleEn: "5th Contact: Birth Preparedness",
    titleSw: "Kliniki ya 5: Maandalizi ya Kujifungua",
    focusEn: "Birth plan, emergency kit, Danger signs warning education",
    focusSw: "Mpango wa uzazi, vifaa vya hospitali, elimu ya dalili za hatari",
    defaultStatus: "next",
    bookletPage: 9,
    mobile: { x: 85, y: 395, labelSide: "right" },
    desktop: { x: 495, y: 180 },
  },
  {
    contact: 6,
    weeksLabel: "34w",
    titleEn: "6th Contact: Pre-eclampsia Screen",
    titleSw: "Kliniki ya 6: Uchunguzi wa Shinikizo",
    focusEn: "Urinalysis protein, blood pressure, fetal growth monitoring",
    focusSw: "Uchunguzi wa mkojo, shinikizo la damu, makuzi ya mtoto",
    defaultStatus: "upcoming",
    bookletPage: 10,
    mobile: { x: 255, y: 480, labelSide: "left" },
    desktop: { x: 605, y: 60 },
  },
  {
    contact: 7,
    weeksLabel: "36w",
    titleEn: "7th Contact: Presentation Check",
    titleSw: "Kliniki ya 7: Mkao wa Mtoto",
    focusEn: "Fetal presentation (cephalic), confirm transport plan",
    focusSw: "Kuangalia mtoto amejipanga vizuri, uthibitisho wa usafiri wa dharura",
    defaultStatus: "upcoming",
    bookletPage: 11,
    mobile: { x: 85, y: 565, labelSide: "right" },
    desktop: { x: 710, y: 175 },
  },
  {
    contact: 8,
    weeksLabel: "38-40w",
    titleEn: "8th Contact: Delivery Readiness",
    titleSw: "Kliniki ya 8: Tayari Kujifungua",
    focusEn: "Final delivery check at maternity facility, newborn care prep",
    focusSw: "Uchunguzi wa mwisho kabla ya kujifungua, maandalizi ya mtoto mchanga",
    defaultStatus: "upcoming",
    bookletPage: 12,
    mobile: { x: 255, y: 640, labelSide: "left" },
    desktop: { x: 795, y: 105 },
  },
];

export function JourneyPath({
  encounters,
  currentWeek = 28,
  locale: propLocale,
  onSelectVisit,
  className = "",
}: JourneyPathProps) {
  let contextLocale: SupportedLocale = "en";
  try {
    const appLocale = useAppLocale();
    contextLocale = appLocale.locale;
  } catch {
    contextLocale = "en";
  }

  const locale = propLocale || contextLocale;
  const isSw = locale === "sw";

  const [selectedContact, setSelectedContact] = useState<number>(5);

  const visits = ANC_SCHEDULE.map((v) => {
    const enc = encounters?.find((e) => e.contactNumber === v.contact);
    let status = v.defaultStatus;
    if (enc) {
      if (enc.status === "finished") status = "done";
      else if (enc.status === "in-progress" || enc.contactNumber === 5) status = "next";
      else status = "upcoming";
    }
    return { ...v, status, encounter: enc };
  });

  const activeVisit = visits.find((v) => v.contact === selectedContact) || visits[4];

  // Mobile SVG bezier path definition (viewBox: 0 0 340 680)
  const mobilePathD = `
    M 85 50
    C 170 50, 255 85, 255 135
    C 255 185, 85 170, 85 220
    C 85 270, 255 255, 255 305
    C 255 355, 85 345, 85 395
    C 85 445, 255 430, 255 480
    C 255 530, 85 515, 85 565
    C 85 615, 255 595, 255 640
  `;

  // Desktop SVG bezier path definition (viewBox: 0 0 840 250)
  const desktopPathD = `
    M 60 125
    C 110 75, 125 55, 165 55
    C 215 55, 225 180, 275 180
    C 325 180, 335 60, 385 60
    C 435 60, 445 180, 495 180
    C 545 180, 555 60, 605 60
    C 655 60, 665 175, 710 175
    C 745 175, 765 135, 795 105
  `;

  return (
    <div className={`space-y-4 ${className}`}>
      <style>{`
        @keyframes journeyDrawRoute {
          from {
            stroke-dashoffset: 2200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .journey-draw-route {
          stroke-dasharray: 2200;
          stroke-dashoffset: 2200;
          animation: journeyDrawRoute 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .journey-draw-route {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>

      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest"></span>
            <span className="text-xs font-heading font-bold tracking-wider uppercase text-forest">
              {isSw ? "Ratiba ya Kliniki (Kliniki 8)" : "Antenatal Schedule (8 Contacts)"}
            </span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-ink mt-1">
            {isSw ? "Safari Yako ya Ujauzito" : "Your Pregnancy Journey"}
          </h3>
          <p className="text-sm text-ink-muted mt-0.5 font-body">
            {isSw
              ? `Kliniki 8 zinazopendekezwa sambamba na kijitabu chako. Uko wiki ya `
              : `8 recommended contacts alongside your paper booklet. Currently at `}
            <span className="font-tabular font-bold text-forest underline decoration-ochre decoration-2">
              {currentWeek} {isSw ? "ya ujauzito" : "weeks"}
            </span>
            .
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-tabular shrink-0 bg-paper-dark/40 px-3 py-1.5 rounded-full border border-ink/10">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-forest border border-forest inline-flex items-center justify-center text-paper text-[9px]">
              ✓
            </span>
            <span className="text-ink font-medium">{isSw ? "Imekamilika" : "Done"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-ochre border-2 border-forest ring-2 ring-ochre/40"></span>
            <span className="text-ink font-bold">{isSw ? "Ijayo" : "Next"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-paper border-2 border-ink/40"></span>
            <span className="text-ink-muted">{isSw ? "Zijazo" : "Upcoming"}</span>
          </div>
        </div>
      </div>

      {/* Route Container: Hand-drawn Winding Path */}
      <div className="relative w-full bg-paper rounded-lg p-2 sm:p-4 border border-ink/10 select-none overflow-hidden">
        {/* MOBILE VIEW (< 640px): Tall vertical winding S-curve */}
        <div className="block sm:hidden relative w-full h-[680px]">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 340 680"
            fill="none"
          >
            {/* Background textured track */}
            <path
              d={mobilePathD}
              stroke="#D8C8B0"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />
            {/* Animated foreground drawn route */}
            <path
              d={mobilePathD}
              stroke="#1E4D3B"
              strokeWidth="4"
              strokeLinecap="round"
              className="journey-draw-route"
            />
          </svg>

          {/* Markers overlaid on Mobile vertical path */}
          {visits.map((item) => {
            const isSelected = item.contact === selectedContact;
            const isDone = item.status === "done";
            const isNext = item.status === "next";
            const isUpcoming = item.status === "upcoming";

            const posX = (item.mobile.x / 340) * 100;
            const posY = (item.mobile.y / 680) * 100;

            return (
              <div
                key={item.contact}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center"
                style={{ left: `${posX}%`, top: `${posY}%` }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedContact(item.contact);
                    onSelectVisit?.(item.contact);
                  }}
                  className={`touch-target min-w-[48px] min-h-[48px] p-0 flex items-center justify-center transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-full ${
                    isSelected ? "scale-110" : "hover:scale-105"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${isSw ? "Kliniki ya" : "Visit"} ${item.contact}, ${item.weeksLabel}, ${
                    isSw ? item.titleSw : item.titleEn
                  }, Status: ${item.status}`}
                >
                  {/* Next Visit: Noticeably larger (50px) filled with Ochre */}
                  {isNext && (
                    <div
                      className={`w-[50px] h-[50px] rounded-full bg-ochre border-2 border-forest ring-4 ring-ochre/40 flex flex-col items-center justify-center font-tabular font-bold text-ink shadow-md transition-all ${
                        isSelected ? "ring-forest ring-offset-2 ring-offset-paper" : ""
                      }`}
                    >
                      <span className="text-xs uppercase leading-none text-forest font-extrabold">
                        {isSw ? "Ijayo" : "Next"}
                      </span>
                      <span className="text-base font-black leading-none mt-0.5">
                        {item.contact}
                      </span>
                    </div>
                  )}

                  {/* Done Visit: 36px filled with Forest */}
                  {isDone && (
                    <div
                      className={`w-9 h-9 rounded-full bg-forest text-paper border border-forest flex items-center justify-center font-tabular font-bold text-sm shadow-xs transition-all ${
                        isSelected ? "ring-2 ring-forest ring-offset-2 ring-offset-paper" : ""
                      }`}
                    >
                      <CheckIcon size={18} className="stroke-[2.5]" />
                    </div>
                  )}

                  {/* Upcoming Visit: 36px hollow with paper interior */}
                  {isUpcoming && (
                    <div
                      className={`w-9 h-9 rounded-full bg-paper text-ink-muted border-2 border-ink/40 flex items-center justify-center font-tabular font-bold text-sm shadow-2xs transition-all ${
                        isSelected ? "ring-2 ring-forest ring-offset-2 ring-offset-paper border-forest text-forest" : ""
                      }`}
                    >
                      {item.contact}
                    </div>
                  )}
                </button>

                {/* Sub-label positioned to not clip edge */}
                <div
                  className={`absolute whitespace-nowrap pointer-events-none text-xs font-tabular ${
                    item.mobile.labelSide === "right"
                      ? "left-12 pl-1 text-left"
                      : "right-12 pr-1 text-right"
                  }`}
                >
                  <span className="font-bold text-ink block leading-none">
                    {item.weeksLabel}
                  </span>
                  <span className="text-[11px] text-ink-muted block mt-0.5 leading-none">
                    {isSw ? `Kliniki ${item.contact}` : `Contact ${item.contact}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP VIEW (>= 640px): Wide undulating serpentine river route */}
        <div className="hidden sm:block relative w-full h-[250px]">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 840 250"
            fill="none"
          >
            {/* Background textured track */}
            <path
              d={desktopPathD}
              stroke="#D8C8B0"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="6 4"
            />
            {/* Animated foreground drawn route */}
            <path
              d={desktopPathD}
              stroke="#1E4D3B"
              strokeWidth="4.5"
              strokeLinecap="round"
              className="journey-draw-route"
            />
          </svg>

          {/* Markers overlaid on Desktop path */}
          {visits.map((item) => {
            const isSelected = item.contact === selectedContact;
            const isDone = item.status === "done";
            const isNext = item.status === "next";
            const isUpcoming = item.status === "upcoming";

            const posX = (item.desktop.x / 840) * 100;
            const posY = (item.desktop.y / 250) * 100;

            return (
              <div
                key={item.contact}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                style={{ left: `${posX}%`, top: `${posY}%` }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedContact(item.contact);
                    onSelectVisit?.(item.contact);
                  }}
                  className={`touch-target min-w-[48px] min-h-[48px] p-0 flex items-center justify-center transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-full ${
                    isSelected ? "scale-110" : "hover:scale-105"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${isSw ? "Kliniki ya" : "Visit"} ${item.contact}, ${item.weeksLabel}, ${
                    isSw ? item.titleSw : item.titleEn
                  }, Status: ${item.status}`}
                >
                  {/* Next Visit: Noticeably larger (52px) filled with Ochre */}
                  {isNext && (
                    <div
                      className={`w-[52px] h-[52px] rounded-full bg-ochre border-2 border-forest ring-4 ring-ochre/40 flex flex-col items-center justify-center font-tabular font-bold text-ink shadow-md transition-all ${
                        isSelected ? "ring-forest ring-offset-2 ring-offset-paper" : ""
                      }`}
                    >
                      <span className="text-[10px] uppercase leading-none text-forest font-extrabold">
                        {isSw ? "Ijayo" : "Next"}
                      </span>
                      <span className="text-base font-black leading-none mt-0.5">
                        {item.contact}
                      </span>
                    </div>
                  )}

                  {/* Done Visit: 36px filled with Forest */}
                  {isDone && (
                    <div
                      className={`w-9 h-9 rounded-full bg-forest text-paper border border-forest flex items-center justify-center font-tabular font-bold text-sm shadow-xs transition-all ${
                        isSelected ? "ring-2 ring-forest ring-offset-2 ring-offset-paper" : ""
                      }`}
                    >
                      <CheckIcon size={18} className="stroke-[2.5]" />
                    </div>
                  )}

                  {/* Upcoming Visit: 36px hollow with paper interior */}
                  {isUpcoming && (
                    <div
                      className={`w-9 h-9 rounded-full bg-paper text-ink-muted border-2 border-ink/40 flex items-center justify-center font-tabular font-bold text-sm shadow-2xs transition-all ${
                        isSelected ? "ring-2 ring-forest ring-offset-2 ring-offset-paper border-forest text-forest" : ""
                      }`}
                    >
                      {item.contact}
                    </div>
                  )}
                </button>

                {/* Sub-label centered below node */}
                <div className="whitespace-nowrap pointer-events-none text-center mt-1">
                  <span className="font-tabular font-bold text-xs text-ink block leading-none">
                    {item.weeksLabel}
                  </span>
                  <span className="text-[11px] font-body text-ink-muted block mt-0.5 leading-none">
                    {isNext
                      ? isSw
                        ? "★ Ijayo"
                        : "★ Next Up"
                      : isDone
                      ? isSw
                        ? "Imekamilika"
                        : "Done"
                      : isSw
                      ? "Inatarajiwa"
                      : "Scheduled"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tapped Visit Details Panel Beneath (No boxed cards around markers) */}
      <div className="pt-3 border-t border-ink/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-heading font-bold uppercase bg-clay/60 text-ink">
              {isSw
                ? `Kliniki ya ${activeVisit.contact} kati ya 8`
                : `Contact ${activeVisit.contact} of 8`}
            </span>
            <span className="text-xs font-tabular text-ink-muted font-medium">
              {isSw ? `Wiki ya ${activeVisit.weeksLabel}` : `Week ${activeVisit.weeksLabel}`}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-tabular text-forest bg-forest-light px-2 py-0.5 rounded border border-forest-border/30">
              <BookletIcon size={13} />
              {isSw
                ? `Ukurasa wa ${activeVisit.bookletPage} Kijitabu`
                : `Booklet p. ${activeVisit.bookletPage}`}
            </span>
          </div>

          <h4 className="font-heading text-lg font-bold text-ink">
            {isSw ? activeVisit.titleSw : activeVisit.titleEn}
          </h4>
          <p className="text-sm text-ink-muted font-body">
            <strong className="text-ink font-semibold">
              {isSw ? "Lengo la Kliniki:" : "Clinical Focus:"}
            </strong>{" "}
            {isSw ? activeVisit.focusSw : activeVisit.focusEn}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
          {activeVisit.status === "done" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-forest-light text-forest border border-forest-border text-xs font-heading font-bold">
              <CheckIcon size={16} />
              <span>
                {isSw ? "Imethibitishwa Kijitabuni" : "Stamped in Paper Booklet"}
              </span>
            </div>
          )}
          {activeVisit.status === "next" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-ochre-light text-ochre-dark border border-ochre-border text-xs font-heading font-bold">
              <CalendarIcon size={16} />
              <span>{isSw ? "Inatakiwa Wiki ya 30" : "Due at 30 Weeks"}</span>
            </div>
          )}
          {activeVisit.status === "upcoming" && (
            <span className="text-xs font-tabular text-ink-faint">
              {isSw
                ? "Inasubiri wiki husika ya ujauzito"
                : "Unlocks at scheduled gestational week"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
