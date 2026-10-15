# MCH-Booklet Backend (Architecture Placeholder)

> **Status:** Architecture placeholder. No backend code is implemented in this phase (UI/UX phase only).

This service will host the production backend API for the Kenyan Maternal and Child Health (MCH) patient-owned digital health wallet platform.

## Planned Technology Stack

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database:** PostgreSQL (with PostGIS for health facility catchment mapping)
- **Interoperability:** HL7 FHIR R4-compatible services and schemas (mapping directly to the Ministry of Health MCH Booklet 2020 edition / KHIS standards)
- **Session & Cache:** Redis for ephemeral USSD session management and sync-queue buffering
- **Telephony & Messaging:** [Africa's Talking](https://africastalking.com/) integration for USSD menus (`*384#` / telco shortcodes) and two-way SMS delivery reminders
- **Object Storage:** S3-compatible encrypted storage for photographed lab results and clinician audio recordings

## System Roles

1. **FHIR Store & Sync Engine:** Provides bi-directional offline synchronization endpoints for mobile PWA clients and facility portals.
2. **USSD Gateway:** Powers feature-phone access for mothers without smartphones or internet connectivity (checking ANC visit schedules, urgent warning signs, and facility contacts).
3. **Audit & Consent Engine:** Enforces granular, cryptographic patient-directed consent for health record access across providers and de-identified data contributions.
