"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppLocale } from "@/lib/i18n-context";
import {
  usePatient,
  useEncounters,
  useObservations,
  useMedications,
  useSyncStatus,
} from "@/lib/api";
import { FacilityStamp } from "@/components/FacilityStamp";
import { JourneyPath } from "@/components/JourneyPath";
import { LedgerTable, LedgerColumn } from "@/components/LedgerTable";
import { BookletMatchTag } from "@/components/BookletMatchTag";
import { PerforatedCard } from "@/components/PerforatedCard";
import { TextileBorder } from "@/components/TextileBorder";
import { SyncStatusIndicator } from "@/components/SyncStatusIndicator";
import { OfflineEmergencyCard } from "@/components/OfflineEmergencyCard";
import { FundalGrowthChart } from "@/components/FundalGrowthChart";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  BookletIcon,
  FacilityStampIcon,
  JourneyPathIcon,
  StethoscopeIcon,
  DropBloodIcon,
  PillJarIcon,
  ShieldCheckIcon,
  CameraSlipIcon,
  VoiceMicrophoneIcon,
  SyncCheckIcon,
  SyncPendingIcon,
  CloudOfflineIcon,
  AlertTriangleIcon,
  HeartRateIcon,
  UserHeartIcon,
  BookletTagIcon,
  CheckIcon,
  ChevronRightIcon,
  PhoneIcon,
  CalendarIcon,
  EyeIcon,
} from "@/components/icons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/Dialog";
import { Switch } from "@/components/ui/Switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Observation, MedicationStatement } from "@/lib/models/fhir";

