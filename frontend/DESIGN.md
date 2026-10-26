# Kitabu — Design System & Architecture Specification

> **"The booklet's digital companion."**
> Working Title: **Kitabu** (Swahili for *Booklet*)
> Scope: Patient-owned digital health wallet for Kenyan maternal and child health.

---

## 1. Core Philosophy: The Companion Tenet

Kitabu **supplements** the physical paper record (the clinic health booklet and facility files) — it does **not** replace it.

In Kenya’s public healthcare network, the paper booklet is a trusted clinical document and personal keepsake carried by mothers to every check-up. Kitabu functions as a portable, patient-controlled digital copy that travels with the mother when the physical booklet is stored safely at home or unavailable during travel.

### Copywriting & Tone Directives
- **Approved Language:** *"Your digital copy"*, *"Alongside your clinic booklet"*, *"Nakala yako ya kidijitali"*, *"Sambamba na kijitabu chako cha kliniki"*, *"Recorded in booklet p. 8"*, *"Facility Confirmed"*.
- **Strictly Prohibited:** Never use copy or visuals that state or imply *"replaces paper"*, *"paperless"*, or *"goodbye files"*.
- **Nurse-to-Mother Demeanour:** Plain, respectful, and direct. Avoid conversational AI filler or tech clichés (*"Welcome back!"*).
- **Non-Governmental Designation:** The app does not display Ministry endorsements, government seals, or official insignia. All confirmations are attributed to local health facilities (*"FACILITY CONFIRMED"* / *"IMETHIBITISHWA KITUONI"*).

---

## 2. Palette & Contrast Science

The palette is derived from authentic Kenyan clinic cardstock, physical rubber-stamp ink, and earth pigments. Every color pair is verified using standard WCAG 2.1 formulas.

| Token | Hex | Role | Contrast vs Canvas | WCAG Compliance |
| :--- | :--- | :--- | :--- | :--- |
| **`Paper`** | `#F6EFE3` | Primary background canvas | N/A (Canvas) | Base |
| **`Ink`** | `#1F2A24` | Primary text, hairline rules | **12.1:1** | **AAA Pass** |
| **`Forest`** | `#1E4D3B` | Primary brand anchor, verified checkmarks | **7.9:1** | **AAA Pass** |
| **`Terracotta`** | `#C4572F` | Inked stamps, large headlines (at least 24px), icons | **3.9:1** | **AA Large/UI Pass** |
| **`Terracotta Body`**| `#9F3E1A` | **Body-size text**, drug allergy tags, danger alerts | **5.6:1** | **AA Normal Text Pass** |
| **`Ochre`** | `#E0A030` | Active milestone indicators, sync highlights | **6.6:1** (vs Ink) | **AAA with Ink text** |
| **`Ochre Body`** | `#8C5E09` | Readable warning text on paper canvas | **4.9:1** | **AA Normal Text Pass** |
| **`Clay Tint`** | `#E9C9B8` | Card surfaces, booklet match tags | **8.9:1** (vs Ink) | **AAA Pass** |
| **`Indigo`** | `#26346B` | **Clinician area only** (`/clinic`), voice note reviews | **10.1:1** | **AAA Pass** |

### Contrast Rules & Guardrails
- **Body Text Minimum:** Any text smaller than 18pt (or 14pt bold) must achieve at least **4.5:1** contrast.
- **Terracotta Rule:** `#C4572F` has a contrast ratio of ~3.9:1 against `#F6EFE3`. It is strictly prohibited on body-size text. Use `#9F3E1A` for body-size text, allergy tags, and alerts.
- **Ochre Rule:** Never place white text on `#E0A030`. Always pair with `#1F2A24` Ink text (6.6:1 AAA) or use `#8C5E09` for body text.

---

## 3. Typography: Bricolage Grotesque & Figtree

| Role | Font Family | Size / Line-Height | Styling Rules |
| :--- | :--- | :--- | :--- |
| **Display** | Bricolage Grotesque | `34px` / `1.15` | Weight 800; tracking -0.025em; high personality |
| **Title 1** | Bricolage Grotesque | `28px` / `1.2` | Weight 700; tracking -0.02em; section headings |
| **Title 2** | Bricolage Grotesque | `22px` / `1.25` | Weight 700; tracking -0.015em; card titles |
| **Subhead** | Bricolage Grotesque | `18px` / `1.35` | Weight 600; milestone names, visit focus |
| **Body (Base)** | Figtree | `16px` / `1.55` | **STRICT RULE: Minimum 16px on mobile** for low-cost devices |
| **Caption / Tag**| Figtree | `13-14px` / `1.4` | Weight 500; register subtext, helper labels |
| **Numbers, IDs, Dates**| Figtree (Tabular) | `12-16px` / `1.3` | `font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1;` |

