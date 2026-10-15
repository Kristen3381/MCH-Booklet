"use client";

import React, { useState } from "react";
import { CheckIcon, CalendarIcon, BookletIcon } from "./icons";
import { Encounter } from "../lib/models/fhir";

export interface JourneyPathProps {
  encounters?: Encounter[];
  currentWeek?: number;
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
  },
];

export function JourneyPath({
  encounters,
  currentWeek = 28,
  onSelectVisit,
  className = "",
}: JourneyPathProps) {
  const [selectedContact, setSelectedContact] = useState<number>(4);

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

  const activeVisit = visits.find((v) => v.contact === selectedContact) || visits[3];

  return (
    <div className={`bg-paper-card border border-ink/15 rounded-lg p-4 sm:p-6 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/15 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest"></span>
            <span className="text-xs font-heading font-bold tracking-wider uppercase text-forest">
              Antenatal Schedule (8 Contacts)
            </span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-ink mt-1">
            Safari Yako ya Ujauzito / ANC Journey
          </h3>
          <p className="text-sm text-ink-muted mt-0.5 font-body">
            8 recommended contacts alongside your paper booklet. Currently at{" "}
            <span className="font-tabular font-bold text-forest underline decoration-ochre decoration-2">
              {currentWeek} weeks
            </span>
            .
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-tabular shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-forest border border-forest"></span>
            <span className="text-ink-muted font-medium">Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-ochre border-2 border-forest animate-pulse"></span>
            <span className="text-ink font-bold">Next</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-paper-dark border border-ink/30"></span>
            <span className="text-ink-faint">Upcoming</span>
          </div>
        </div>
      </div>

      {/* S-Curve Path Display for Large Screens */}
      <div className="hidden lg:block relative w-full h-24 mb-4">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 800 90"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 50 45 C 160 15, 260 75, 400 45 C 540 15, 660 75, 750 45"
            stroke="#E2D7C7"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 50 45 C 160 15, 260 75, 400 45"
            stroke="#1E4D3B"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="4 2"
          />
        </svg>
      </div>

      {/* Grid of 8 Visits (Mobile-Optimized Touch Targets >= 48px) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {visits.map((item) => {
          const isSelected = item.contact === selectedContact;
          const isDone = item.status === "done";
          const isNext = item.status === "next";

          let badgeStyle = "bg-paper-dark text-ink-faint border-ink/20";
          if (isDone) {
            badgeStyle = "bg-forest text-paper-light border-forest";
          } else if (isNext) {
            badgeStyle = "bg-ochre text-ink border-forest ring-2 ring-forest/40";
          }

          return (
            <button
              key={item.contact}
              type="button"
              onClick={() => {
                setSelectedContact(item.contact);
                onSelectVisit?.(item.contact);
              }}
              className={`touch-target flex flex-col items-center text-center p-3 rounded-md transition-all relative border min-h-[58px] ${
                isSelected
                  ? "bg-paper border-forest ring-2 ring-forest shadow-xs"
                  : "bg-paper-card border-ink/15 hover:border-ink/35 hover:bg-paper"
              }`}
              aria-pressed={isSelected}
              aria-label={`Visit ${item.contact}, ${item.weeksLabel}, ${item.titleEn}, Status: ${item.status}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-tabular font-bold text-sm border shadow-2xs transition-transform ${badgeStyle} ${
                  isSelected ? "scale-105" : ""
                }`}
              >
                {isDone ? (
                  <CheckIcon size={18} className="stroke-[2.5]" />
                ) : (
                  item.contact
                )}
              </div>

              <span className="font-tabular font-bold text-xs mt-2 text-ink">
                {item.weeksLabel}
              </span>

              <span className="text-[11px] leading-tight text-ink-muted mt-1 font-body">
                {isNext ? (
                  <span className="text-ochre-dark font-bold">★ Next Up</span>
                ) : isDone ? (
                  <span className="text-forest font-semibold">Done</span>
                ) : (
                  "Scheduled"
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Visit Details Card */}
      <div className="mt-5 p-4 rounded-md bg-paper border border-ink/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-heading font-bold uppercase bg-clay/60 text-ink">
              Contact {activeVisit.contact} of 8
            </span>
            <span className="text-xs font-tabular text-ink-muted font-medium">
              Week {activeVisit.weeksLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-tabular text-forest bg-forest-light px-2 py-0.5 rounded border border-forest-border/30">
              <BookletIcon size={13} />
              Booklet p. {activeVisit.bookletPage}
            </span>
          </div>

          <h4 className="font-heading text-lg font-bold text-ink">
            {activeVisit.titleEn}
          </h4>
          <p className="text-sm text-ink-muted font-body">
            <strong className="text-ink font-semibold">Clinical Focus:</strong> {activeVisit.focusEn}
          </p>
          <p className="text-xs text-ink-muted italic font-body">
            <strong>Kiswahili:</strong> {activeVisit.focusSw}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
          {activeVisit.status === "done" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-forest-light text-forest border border-forest-border text-xs font-heading font-bold">
              <CheckIcon size={16} />
              <span>Stamped in Paper Booklet</span>
            </div>
          )}
          {activeVisit.status === "next" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-ochre-light text-ochre-dark border border-ochre-border text-xs font-heading font-bold">
              <CalendarIcon size={16} />
              <span>Due at 30 Weeks</span>
            </div>
          )}
          {activeVisit.status === "upcoming" && (
            <span className="text-xs font-tabular text-ink-faint">
              Unlocks at scheduled gestational week
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