export function StyleguideClient() {
  const { locale } = useAppLocale();
  const { data: patient } = usePatient();
  const { data: encounters } = useEncounters();
  const { data: observations } = useObservations();
  const { data: medications } = useMedications();
  const sync = useSyncStatus();

  const [simulatedSyncState, setSimulatedSyncState] = useState<
    "auto" | "synced" | "pending" | "offline"
  >("auto");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [researchConsent, setResearchConsent] = useState<boolean>(true);
  const [facilityConsent, setFacilityConsent] = useState<boolean>(true);

  const effectiveSyncState =
    simulatedSyncState === "auto" ? sync.state : simulatedSyncState;

  // Observation ledger columns
  const observationColumns: LedgerColumn<Observation>[] = [
    {
      header: "Investigation / Kipimo",
      className: "font-heading font-bold text-ink w-2/5",
      cell: (obs) => (
        <div>
          <div className="font-heading font-bold text-ink text-sm sm:text-base">
            {obs.code.display}
          </div>
          <div className="text-xs font-tabular text-ink-muted">
            Code: {obs.code.code}
          </div>
        </div>
      ),
    },
    {
      header: "Result / Matokeo",
      className: "font-tabular font-bold text-ink w-1/5",
      cell: (obs) => (
        <span className="text-sm font-semibold">
          {obs.valueQuantity
            ? `${obs.valueQuantity.value} ${obs.valueQuantity.unit}`
            : obs.valueString}
        </span>
      ),
    },
    {
      header: "Reference Range",
      className: "text-xs font-body text-ink-muted w-1/5",
      cell: (obs) => obs.referenceRange?.text || "Standard",
    },
    {
      header: "Booklet Link",
      className: "w-1/5 text-right",
      cell: (obs) =>
        obs.bookletPage ? (
          <BookletMatchTag pageNumber={obs.bookletPage} size="sm" />
        ) : null,
    },
  ];

  // Medication ledger columns
  const medicationColumns: LedgerColumn<MedicationStatement>[] = [
    {
      header: "Medication / Dawa",
      className: "font-heading font-bold text-ink w-2/5",
      cell: (med) => (
        <div>
          <div className="font-heading font-bold text-ink text-sm sm:text-base">
            {med.medicationCodeableConcept.display}
          </div>
          <span className="text-xs font-heading font-semibold px-2 py-0.5 rounded bg-clay/50 text-ink">
            {med.isOtc ? "OTC Self-Reported" : "Clinic Supply"}
          </span>
        </div>
      ),
    },
    {
      header: "Dosage & Regimen",
      className: "text-xs font-body text-ink w-2/5",
      cell: (med) => (
        <div>
          <div className="font-body text-xs sm:text-sm">{med.dosage.text}</div>
          <div className="text-xs font-tabular text-ink-muted">
            {med.dosage.timing}
          </div>
        </div>
      ),
    },
    {
      header: "Status & Booklet",
      className: "w-1/5 text-right",
      cell: (med) => (
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs font-heading uppercase px-2 py-0.5 rounded font-bold ${
              med.status === "active"
                ? "bg-forest-light text-forest border border-forest-border"
                : "bg-paper-dark text-ink-muted"
            }`}
          >
            {med.status}
          </span>
          {med.bookletPage && (
            <BookletMatchTag pageNumber={med.bookletPage} size="sm" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-paper bg-paper-grain text-ink font-body">
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-xs border-b border-ink/15 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-ink hover:text-forest transition-colors"
            >
              <div className="w-8 h-8 rounded bg-forest text-paper flex items-center justify-center">
                <BookletIcon size={20} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="font-heading font-bold text-base block leading-none">
                  Kitabu
                </span>
                <span className="text-[11px] font-tabular text-ink-muted tracking-tight">
                  Design System &amp; Living Spec
                </span>
              </div>
            </Link>

            {/* Demo Data Mark */}
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-clay/60 border border-ink/15 text-[11px] font-heading font-bold uppercase tracking-wider text-ink">
              Demo data
            </span>
          </div>

          {/* Controls: Sync Status & Bilingual Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded bg-paper-dark border border-ink/15 text-xs font-heading">
              <span className="text-[10px] text-ink-muted uppercase font-bold pr-1">Sync:</span>
              <button
                type="button"
                onClick={() => setSimulatedSyncState("synced")}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  effectiveSyncState === "synced"
                    ? "bg-forest text-paper font-bold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Synced
              </button>
              <button
                type="button"
                onClick={() => setSimulatedSyncState("pending")}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  effectiveSyncState === "pending"
                    ? "bg-ochre text-ink font-bold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setSimulatedSyncState("offline")}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  effectiveSyncState === "offline"
                    ? "bg-terracotta text-paper font-bold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Offline
              </button>
            </div>

            <div className="hidden sm:block">
              <SyncStatusIndicator
                state={effectiveSyncState}
                pendingCount={sync.pendingCount}
                onTriggerSync={sync.triggerSync}
                isSyncing={sync.isSyncing}
                compact
              />
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Living Styleguide Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 sm:space-y-16">
        {/* Section 1: Overview & Foundation */}
        <section className="bg-paper-card border border-ink/20 rounded-lg p-5 sm:p-8 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-terracotta-light text-terracotta-body border border-terracotta-border/30 text-[11px] font-heading font-extrabold uppercase tracking-wide">
                  Design System Specification
                </span>
                <span className="text-xs font-tabular text-ink-muted">
                  Demo data • Data ya majaribio
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-ink leading-tight tracking-tight">
                The Booklet&apos;s Digital Companion
              </h1>

              <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-body">
                Kitabu is a patient-owned digital health wallet for Kenyan maternal and child health.
                It <strong>supplements</strong> the physical clinic booklet—it never replaces it.
                Every token, row, and stamp is tuned for low-end Android displays, touch targets $\ge 48$px,
                and offline resilience.
              </p>
            </div>

            {/* Plain Usage Rules Card */}
            <div className="p-4 rounded-md bg-paper border border-ink/15 max-w-sm space-y-1.5 shrink-0 text-xs font-body">
              <div className="font-heading font-bold text-sm text-forest uppercase tracking-wide">
                Usage Rule: Companion Tenet
              </div>
              <p className="text-ink text-xs leading-relaxed">
                Always instruct the patient to carry their physical paper booklet to clinic appointments.
                This digital wallet travels with the patient when the paper file remains at home.
              </p>
              <div className="text-[11px] font-heading font-bold text-terracotta-body pt-1 border-t border-ink/10">
                Rule: Never use copy like &ldquo;paperless&rdquo; or &ldquo;replaces paper&rdquo;.
              </div>
            </div>
          </div>

          {/* Prominent Signature Divider */}
          <TextileBorder variant="primary" size="lg" className="my-6" />

          {/* Anchor Navigation */}
          <div className="flex flex-wrap gap-2 text-xs font-heading font-bold text-ink-muted">
            <a href="#palette" className="hover:text-forest underline">
              1. Palette &amp; Contrast
            </a>
            <span className="text-ink/30">•</span>
            <a href="#typography" className="hover:text-forest underline">
              2. Typography
            </a>
            <span className="text-ink/30">•</span>
            <a href="#stamps" className="hover:text-forest underline">
              3. Inked Stamps
            </a>
            <span className="text-ink/30">•</span>
            <a href="#journey" className="hover:text-forest underline">
              4. ANC Journey
            </a>
            <span className="text-ink/30">•</span>
            <a href="#ledgers" className="hover:text-forest underline">
              5. Registers &amp; Ledgers
            </a>
            <span className="text-ink/30">•</span>
            <a href="#perforated" className="hover:text-forest underline">
              6. Lab Slip
            </a>
            <span className="text-ink/30">•</span>
            <a href="#emergency" className="hover:text-forest underline">
              7. Emergency Card
            </a>
            <span className="text-ink/30">•</span>
            <a href="#growth" className="hover:text-forest underline">
              8. Growth Curve
            </a>
            <span className="text-ink/30">•</span>
            <a href="#icons" className="hover:text-forest underline">
              9. SVG Icons
            </a>
          </div>
        </section>

        {/* Section 2: Palette & Accessibility Contrast Science */}
        <section id="palette" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              1. Palette Tokens &amp; Contrast Rules
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              WCAG 2.1 AA (≥ 4.5:1 body, ≥ 3.0:1 large/stamps)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Paper */}
            <div className="p-4 rounded-md border border-ink/20 bg-[#F6EFE3] text-[#1F2A24] space-y-2 shadow-2xs">
              <div className="h-10 rounded border border-ink/15 bg-[#F6EFE3]"></div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm">Paper</span>
                <span className="font-tabular text-xs font-bold">#F6EFE3</span>
              </div>
              <p className="text-xs text-ink-muted font-body">
                Primary background canvas. Replaces clinical stark white with warm cardstock.
              </p>
              <div className="text-xs font-tabular font-bold text-forest pt-1 border-t border-ink/10">
                Contrast vs Ink: 12.1:1 (AAA)
              </div>
            </div>

            {/* Ink */}
            <div className="p-4 rounded-md border border-ink/20 bg-[#1F2A24] text-[#F6EFE3] space-y-2 shadow-2xs">
              <div className="h-10 rounded border border-paper/20 bg-[#1F2A24]"></div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm">Ink</span>
                <span className="font-tabular text-xs font-bold text-paper">#1F2A24</span>
              </div>
              <p className="text-xs text-paper/80 font-body">
                Primary text &amp; hairline rules. Deep bottle-black ink softer than #000000.
              </p>
              <div className="text-xs font-tabular font-bold text-ochre pt-1 border-t border-paper/10">
                Contrast vs Paper: 12.1:1 (AAA)
              </div>
            </div>

            {/* Forest */}
            <div className="p-4 rounded-md border border-ink/20 bg-[#1E4D3B] text-[#F6EFE3] space-y-2 shadow-2xs">
              <div className="h-10 rounded border border-paper/20 bg-[#1E4D3B]"></div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm">Forest (Primary)</span>
                <span className="font-tabular text-xs font-bold text-paper">#1E4D3B</span>
              </div>
              <p className="text-xs text-paper/80 font-body">
                Primary brand anchor, completed visits, and verified checkmarks.
              </p>
              <div className="text-xs font-tabular font-bold text-clay-light pt-1 border-t border-paper/10">
                Contrast vs Paper: 7.9:1 (AAA)
              </div>
            </div>

            {/* Terracotta Swatch (with dark body variant) */}
            <div className="p-4 rounded-md border border-ink/20 bg-paper-card text-ink space-y-2 shadow-2xs">
              <div className="h-10 rounded border border-terracotta-border bg-[#C4572F] flex items-center justify-center">
                <span className="font-heading font-extrabold text-xs text-paper uppercase">
                  #C4572F (Stamps &amp; Large)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-terracotta-body">
                  Terracotta
                </span>
                <span className="font-tabular text-xs font-bold text-terracotta-body">
                  #9F3E1A (Body)
                </span>
              </div>
              <p className="text-xs text-ink-muted font-body">
                #C4572F (3.9:1) for stamps &amp; large icons. #9F3E1A (5.6:1) for body text and alerts.
              </p>
              <div className="text-xs font-tabular font-bold text-terracotta-body pt-1 border-t border-ink/10">
                Body text AA: 5.6:1 Pass
              </div>
            </div>

            {/* Ochre Swatch (Safe dark text) */}
            <div className="p-4 rounded-md border border-ink/20 bg-[#E0A030] text-[#1F2A24] space-y-2 shadow-2xs">
              <div className="h-10 rounded border border-ink/15 bg-[#E0A030]"></div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm">Ochre</span>
                <span className="font-tabular text-xs font-bold">#E0A030</span>
              </div>
              <p className="text-xs text-ink font-body">
                Next-visit milestones. Always pair with #1F2A24 ink text (6.6:1 AAA).
              </p>
              <div className="text-xs font-tabular font-bold text-ink pt-1 border-t border-ink/15">
                Body text variant: #8C5E09 (4.9:1 AA)
              </div>
            </div>

            {/* Clay Tint */}
            <div className="p-4 rounded-md border border-ink/20 bg-[#E9C9B8] text-[#1F2A24] space-y-2 shadow-2xs">
              <div className="h-10 rounded border border-ink/15 bg-[#E9C9B8]"></div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm">Clay Tint</span>
                <span className="font-tabular text-xs font-bold">#E9C9B8</span>
              </div>
              <p className="text-xs text-ink font-body">
                Secondary surfaces, booklet tags, and warm register cards.
              </p>
              <div className="text-xs font-tabular font-bold text-ink pt-1 border-t border-ink/15">
                Contrast vs Ink: 8.9:1 (AAA)
              </div>
            </div>

            {/* Indigo (Clinician) */}
            <div className="p-4 rounded-md border border-ink/20 bg-[#26346B] text-[#F6EFE3] space-y-2 shadow-2xs">
              <div className="h-10 rounded border border-paper/20 bg-[#26346B]"></div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm">Indigo</span>
                <span className="font-tabular text-xs font-bold text-paper">#26346B</span>
              </div>
              <p className="text-xs text-paper/80 font-body">
                Reserved strictly for clinician channel (/clinic) and audio note reviews.
              </p>
              <div className="text-xs font-tabular font-bold text-clay-light pt-1 border-t border-paper/10">
                Contrast vs Paper: 10.1:1 (AAA)
              </div>
            </div>

            {/* Rules Summary Card */}
            <div className="p-4 rounded-md border border-ink/20 bg-paper-card space-y-2 text-xs font-body shadow-2xs">
              <div className="font-heading font-bold text-sm text-ink">
                Contrast Rules Summary
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-forest font-semibold">
                  <span>Success State:</span>
                  <span>#1E4D3B (7.9:1)</span>
                </div>
                <div className="flex justify-between text-ochre-dark font-semibold">
                  <span>Warning State:</span>
                  <span>#8C5E09 (4.9:1)</span>
                </div>
                <div className="flex justify-between text-terracotta-body font-semibold">
                  <span>Danger State:</span>
                  <span>#9F3E1A (5.6:1)</span>
                </div>
                <div className="flex justify-between text-indigo font-semibold">
                  <span>Clinical State:</span>
                  <span>#26346B (10.1:1)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Typography Specimen */}
        <section id="typography" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              2. Typography: Bricolage Grotesque &amp; Figtree
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Display Swap • Latin Subset • Min 16px Mobile Body
            </span>
          </div>

          <div className="bg-paper-card border border-ink/15 rounded-md p-5 sm:p-6 space-y-5">
            <div className="border-b border-ink/10 pb-4">
              <div className="flex items-center justify-between text-xs font-tabular text-ink-muted mb-1">
                <span>Display • Bricolage Grotesque 34px / 1.15 / -0.025em</span>
                <span>font-heading text-3xl sm:text-4xl</span>
              </div>
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
                Kitabu: Afya ya Mama na Mtoto
              </div>
            </div>

            <div className="border-b border-ink/10 pb-4">
              <div className="flex items-center justify-between text-xs font-tabular text-ink-muted mb-1">
                <span>Title 1 • Bricolage Grotesque 28px / 1.2 / -0.02em</span>
                <span>font-heading text-2xl sm:text-3xl</span>
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Antenatal Check-up &amp; Fetal Development
              </div>
            </div>

            <div className="border-b border-ink/10 pb-4">
              <div className="flex items-center justify-between text-xs font-tabular text-ink-muted mb-1">
                <span>Body (Base) • Figtree 16px / 1.55 • Strict 16px Mobile Minimum</span>
                <span>font-body text-base</span>
              </div>
              <p className="text-base text-ink font-body leading-relaxed max-w-2xl">
                Take one IFAS tablet daily after the evening meal with clean water. Avoid tea or milk within two hours of taking iron. If severe headache, facial swelling, or blurred vision occurs, visit your nearest dispensary immediately with your paper booklet.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-tabular text-ink-muted mb-1">
                <span>Tabular Numbers &amp; IDs • Figtree (tabular-nums / tnum 1)</span>
                <span>font-tabular text-xs sm:text-sm</span>
              </div>
              <div className="p-3 bg-paper rounded border border-ink/15 font-tabular text-xs sm:text-sm space-y-1">
                <div className="flex justify-between">
                  <span>ANC REGISTER ID:</span>
                  <span className="font-bold">MMHC-ANC-2026-0814</span>
                </div>
                <div className="flex justify-between">
                  <span>HEMOGLOBIN (Hb):</span>
                  <span className="font-bold">11.4 g/dL [Normal: 11.0–14.5]</span>
                </div>
                <div className="flex justify-between">
                  <span>BLOOD PRESSURE:</span>
                  <span className="font-bold">115 / 75 mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span>EDD DATE:</span>
                  <span className="font-bold">2026-12-31</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Inked Facility Stamps (Asymmetrical Workshop Layout) */}
        <section id="stamps" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              3. Hand-Inked Facility Stamps
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              SVG feTurbulence bled borders • Faded corner • Crisp text layer
            </span>
          </div>

          <div className="bg-paper-card border border-ink/15 rounded-md p-5 sm:p-6 space-y-6">
            <p className="text-xs sm:text-sm text-ink-muted font-body max-w-3xl">
              Stamps reflect physical confirmation by health centers. Inked textures and displacement filters apply exclusively to the outer borders and background wash—stamp lettering remains crisp down to 360px viewports. REF lines meet AA contrast at $\ge 12$px.
            </p>

            {/* Asymmetrical Workshop Display (Varied sizes and placements) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Primary Facility Stamp (Large, Intake Encounter) */}
              <div className="p-4 rounded bg-paper border border-ink/15 flex flex-col items-center text-center space-y-2">
                <span className="text-[11px] font-heading font-bold text-ink-muted uppercase">
                  Primary Clinic Confirmation (Large)
                </span>
                <FacilityStamp
                  facilityName="Mto Mukuu Health Centre"
                  date="30 SEP 2026"
                  stampNumber="MMHC-405-992"
                  variant="terracotta"
                  size="lg"
                  rotation={-2.4}
                  swLabel={locale === "sw"}
                />
              </div>

              {/* Faint Double-Strike Stamp (Medium, Lab Specimen) */}
              <div className="p-4 rounded bg-paper border border-ink/15 flex flex-col items-center text-center space-y-2">
                <span className="text-[11px] font-heading font-bold text-ink-muted uppercase">
                  Lab Entry with Faint Double-Strike (Medium)
                </span>
                <FacilityStamp
                  facilityName="Eastgate Mission Hospital"
                  date="25 AUG 2026"
                  stampNumber="EMH-LAB-109"
                  variant="forest"
                  size="md"
                  rotation={1.6}
                  doubleStrike={true}
                />
              </div>

              {/* Kiswahili Referral Stamp (Small, Compact Badge) */}
              <div className="p-4 rounded bg-paper border border-ink/15 flex flex-col items-center text-center space-y-2">
                <span className="text-[11px] font-heading font-bold text-ink-muted uppercase">
                  Kiswahili Confirmation Stamp (Small)
                </span>
                <FacilityStamp
                  facilityName="Lakeview County Referral Hospital"
                  date="14 JUL 2026"
                  stampNumber="LCRH-ANC-412"
                  variant="indigo"
                  size="sm"
                  rotation={3.1}
                  swLabel={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Winding ANC Journey Path */}
        <section id="journey" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              4. Antenatal Care Journey Path (8 Contacts)
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Touch targets ≥ 48px • Mobile 360px verified
            </span>
          </div>

          <JourneyPath encounters={encounters} currentWeek={28} />
        </section>

        {/* Section 6: Clinic Registers & Ledgers */}
        <section id="ledgers" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              5. Registers &amp; Hairline Ledgers
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              0.5px hairline rules • Tabular numeric figures
            </span>
          </div>

          <LedgerTable<Observation>
            title="Antenatal Diagnostic &amp; Vital Observations"
            subtitle="Laboratory investigations and clinical check-ups"
            registerCode="CLINIC REGISTER • PART 3"
            columns={observationColumns}
            data={observations || []}
          />

          <div className="mt-6">
            <LedgerTable<MedicationStatement>
              title="Prescribed &amp; Supplementary Medications"
              subtitle="Routine maternal supplementation and OTC self-reported therapies"
              registerCode="CLINIC REGISTER • PART 5"
              columns={medicationColumns}
              data={medications || []}
            />
          </div>
        </section>

        {/* Section 7: Perforated Result Card & Critical Offline Card (Side-by-Side Varied Scale) */}
        <section id="perforated" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              6. Lab Slip &amp; Critical Emergency Card
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Scalloped thermal edge • High-impact blood group
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Perforated Lab Card */}
            <div>
              <span className="text-xs font-heading font-bold text-ink-muted uppercase block mb-2">
                Photographed Thermal Lab Slip
              </span>
              <PerforatedCard
                title="Full Hemogram &amp; Platelets"
                testDate="25 AUG 2026"
                facilityName="Eastgate Mission Hospital Lab"
                bookletPage={7}
                resultsSummary={[
                  { label: "Hemoglobin (Hb)", value: "11.4", unit: "g/dL", normal: true },
                  { label: "Hematocrit (HCT)", value: "34.8", unit: "%", normal: true },
                  { label: "Platelets", value: "240,000", unit: "/µL", normal: true },
                  { label: "White Blood Cells", value: "7.2", unit: "x10³/µL", normal: true },
                ]}
                stampDate="25 AUG 2026"
                stampNumber="LAB-8819"
                onViewImage={() => setIsModalOpen(true)}
              />
            </div>

            {/* Offline Emergency Card */}
            <div id="emergency">
              <span className="text-xs font-heading font-bold text-ink-muted uppercase block mb-2">
                Critical Emergency Card (Always Cached Offline)
              </span>
              {patient && <OfflineEmergencyCard patient={patient} />}
            </div>
          </div>
        </section>

        {/* Section 8: Growth Curve */}
        <section id="growth" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              7. Hand-Built SVG Growth Curve
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Symphysis-Fundal Height (10th–90th percentiles)
            </span>
          </div>

          <FundalGrowthChart currentWeek={28} />
        </section>

        {/* Section 9: Custom SVG Icon Set */}
        <section id="icons" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              8. Custom SVG Icon Set
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              1.75px uniform stroke • Rounded terminals • No emojis
            </span>
          </div>

          <div className="bg-paper-card border border-ink/15 rounded-md p-5 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {[
                { name: "Booklet", icon: <BookletIcon size={24} /> },
                { name: "Facility Stamp", icon: <FacilityStampIcon size={24} /> },
                { name: "Journey Path", icon: <JourneyPathIcon size={24} /> },
                { name: "Stethoscope", icon: <StethoscopeIcon size={24} /> },
                { name: "Blood Drop / Hb", icon: <DropBloodIcon size={24} /> },
                { name: "Pill / IFAS", icon: <PillJarIcon size={24} /> },
                { name: "Consent Shield", icon: <ShieldCheckIcon size={24} /> },
                { name: "Camera Slip", icon: <CameraSlipIcon size={24} /> },
                { name: "Voice Note", icon: <VoiceMicrophoneIcon size={24} /> },
                { name: "Sync Done", icon: <SyncCheckIcon size={24} /> },
                { name: "Sync Pending", icon: <SyncPendingIcon size={24} /> },
                { name: "Offline Cloud", icon: <CloudOfflineIcon size={24} /> },
                { name: "Fetal Heartbeat", icon: <HeartRateIcon size={24} /> },
                { name: "Danger Signs", icon: <AlertTriangleIcon size={24} /> },
                { name: "Mother & Baby", icon: <UserHeartIcon size={24} /> },
                { name: "Booklet Tag", icon: <BookletTagIcon size={24} /> },
                { name: "Emergency Phone", icon: <PhoneIcon size={24} /> },
                { name: "Appointment", icon: <CalendarIcon size={24} /> },
                { name: "Inspect / View", icon: <EyeIcon size={24} /> },
                { name: "Checkmark", icon: <CheckIcon size={24} /> },
                { name: "Chevron", icon: <ChevronRightIcon size={24} /> },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-3 rounded bg-paper border border-ink/10 text-center gap-1.5 hover:border-forest transition-colors"
                >
                  <div className="text-forest">{item.icon}</div>
                  <span className="text-xs font-heading font-semibold text-ink leading-tight">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 10: Accessible Radix UI Primitives */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              9. Accessible Radix UI Primitives
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Zero component-kit bloat • Styled via design tokens
            </span>
          </div>

          <div className="bg-paper-card border border-ink/15 rounded-md p-5 sm:p-6 space-y-6">
            {/* Tabs */}
            <div>
              <span className="text-xs font-heading font-bold text-ink-muted uppercase block mb-1">
                Tab Panels
              </span>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="vitals">Vitals &amp; Labs</TabsTrigger>
                  <TabsTrigger value="sharing">Granular Consent</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="p-3.5 bg-paper rounded border border-ink/15 text-sm text-ink leading-relaxed font-body">
                    <strong>Patient Record Overview:</strong> Amina Wanjiku Muthoni, 28 weeks gestation, G2 P1, registered at Mto Mukuu Health Centre. Physical booklet KB-2026/092.
                  </div>
                </TabsContent>
                <TabsContent value="vitals">
                  <div className="p-3.5 bg-paper rounded border border-ink/15 text-sm text-ink leading-relaxed font-body">
                    <strong>Vital Signs Summary:</strong> Blood pressure 115/75 mmHg, Hemoglobin 11.4 g/dL, Fundal height 27 cm, Fetal heart rate 142 bpm.
                  </div>
                </TabsContent>
                <TabsContent value="sharing">
                  <div className="p-3.5 bg-paper rounded border border-ink/15 text-sm text-ink leading-relaxed font-body">
                    <strong>Provider Permissions:</strong> Mto Mukuu Health Centre granted full record access. Eastgate Mission Hospital granted lab-only access.
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Accordion */}
            <div className="border-t border-ink/15 pt-5">
              <span className="text-xs font-heading font-bold text-ink-muted uppercase block mb-1">
                Accordion (Maternal Guidance)
              </span>
              <Accordion type="single" collapsible defaultValue="danger-signs">
                <AccordionItem value="danger-signs">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2 text-terracotta-body">
                      <AlertTriangleIcon size={18} className="stroke-[2.5]" />
                      <span>Critical Maternal Danger Signs (Dalili za Hatari)</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1.5 font-body">
                      <p className="text-ink">
                        Seek emergency hospital care immediately if you notice any of these signs:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-ink">
                        <li>Vaginal bleeding, even light spotting.</li>
                        <li>Severe headache or blurred vision (signs of high blood pressure).</li>
                        <li>Swelling of hands, face, or sudden excessive leg swelling.</li>
                        <li>Reduced or absent baby movements after 28 weeks.</li>
                        <li>High fever, severe chills, or foul-smelling discharge.</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Switches */}
            <div className="border-t border-ink/15 pt-5">
              <span className="text-xs font-heading font-bold text-ink-muted uppercase block mb-1">
                Consent Switches
              </span>
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center justify-between p-3 bg-paper rounded border border-ink/15">
                  <div>
                    <div className="font-heading font-bold text-sm text-ink">
                      Mto Mukuu Health Centre Access
                    </div>
                    <p className="text-xs text-ink-muted font-body">
                      Full view of encounters, ultrasound scans, and clinician notes.
                    </p>
                  </div>
                  <Switch
                    checked={facilityConsent}
                    onCheckedChange={setFacilityConsent}
                    aria-label="Mto Mukuu access switch"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-paper rounded border border-ink/15">
                  <div>
                    <div className="font-heading font-bold text-sm text-ink">
                      De-identified Research Contribution
                    </div>
                    <p className="text-xs text-ink-muted font-body">
                      Contribute anonymized statistics without revealing your personal identity.
                    </p>
                  </div>
                  <Switch
                    checked={researchConsent}
                    onCheckedChange={setResearchConsent}
                    aria-label="De-identified research switch"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Dialog for Specimen Inspection */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-terracotta-body uppercase">
                <CameraSlipIcon size={16} />
                <span>Photographed Lab Receipt Slip</span>
              </div>
              <DialogTitle className="mt-1">
                Full Hemogram • Eastgate Mission Hospital
              </DialogTitle>
              <DialogDescription>
                Specimen drawn on 25 August 2026. Cross-referenced with page 7 of physical booklet.
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-paper-light border border-ink/20 rounded font-tabular text-xs space-y-2">
              <div className="text-center font-heading font-bold pb-2 border-b border-dashed border-ink/20">
                EASTGATE MISSION HOSPITAL LABORATORY
              </div>
              <div className="flex justify-between">
                <span>PATIENT:</span>
                <span className="font-bold">Amina W. Muthoni</span>
              </div>
              <div className="flex justify-between">
                <span>CLINIC ID:</span>
                <span>MMHC-ANC-2026-0814</span>
              </div>
              <div className="flex justify-between font-bold text-forest text-sm pt-2 border-t border-ink/10">
                <span>HEMOGLOBIN (Hb):</span>
                <span>11.4 g/dL [Normal]</span>
              </div>
              <div className="flex justify-between">
                <span>PLATELETS:</span>
                <span>240,000 /µL</span>
              </div>
              <div className="flex justify-between">
                <span>WBC:</span>
                <span>7.2 x10³/µL</span>
              </div>
              <div className="pt-2 text-center text-xs text-ink-muted font-heading font-bold">
                CONFIRMED • REF: EMH-LAB-109
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <DialogClose asChild>
                <button
                  type="button"
                  className="touch-target px-4 py-2 rounded bg-paper-dark border border-ink/20 text-xs font-heading font-bold text-ink hover:bg-paper"
                >
                  Close
                </button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/15 bg-paper-card py-8 mt-12 text-center text-xs text-ink-muted font-tabular">
        <div className="max-w-6xl mx-auto px-4 space-y-1.5">
          <p className="font-heading font-bold text-sm text-ink">
            Kitabu — Maternal &amp; Child Health Digital Companion
          </p>
          <p className="font-body text-xs">
            &ldquo;Your digital copy, alongside your clinic booklet.&rdquo; • Demo data
          </p>
        </div>
      </footer>
    </div>
  );
}