*Self-hosted via `next/font/google` (`display: swap`, Latin subset only).*

---

## 4. Background Paper Texture

The background replaces synthetic dotted matrices with authentic paper grain:
- Implemented as an inline SVG `feTurbulence` fractal noise filter (`baseFrequency="0.8"`, `numOctaves="3"`, color-matrix alpha 0.04).
- Generates organic fibrous micro-texture across `#F6EFE3`.
- No regular repeating dot grid.
- Zero external HTTP requests; under 1KB payload.

---

## 5. Signature Components Specification

### 1. `FacilityStamp` (`/frontend/src/components/FacilityStamp.tsx`)
- Genuine hand-inked stamp with SVG `feTurbulence` and `feDisplacementMap` applied to outer borders and background wash.
- Hand-stamped rule replacing uniform machine-dashed borders.
- Uneven ink density with subtle faded corner mask.
- Optional faint double-strike ghost outline.
- **Crisp Text Guarantee:** Lettering is rendered in a separate crisp DOM layer on top, ensuring clear legibility down to 360px viewports.
- **Header:** `"FACILITY CONFIRMED"` (sw: `"IMETHIBITISHWA KITUONI"`).
- **REF Line:** Font size at least 12px with verified AA contrast.
- Varied rotation per instance (-2.4° to +3.1°).

### 2. `JourneyPath` (`/frontend/src/components/JourneyPath.tsx`)
- Winding, organic SVG pregnancy path tracking 8 antenatal contacts.
- Touch targets strictly at least 48px on all nodes.
- Responsive layout wrapping smoothly on 360px screens.
- Interactive inspection showing gestational goals, Kiswahili translation, and booklet page reference.

### 3. `LedgerTable` (`/frontend/src/components/LedgerTable.tsx`)
- Hairline borders (`0.5px` in `rgba(31, 42, 36, 0.16)`) patterned after physical clinic registers.
- Monospaced tabular numerals (`Figtree` with `tabular-nums`) for diagnostic parameters and drug dosages.

### 4. `PerforatedCard` (`/frontend/src/components/PerforatedCard.tsx`)
- Scalloped perforated tear-edges simulating printed thermal lab slips.
- Structured findings, physical booklet page link, and facility stamp overlay.

### 5. `TextileBorder` (`/frontend/src/components/TextileBorder.tsx`)
- Original geometric East African basketry/weave pattern (chevrons, diamonds, rhythmic tick marks).
- Supports `size="lg"` (28px height) as a prominent signature divider at major document transitions, and `size="md"` / `size="sm"` for sparing card dividers.

### 6. `OfflineEmergencyCard` (`/frontend/src/components/OfflineEmergencyCard.tsx`)
- High-contrast, asymmetrical emergency card.
- Large `O+` blood group (48px Bricolage Grotesque).
- Drug allergy badges using `#9F3E1A` for guaranteed AA contrast.
- Clickable emergency contact links.
- Cryptographically cached offline.

---

## 6. Architecture & Data Flow

```
[ Realistic Fictional Data (src/mock/mch-data.ts) ]
  (Mto Mukuu Health Centre, Eastgate Mission Hospital, Lakeview County Referral Hospital)
                         │
                         ▼
[ Dexie IndexedDB Store (src/lib/db/index.ts) ]
  (Local-first persistence & offline sync queue)
                         │
                         ▼
[ TanStack Query API Layer (src/lib/api/index.ts) ]
  (usePatient, useEncounters, useObservations, useMedications, useSyncStatus)
                         │
                         ▼
[ Reusable UI & Signature Components (src/components/) ]
                         │
                         ▼
[ Route Groups (src/app/) ]
  ├── (patient)  -> /app
  ├── (clinic)   -> /clinic
  ├── ussd       -> /ussd
  └── styleguide -> /styleguide
```

- **FHIR R4 Aligned Models:** Strict Zod schemas in `src/lib/models/fhir.ts`.
- **UI Decoupling:** UI components never touch `src/mock/` directly; all reads and mutations pass through `src/lib/api/`.
- **Bilingual i18n:** English (`en.json`) and Kiswahili (`sw.json`) with runtime switching via `src/lib/i18n-context.tsx`.

---

## 7. Responsive Rules (360px Mobile First)

- **Touch Targets:** Strictly at least 48x48px for all buttons, toggles, and journey nodes.
- **Viewport Resilience:** No horizontal overflow at 360px width.
- **Typography Minimums:** Body text strictly at least 16px on mobile; sub-labels and REF numbers strictly at least 12px.
