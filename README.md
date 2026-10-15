# Kitabu — Digital Health Wallet (Afya ya Mama na Mtoto)

> **"The booklet's digital companion."**
> A patient-owned digital health wallet for Kenyan maternal and child health.

The platform **supplements** the paper record (the clinic health booklet and facility files) — it does **not** replace it. It serves as a portable, patient-controlled digital copy that travels with the mother when her physical paper file is unavailable or stored safely at home.

---

## Repository Architecture

This repository is split into two distinct tiers:

```
.
├── frontend/          # Fully self-contained UI/UX application (Next.js, Tailwind, PWA)
│   ├── src/
│   │   ├── app/       # App Router route groups:
│   │   │              #   - (patient)  -> /app       (Patient-facing PWA)
│   │   │              #   - (clinic)   -> /clinic    (Clinician web interface)
│   │   │              #   - ussd       -> /ussd      (USSD simulator)
│   │   │              #   - styleguide -> /styleguide (Design system & tokens)
│   │   ├── components/# Reusable design system & signature components
│   │   ├── lib/       # API clients, IndexedDB (Dexie), sync engine, FHIR models
│   │   ├── mock/      # Realistic fictional MCH mock datasets
│   │   └── messages/  # Bilingual copy (English and Kiswahili) via next-intl
│   └── DESIGN.md      # Design philosophy, typography, palette, and extension guide
│
├── backend/           # Architecture placeholder for future NestJS + PostgreSQL API
│   └── README.md      # Specification for FHIR services, Redis USSD session cache, & Africa's Talking
│
└── README.md          # Project root documentation
```

---

## Running the Frontend

The frontend is completely self-contained. No backend service or external database is required to run the application:

```bash
cd frontend
npm install
npm run dev
```

Visit the living design system and style guide at:
**[http://localhost:3000/styleguide](http://localhost:3000/styleguide)**

---

## Core Pillars & Values

- **Companion, Not Replacement:** We use copy such as *"your digital copy"* and *"alongside your clinic booklet"*. Never *"paperless"* or *"replaces paper"*.
- **Offline-First & Local-First:** Powered by Dexie (IndexedDB) and Serwist PWA service workers. Mothers retain immediate access to emergency cards (blood group, allergies, chronic conditions) without cellular connectivity.
- **Paper-Craft Aesthetic:** Designed around tactile Kenyan clinic registers, warm paper grain (`#F6EFE3`), hand-inked facility confirmation stamps, and East African textile border geometry.
- **Typography:** Bricolage Grotesque for headings; Figtree for body and UI; Figtree with tabular figures (`tabular-nums`) for dates, numbers, and identifiers. Minimum 16px body text on mobile.
- **FHIR R4 Ready:** Data contracts conform to HL7 FHIR specifications (`Patient`, `Encounter`, `Observation`, `MedicationStatement`, `Immunization`, `DocumentReference`, `Consent`).
- **Inclusive & Accessible:** Bilingual English and Kiswahili (`en` / `sw`), minimum 16px body type, $\ge 48\text{px}$ touch targets, and AAA/AA contrast.