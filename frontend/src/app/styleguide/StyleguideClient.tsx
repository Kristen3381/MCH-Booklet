"use client";

import React, { useState } from "react";
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
import { PerforatedCard } from "@/components/PerforatedCard";
import { TextileBorder } from "@/components/TextileBorder";
import { BookletMatchTag } from "@/components/BookletMatchTag";
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
  HeartRateIcon,
  AlertTriangleIcon,
  UserHeartIcon,
  BookletTagIcon,
  PhoneIcon,
  CalendarIcon,
  EyeIcon,
  CheckIcon,
  ChevronRightIcon,
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
  const isSw = locale === "sw";

  const { data: patient } = usePatient();
  const { data: encounters } = useEncounters();
  const { data: observations } = useObservations();
  const { data: medications } = useMedications();
  const sync = useSyncStatus();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [researchConsent, setResearchConsent] = useState<boolean>(true);
  const [facilityConsent, setFacilityConsent] = useState<boolean>(true);

  // Observation ledger columns (Single language driven by locale)
  const observationColumns: LedgerColumn<Observation>[] = [
    {
      header: isSw ? "Kipimo cha Kliniki" : "Clinical Investigation",
      className: "w-2/5",
      cell: (obs) => (
        <div>
          <div className="font-heading font-bold text-ink text-sm sm:text-base">
            {obs.code.display}
          </div>
          <div className="text-xs font-tabular text-ink-muted">
            {isSw ? "Msimbo:" : "Code:"} {obs.code.code}
          </div>
        </div>
      ),
    },
    {
      header: isSw ? "Matokeo" : "Result",
      className: "font-tabular font-bold text-ink w-1/5",
      cell: (obs) => (
        <span className="text-sm font-semibold font-tabular">
          {obs.valueQuantity
            ? `${obs.valueQuantity.value} ${obs.valueQuantity.unit}`
            : obs.valueString}
        </span>
      ),
    },
    {
      header: isSw ? "Kiwango cha Kawaida" : "Reference Range",
      className: "text-xs font-body text-ink-muted w-1/5 font-tabular",
      cell: (obs) => obs.referenceRange?.text || (isSw ? "Kawaida" : "Standard"),
    },
    {
      header: isSw ? "Kijitabu cha Karatasi" : "Paper Booklet",
      className: "w-1/5 text-right",
      cell: (obs) =>
        obs.bookletPage ? (
          <BookletMatchTag pageNumber={obs.bookletPage} size="sm" />
        ) : null,
    },
  ];

  // Medication ledger columns (Single language driven by locale)
  const medicationColumns: LedgerColumn<MedicationStatement>[] = [
    {
      header: isSw ? "Dawa ya Kliniki" : "Prescribed Medication",
      className: "w-2/5",
      cell: (med) => (
        <div>
          <div className="font-heading font-bold text-ink text-sm sm:text-base">
            {med.medicationCodeableConcept.display}
          </div>
          <span className="text-xs font-heading font-semibold px-2 py-0.5 rounded bg-clay/50 text-ink">
            {med.isOtc
              ? (isSw ? "Dawa ya Kujinunulia (OTC)" : "OTC Self-Reported")
              : (isSw ? "Dawa ya Kituoni" : "Clinic Supply")}
          </span>
        </div>
      ),
    },
    {
      header: isSw ? "Kipimo na Maelekezo" : "Dosage & Regimen",
      className: "text-xs font-body text-ink w-2/5 font-tabular",
      cell: (med) => (
        <div>
          <div className="font-body text-xs sm:text-sm font-tabular">{med.dosage.text}</div>
          <div className="text-xs font-tabular text-ink-muted">
            {med.dosage.timing}
          </div>
        </div>
      ),
    },
    {
      header: isSw ? "Hali na Kijitabu" : "Status & Booklet",
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
            {med.status === "active"
              ? (isSw ? "Inatumika" : "Active")
              : (isSw ? "Imekamilika" : "Completed")}
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
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-forest text-paper flex items-center justify-center font-heading font-black text-sm">
              K
            </div>
            <div>
              <span className="font-heading font-bold text-base text-ink tracking-tight block leading-tight">
                Kitabu
              </span>
              <span className="text-[11px] font-body text-ink-muted hidden sm:block leading-none">
                {isSw ? "Mwongozo wa Muundo wa Mfumo" : "Living Design System"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SyncStatusIndicator
              state={sync.state}
              pendingCount={sync.pendingCount}
              compact
            />
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Editorial Hero Header (Card Layout) */}
        <section className="bg-paper-card border border-ink/20 rounded-lg p-5 sm:p-8 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-terracotta-light text-terracotta-body border border-terracotta-border/30 text-[11px] font-heading font-extrabold uppercase tracking-wide">
                  {isSw ? "Maelezo ya Muundo wa Mfumo" : "Design System Specification"}
                </span>
                <span className="text-xs font-tabular text-ink-muted">
                  {isSw ? "Data ya majaribio" : "Demo data"}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-ink leading-tight tracking-tight">
                {isSw ? "Mwenzi wa Kidijitali wa Kijitabu" : "The Booklet's Digital Companion"}
              </h1>

              <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-body">
                {isSw ? (
                  <>
                    Kitabu ni pochi ya kidijitali ya afya inayomilikiwa na mama kwa ajili ya afya ya uzazi na mtoto nchini Kenya.
                    Kina <strong>ongezea</strong> kijitabu halisi cha kliniki—hakibadilishi karatasi.
                    Kila alama, mstari, na muhuri umerekebishwa kwa ajili ya simu za kawaida za Android, vitufe vinavyofikika kwa urahisi vya angalau 48px,
                    na utendaji thabiti hata bila mtandao wa simu.
                  </>
                ) : (
                  <>
                    Kitabu is a patient-owned digital health wallet for Kenyan maternal and child health.
                    It <strong>supplements</strong> the physical clinic booklet—it never replaces it.
                    Every token, row, and stamp is tuned for low-end Android displays, touch targets of at least 48px,
                    and offline resilience.
                  </>
                )}
              </p>
            </div>

            {/* Plain Usage Rules Card */}
            <div className="p-4 rounded-md bg-paper border border-ink/15 max-w-sm space-y-1.5 shrink-0 text-xs font-body">
              <div className="font-heading font-bold text-sm text-forest uppercase tracking-wide">
                {isSw ? "Mwongozo: Kijitabu cha Karatasi" : "Usage Rule: Companion Tenet"}
              </div>
              <p className="text-ink text-xs leading-relaxed">
                {isSw
                  ? "Kila mara mweleze mama kubeba kijitabu chake cha karatasi anapokwenda kliniki. Pochi hii ya kidijitali inasafiri na mgonjwa wakati faili ya karatasi imebaki nyumbani."
                  : "Always instruct the patient to carry their physical paper booklet to clinic appointments. This digital wallet travels with the patient when the paper file remains at home."}
              </p>
              <div className="text-[11px] font-heading font-bold text-terracotta-body pt-1 border-t border-ink/10">
                {isSw
                  ? "Kanusho: Kamwe usitumie maneno kama 'bila karatasi' au 'inachukua nafasi ya karatasi'."
                  : "Rule: Never use copy like “paperless” or “replaces paper”."}
              </div>
            </div>
          </div>

          {/* Prominent Signature Divider */}
          <TextileBorder variant="primary" size="lg" className="my-6" />

          {/* Anchor Navigation */}
          <div className="flex flex-wrap gap-2 text-xs font-heading font-bold text-ink-muted">
            <a href="#palette" className="hover:text-forest underline">
              {isSw ? "1. Rangi" : "1. Palette & Contrast"}
            </a>
            <span className="text-ink/30">•</span>
            <a href="#typography" className="hover:text-forest underline">
              {isSw ? "2. Maandishi" : "2. Typography"}
            </a>
            <span className="text-ink/30">•</span>
            <a href="#stamps" className="hover:text-forest underline">
              {isSw ? "3. Mihuri" : "3. Inked Stamps"}
            </a>
            <span className="text-ink/30">•</span>
            <a href="#journey" className="hover:text-forest underline">
              {isSw ? "4. Safari ya ANC" : "4. ANC Journey"}
            </a>
            <span className="text-ink/30">•</span>
            <a href="#ledgers" className="hover:text-forest underline">
              {isSw ? "5. Madaftari" : "5. Registers & Ledgers"}
            </a>
            <span className="text-ink/30">•</span>
            <a href="#perforated" className="hover:text-forest underline">
              {isSw ? "6. Maabara" : "6. Lab Slip"}
            </a>
            <span className="text-ink/30">•</span>
            <a href="#emergency" className="hover:text-forest underline">
              {isSw ? "7. Kadi ya Dharura" : "7. Emergency Card"}
            </a>
            <span className="text-ink/30">•</span>
            <a href="#growth" className="hover:text-forest underline">
              {isSw ? "8. Grafu" : "8. Growth Curve"}
            </a>
            <span className="text-ink/30">•</span>
            <a href="#icons" className="hover:text-forest underline">
              {isSw ? "9. Alama (Icons)" : "9. SVG Icons"}
            </a>
          </div>
        </section>

        {/* Section 1: Palette & Accessibility Contrast Science */}
        <section id="palette" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              {isSw ? "1. Rangi na Sheria za Utofautishaji" : "1. Palette Tokens & Contrast Rules"}
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              WCAG 2.1 AA (≥ 4.5:1 body, ≥ 3.0:1 large/stamps)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Paper */}
            <div className="p-4 rounded-md border border-ink/20 bg-[#F6EFE3] text-[#1F2A24] space-y-2 shadow-2xs">
              <div className="h-10 rounded border border-ink/15 bg-[#F6EFE3]"></div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm">Paper</span>
                <span className="font-tabular text-xs font-bold">#F6EFE3</span>
              </div>
              <p className="text-xs text-ink-muted font-body">
                Primary canvas, warm physical booklet background.
              </p>
              <div className="text-xs font-tabular font-bold text-ink-muted pt-1 border-t border-ink/15">
                Base Surface
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
                Primary high-contrast typography, rules, and registers.
              </p>
              <div className="text-xs font-tabular font-bold text-clay-light pt-1 border-t border-paper/10">
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
                <div className="flex justify-between text-ink-muted">
                  <span>Hairline Rules:</span>
                  <span>rgba(31, 42, 36, 0.20)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Typography (Unboxed, sitting directly on paper) */}
        <section id="typography" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              {isSw ? "2. Mfumo wa Maandishi" : "2. Typography System"}
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Display Swap • Latin Subset • Min 16px Mobile Body
            </span>
          </div>

          <div className="py-2 space-y-6">
            <div className="border-b border-ink/15 pb-4">
              <div className="flex items-center justify-between text-xs font-tabular text-ink-muted mb-1">
                <span>Display • Bricolage Grotesque 34px / 1.15 / -0.025em</span>
                <span>font-heading text-3xl sm:text-4xl</span>
              </div>
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
                {isSw ? "Kitabu: Afya ya Mama na Mtoto" : "Kitabu: Maternal & Child Health"}
              </div>
            </div>

            <div className="border-b border-ink/15 pb-4">
              <div className="flex items-center justify-between text-xs font-tabular text-ink-muted mb-1">
                <span>Title 1 • Bricolage Grotesque 28px / 1.2 / -0.02em</span>
                <span>font-heading text-2xl sm:text-3xl</span>
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                {isSw
                  ? "Uchunguzi wa Kliniki na Makuzi ya Mtoto"
                  : "Antenatal Check-up & Fetal Development"}
              </div>
            </div>

            <div className="border-b border-ink/15 pb-4">
              <div className="flex items-center justify-between text-xs font-tabular text-ink-muted mb-1">
                <span>Body (Base) • Figtree 16px / 1.55 • Strict 16px Mobile Minimum</span>
                <span>font-body text-base</span>
              </div>
              <p className="text-base text-ink font-body leading-relaxed max-w-2xl">
                {isSw
                  ? "Meza kidonge kimoja cha IFAS kila siku baada ya chakula cha jioni na maji safi. Epuka kunywa chai au maziwa ndani ya saa mbili baada ya kumeza madini ya chuma. Ukipata maumivu makali ya kichwa, uvimbe wa uso, au kutoona vizuri, fika hospitalini au dispensary mara moja ukiwa na kijitabu chako cha karatasi."
                  : "Take one IFAS tablet daily after the evening meal with clean water. Avoid tea or milk within two hours of taking iron. If severe headache, facial swelling, or blurred vision occurs, visit your nearest dispensary immediately with your paper booklet."}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-tabular text-ink-muted mb-1">
                <span>Tabular Numbers &amp; IDs • Figtree (tabular-nums / tnum 1)</span>
                <span>font-tabular text-xs sm:text-sm</span>
              </div>
              <div className="p-3.5 bg-paper-dark/30 rounded border border-ink/15 font-tabular text-xs sm:text-sm space-y-1.5 max-w-xl">
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

        {/* Section 3: Inked Facility Stamps (Unboxed, with in-use register row overlap vignette) */}
        <section id="stamps" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              {isSw ? "3. Mihuri ya Kituo cha Afya" : "3. Hand-Inked Facility Stamps"}
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              SVG feTurbulence bled borders • Faded corner • Crisp text layer
            </span>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted font-body max-w-3xl">
            {isSw
              ? "Mihuri huakisi uthibitisho halisi kutoka kituo cha afya. Mchoro wa wino huwekwa pembezoni pekee ili maandishi yawe wazi kabisa kwenye simu za 360px. REF line inazingatia utofautishaji wa AA kwa angalau 12px."
              : "Stamps reflect physical confirmation by health centers. Inked textures and displacement filters apply exclusively to the outer borders and background wash—stamp lettering remains crisp down to 360px viewports. REF lines meet AA contrast at at least 12px."}
          </p>

          {/* REALISTIC IN-USE OVERLAPPING VIGNETTE: Stamp overlapping clinic register row */}
          <div className="py-2">
            <div className="text-xs font-heading font-bold text-ink-muted uppercase mb-2">
              {isSw
                ? "Muonekano Halisi: Muhuri Ukigongwa Juu ya Daftari la Kliniki"
                : "Real-Use Vignette: Inked Stamp Overlapping Clinic Register Entry"}
            </div>

            <div className="relative border-t-2 border-b-2 border-ink/40 py-4 px-4 bg-paper-dark/20 overflow-visible rounded-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 max-w-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-tabular uppercase text-ink-muted tracking-wider font-semibold">
                      {isSw ? "Daftari la Maabara · Ukurasa wa 7" : "Laboratory Register · Page 7"}
                    </span>
                    <BookletMatchTag pageNumber={7} size="sm" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-ink">
                    {isSw ? "Kipimo cha Damu (Hemoglobin Hb)" : "Full Hemogram & Hemoglobin (Hb)"}
                  </h4>
                  <div className="text-xs font-tabular text-ink space-x-2">
                    <span>Result: <strong>11.4 g/dL</strong></span>
                    <span>•</span>
                    <span className="text-forest font-semibold">Normal Range (11.0–14.5)</span>
                    <span>•</span>
                    <span className="text-ink-muted">Specimen: Venous</span>
                  </div>
                </div>
              </div>

              {/* Overlapping Facility Confirmation Stamp as in real clinic use */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-top-5 sm:right-6 z-20 pointer-events-auto">
                <FacilityStamp
                  facilityName="Mto Mukuu Health Centre"
                  date="30 SEP 2026"
                  stampNumber="MMHC-405-992"
                  variant="terracotta"
                  size="md"
                  rotation={-2.8}
                  swLabel={isSw}
                />
              </div>
            </div>
          </div>

          {/* Additional Stamp Variants Placed Freely on Paper Background (Unboxed) */}
          <div className="flex flex-wrap items-center justify-around gap-8 pt-4 pb-2 border-t border-ink/15">
            <div className="flex flex-col items-center text-center space-y-2">
              <FacilityStamp
                facilityName="Eastgate Mission Hospital Lab"
                date="25 AUG 2026"
                stampNumber="EMH-LAB-109"
                variant="forest"
                size="md"
                rotation={1.8}
                doubleStrike={true}
              />
              <span className="text-[11px] font-tabular text-ink-muted">
                {isSw
                  ? "Muhuri wa Kijani (Forest) na Mgongano Mara Mbili"
                  : "Forest Inked Stamp with Faint Double-Strike"}
              </span>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <FacilityStamp
                facilityName="Lakeview County Referral Hospital"
                date="14 JUL 2026"
                stampNumber="LCRH-ANC-412"
                variant="indigo"
                size="sm"
                rotation={3.1}
                swLabel={true}
              />
              <span className="text-[11px] font-tabular text-ink-muted">
                {isSw
                  ? "Muhuri wa Rufaa wa Hospitali ya Kaunti (Indigo)"
                  : "County Referral Stamp (Indigo / sw)"}
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Winding ANC Journey Path (Unboxed, sitting directly on paper) */}
        <section id="journey" className="space-y-4 scroll-mt-20">
          <JourneyPath encounters={encounters} currentWeek={28} />
        </section>

        {/* Section 5: Clinic Registers & Ledgers (Unboxed, sitting directly on paper) */}
        <section id="ledgers" className="space-y-8 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              {isSw ? "5. Madaftari ya Kliniki na Mistari Hairline" : "5. Registers & Hairline Ledgers"}
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Hairline rules • Tabular numeric figures
            </span>
          </div>

          <LedgerTable<Observation>
            title={isSw ? "Daftari la Vipimo vya Ujauzito na Maabara" : "Antenatal Diagnostic & Vital Observations"}
            subtitle={isSw ? "Uchunguzi wa maabara na vipimo vya mara kwa mara" : "Laboratory investigations and clinical check-ups"}
            registerCode={isSw ? "DAFTARI LA KLINIKI • SEHEMU YA 3" : "CLINIC REGISTER • PART 3"}
            columns={observationColumns}
            data={observations || []}
          />

          <LedgerTable<MedicationStatement>
            title={isSw ? "Dawa na Virutubisho Vilivyopeanwa" : "Prescribed & Supplementary Medications"}
            subtitle={isSw ? "Virutubisho vya kawaida na dawa za kujinunulia zilizoripotiwa" : "Routine maternal supplementation and OTC self-reported therapies"}
            registerCode={isSw ? "DAFTARI LA KLINIKI • SEHEMU YA 5" : "CLINIC REGISTER • PART 5"}
            columns={medicationColumns}
            data={medications || []}
          />
        </section>

        {/* Section 6: Perforated Result Card & Critical Offline Card */}
        <section id="perforated" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              {isSw ? "6. Karatasi ya Maabara na Kadi ya Dharura" : "6. Lab Slip & Critical Emergency Card"}
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Scalloped thermal edge • High-impact blood group
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Perforated Lab Card */}
            <div>
              <span className="text-xs font-heading font-bold text-ink-muted uppercase block mb-2">
                {isSw ? "Karatasi ya Risiti ya Maabara Iliyopigwa Picha" : "Photographed Thermal Lab Slip"}
              </span>
              <PerforatedCard
                title={isSw ? "Kipimo cha Damu Kamili (Hemogram)" : "Full Hemogram & Platelets"}
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
                {isSw ? "Kadi Muhimu ya Dharura (Imehifadhiwa Bila Mtandao)" : "Critical Emergency Card (Always Cached Offline)"}
              </span>
              {patient && <OfflineEmergencyCard patient={patient} />}
            </div>
          </div>
        </section>

        {/* Section 7: Growth Curve */}
        <section id="growth" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              {isSw ? "7. Grafu ya Makuzi ya Mtoto (SFH)" : "7. Hand-Built SVG Growth Curve"}
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Symphysis-Fundal Height (10th–90th percentiles)
            </span>
          </div>

          <FundalGrowthChart currentWeek={28} />
        </section>

        {/* Section 8: Custom SVG Icon Set (Unboxed, sitting directly on paper) */}
        <section id="icons" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              {isSw ? "8. Picha za Alama za SVG (Icons)" : "8. Custom SVG Icon Set"}
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              1.75px uniform stroke • Rounded terminals • No emojis
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 py-2">
            {[
              { name: isSw ? "Kijitabu" : "Booklet", icon: <BookletIcon size={24} /> },
              { name: isSw ? "Muhuri wa Kituo" : "Facility Stamp", icon: <FacilityStampIcon size={24} /> },
              { name: isSw ? "Njia ya Kliniki" : "Journey Path", icon: <JourneyPathIcon size={24} /> },
              { name: isSw ? "Stetoskopu" : "Stethoscope", icon: <StethoscopeIcon size={24} /> },
              { name: isSw ? "Tone la Damu" : "Blood Drop", icon: <DropBloodIcon size={24} /> },
              { name: isSw ? "Dawa ya IFAS" : "IFAS Medication", icon: <PillJarIcon size={24} /> },
              { name: isSw ? "Ngao ya Idhini" : "Consent Shield", icon: <ShieldCheckIcon size={24} /> },
              { name: isSw ? "Picha ya Risiti" : "Camera Slip", icon: <CameraSlipIcon size={24} /> },
              { name: isSw ? "Sauti ya Daktari" : "Voice Note", icon: <VoiceMicrophoneIcon size={24} /> },
              { name: isSw ? "Imesasishwa" : "Sync Done", icon: <SyncCheckIcon size={24} /> },
              { name: isSw ? "Inasubiri Mtandao" : "Sync Pending", icon: <SyncPendingIcon size={24} /> },
              { name: isSw ? "Bila Mtandao" : "Offline Cloud", icon: <CloudOfflineIcon size={24} /> },
              { name: isSw ? "Mapigo ya Moyo" : "Fetal Heartbeat", icon: <HeartRateIcon size={24} /> },
              { name: isSw ? "Dalili za Hatari" : "Danger Signs", icon: <AlertTriangleIcon size={24} /> },
              { name: isSw ? "Mama na Mtoto" : "Mother & Baby", icon: <UserHeartIcon size={24} /> },
              { name: isSw ? "Lebo ya Kijitabu" : "Booklet Tag", icon: <BookletTagIcon size={24} /> },
              { name: isSw ? "Simu ya Dharura" : "Emergency Phone", icon: <PhoneIcon size={24} /> },
              { name: isSw ? "Tarehe ya Kliniki" : "Appointment", icon: <CalendarIcon size={24} /> },
              { name: isSw ? "Kagua Rekodi" : "Inspect Record", icon: <EyeIcon size={24} /> },
              { name: isSw ? "Imethibitishwa" : "Checkmark", icon: <CheckIcon size={24} /> },
              { name: isSw ? "Mwelekeo" : "Chevron", icon: <ChevronRightIcon size={24} /> },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 rounded bg-paper-dark/20 border border-ink/10 text-center gap-1.5 hover:border-forest transition-colors"
              >
                <div className="text-forest">{item.icon}</div>
                <span className="text-xs font-heading font-semibold text-ink leading-tight">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9: Accessible Radix UI Primitives (Unboxed, sitting directly on paper) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-2.5 gap-1">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink">
              {isSw ? "9. Vitufe vya Radix UI Vinavyofikika" : "9. Accessible Radix UI Primitives"}
            </h2>
            <span className="text-xs font-tabular text-ink-muted">
              Zero component-kit bloat • Styled via design tokens
            </span>
          </div>

          <div className="py-2 space-y-6">
            {/* Tabs */}
            <div>
              <span className="text-xs font-heading font-bold text-ink-muted uppercase block mb-1">
                {isSw ? "Mbao za Vichupo (Tabs)" : "Tab Panels"}
              </span>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">{isSw ? "Muhtasari" : "Overview"}</TabsTrigger>
                  <TabsTrigger value="vitals">{isSw ? "Vipimo na Maabara" : "Vitals & Labs"}</TabsTrigger>
                  <TabsTrigger value="sharing">{isSw ? "Idhini ya Kushiriki" : "Granular Consent"}</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="p-3.5 bg-paper rounded border border-ink/15 text-sm text-ink leading-relaxed font-body">
                    <strong>{isSw ? "Muhtasari wa Rekodi ya Mgonjwa:" : "Patient Record Overview:"}</strong> Amina Wanjiku Muthoni, {isSw ? "ujauzito wiki 28, G2 P1, amesajiliwa Mto Mukuu Health Centre. Kijitabu cha karatasi KB-2026/092." : "28 weeks gestation, G2 P1, registered at Mto Mukuu Health Centre. Physical booklet KB-2026/092."}
                  </div>
                </TabsContent>
                <TabsContent value="vitals">
                  <div className="p-3.5 bg-paper rounded border border-ink/15 text-sm text-ink leading-relaxed font-body">
                    <strong>{isSw ? "Muhtasari wa Vipimo:" : "Vital Signs Summary:"}</strong> Blood pressure 115/75 mmHg, Hemoglobin 11.4 g/dL, Fundal height 27 cm, Fetal heart rate 142 bpm.
                  </div>
                </TabsContent>
                <TabsContent value="sharing">
                  <div className="p-3.5 bg-paper rounded border border-ink/15 text-sm text-ink leading-relaxed font-body">
                    <strong>{isSw ? "Idhini ya Vituo vya Afya:" : "Provider Permissions:"}</strong> {isSw ? "Mto Mukuu Health Centre imepewa idhini kamili ya rekodi. Eastgate Mission Hospital imepewa idhini ya maabara pekee." : "Mto Mukuu Health Centre granted full record access. Eastgate Mission Hospital granted lab-only access."}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Accordion (Single language, no mixed slash or parentheses) */}
            <div className="border-t border-ink/15 pt-5">
              <span className="text-xs font-heading font-bold text-ink-muted uppercase block mb-1">
                {isSw ? "Mwongozo wa Afya ya Mama" : "Maternal Guidance"}
              </span>
              <Accordion type="single" collapsible defaultValue="danger-signs">
                <AccordionItem value="danger-signs">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2 text-terracotta-body">
                      <AlertTriangleIcon size={18} className="stroke-[2.5]" />
                      <span>
                        {isSw
                          ? "Dalili Muhimu za Hatari Wakati wa Ujauzito"
                          : "Critical Maternal Danger Signs"}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1.5 font-body">
                      <p className="text-ink">
                        {isSw
                          ? "Fika hospitalini au kituo cha afya mara moja ukiona mojawapo ya dalili hizi:"
                          : "Seek emergency hospital care immediately if you notice any of these signs:"}
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-ink">
                        {isSw ? (
                          <>
                            <li>Kutoka damu ukeni, hata matone madogo.</li>
                            <li>Maumivu makali ya kichwa au kutoona vizuri (dalili ya shinikizo la damu).</li>
                            <li>Kuvimba uso, mikono, au miguu kwa ghafla.</li>
                            <li>Kupungua au kutohisi mtoto akicheza baada ya wiki 28.</li>
                            <li>Homa kali, kutetemeka, au uchafu wenye harufu mbaya.</li>
                          </>
                        ) : (
                          <>
                            <li>Vaginal bleeding, even light spotting.</li>
                            <li>Severe headache or blurred vision (signs of high blood pressure).</li>
                            <li>Swelling of hands, face, or sudden excessive leg swelling.</li>
                            <li>Reduced or absent baby movements after 28 weeks.</li>
                            <li>High fever, severe chills, or foul-smelling discharge.</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Switches */}
            <div className="border-t border-ink/15 pt-5">
              <span className="text-xs font-heading font-bold text-ink-muted uppercase block mb-1">
                {isSw ? "Idhini za Kushiriki Data" : "Consent Switches"}
              </span>
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center justify-between p-3 bg-paper rounded border border-ink/15">
                  <div>
                    <div className="font-heading font-bold text-sm text-ink">
                      {isSw ? "Ruhusa ya Mto Mukuu Health Centre" : "Mto Mukuu Health Centre Access"}
                    </div>
                    <p className="text-xs text-ink-muted font-body">
                      {isSw
                        ? "Kuruhusu kuona kliniki, picha za ultrasound, na maelezo ya daktari."
                        : "Full view of encounters, ultrasound scans, and clinician notes."}
                    </p>
                  </div>
                  <Switch
                    checked={facilityConsent}
                    onCheckedChange={setFacilityConsent}
                    aria-label={isSw ? "Ruhusa ya kituo cha Mto Mukuu" : "Mto Mukuu access switch"}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-paper rounded border border-ink/15">
                  <div>
                    <div className="font-heading font-bold text-sm text-ink">
                      {isSw ? "Mchango wa Utafiti Bila Majina" : "De-identified Research Contribution"}
                    </div>
                    <p className="text-xs text-ink-muted font-body">
                      {isSw
                        ? "Kuchangia takwimu bila kufichua jina au kitambulisho chako."
                        : "Contribute anonymized statistics without revealing your personal identity."}
                    </p>
                  </div>
                  <Switch
                    checked={researchConsent}
                    onCheckedChange={setResearchConsent}
                    aria-label={isSw ? "Ruhusa ya utafiti bila majina" : "De-identified research switch"}
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
                <span>{isSw ? "Risiti ya Maabara Iliyopigwa Picha" : "Photographed Lab Receipt Slip"}</span>
              </div>
              <DialogTitle className="mt-1">
                Full Hemogram • Eastgate Mission Hospital
              </DialogTitle>
              <DialogDescription>
                {isSw
                  ? "Kipimo kilichochukuliwa tarehe 25 Agosti 2026. Kimethibitishwa na ukurasa wa 7 wa kijitabu cha kliniki."
                  : "Specimen drawn on 25 August 2026. Cross-referenced with page 7 of physical booklet."}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-paper-light border border-ink/20 rounded font-tabular text-xs space-y-2">
              <div className="text-center font-heading font-bold pb-2 border-b border-dashed border-ink/20">
                EASTGATE MISSION HOSPITAL LABORATORY
              </div>
              <div className="flex justify-between">
                <span>{isSw ? "MGONJWA:" : "PATIENT:"}</span>
                <span className="font-bold">Amina W. Muthoni</span>
              </div>
              <div className="flex justify-between">
                <span>{isSw ? "NAMBARI YA KLINIKI:" : "CLINIC ID:"}</span>
                <span>MMHC-ANC-2026-0814</span>
              </div>
              <div className="flex justify-between font-bold text-forest text-sm pt-2 border-t border-ink/10">
                <span>HEMOGLOBIN (Hb):</span>
                <span>11.4 g/dL [{isSw ? "Kawaida" : "Normal"}]</span>
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
                  {isSw ? "Funga" : "Close"}
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
            {isSw
              ? "“Nakala yako ya kidijitali, sambamba na kijitabu chako cha kliniki.” • Data ya majaribio"
              : "“Your digital copy, alongside your clinic booklet.” • Demo data"}
          </p>
        </div>
      </footer>
    </div>
  );
}
