import { z } from "zod";

// Base Identifier Schema (FHIR Identifier)
export const IdentifierSchema = z.object({
  system: z.string(),
  value: z.string(),
  type: z.string().optional(), // e.g. "NATIONAL_ID", "ANC_REGISTER", "LINDA_MAMA"
});

export type Identifier = z.infer<typeof IdentifierSchema>;

// Base Reference Schema (FHIR Reference)
export const ReferenceSchema = z.object({
  reference: z.string(), // e.g. "Patient/p-001"
  display: z.string().optional(),
});

export type Reference = z.infer<typeof ReferenceSchema>;

// 1. PATIENT RESOURCE
export const PatientSchema = z.object({
  resourceType: z.literal("Patient"),
  id: z.string(),
  identifier: z.array(IdentifierSchema),
  active: z.boolean().default(true),
  name: z.object({
    text: z.string(),
    family: z.string(),
    given: z.array(z.string()),
  }),
  telecom: z.array(
    z.object({
      system: z.enum(["phone", "sms", "email"]),
      value: z.string(),
      use: z.enum(["mobile", "home", "work"]).optional(),
    })
  ),
  gender: z.enum(["female", "other"]),
  birthDate: z.string(), // YYYY-MM-DD
  address: z.object({
    county: z.string(),
    subCounty: z.string(),
    villageOrEstate: z.string(),
  }),
  // Kenyan MCH Extensions
  mchData: z.object({
    gravida: z.number().int().min(1),
    para: z.number().int().min(0),
    lmp: z.string(), // Last Menstrual Period
    edd: z.string(), // Estimated Date of Delivery
    gestationalAgeWeeks: z.number().min(0).max(45),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "UNKNOWN"]),
    rhesusFactor: z.enum(["positive", "negative", "unknown"]),
    allergies: z.array(z.string()),
    chronicConditions: z.array(z.string()),
    emergencyContact: z.object({
      name: z.string(),
      relationship: z.string(),
      phone: z.string(),
    }),
    registeredFacility: z.object({
      id: z.string(),
      name: z.string(),
      mflCode: z.string(), // Master Health Facility List code
    }),
    paperBookletNumber: z.string(), // MOH 405 booklet serial
    linkedNewbornId: z.string().optional(),
  }),
});

export type Patient = z.infer<typeof PatientSchema>;

// 2. ENCOUNTER RESOURCE (ANC & Postnatal Visits)
export const EncounterSchema = z.object({
  resourceType: z.literal("Encounter"),
  id: z.string(),
  status: z.enum(["planned", "in-progress", "finished", "cancelled"]),
  class: z.literal("AMB"), // Ambulatory / Outpatient
  type: z.enum(["ANC", "PNC", "DELIVERY", "EMERGENCY"]),
  contactNumber: z.number().int().min(1).max(8), // MOH 8 ANC visits
  subject: ReferenceSchema,
  period: z.object({
    start: z.string(), // ISO date string
    end: z.string().optional(),
  }),
  serviceProvider: z.object({
    id: z.string(),
    name: z.string(),
    mflCode: z.string(),
  }),
  practitioner: z.object({
    name: z.string(),
    role: z.enum(["NURSE_MIDWIFE", "CLINICAL_OFFICER", "MEDICAL_OFFICER", "OBGYN"]),
    cadreNumber: z.string().optional(),
  }),
  reasonCode: z.string(),
  bookletCrossReference: z.object({
    pageNumber: z.number(),
    section: z.string(),
    notes: z.string().optional(),
  }),
  verifiedStampId: z.string().optional(),
});

export type Encounter = z.infer<typeof EncounterSchema>;

// 3. OBSERVATION RESOURCE (Vitals, Lab Results, Ultrasound)
export const ObservationSchema = z.object({
  resourceType: z.literal("Observation"),
  id: z.string(),
  status: z.enum(["registered", "preliminary", "final", "amended"]),
  category: z.enum(["vital-signs", "laboratory", "exam", "social-history"]),
  code: z.object({
    codingSystem: z.string(), // LOINC or MOH-KENYA
    code: z.string(),
    display: z.string(),
  }),
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  effectiveDateTime: z.string(),
  valueQuantity: z
    .object({
      value: z.number(),
      unit: z.string(),
      system: z.string().optional(),
    })
    .optional(),
  valueString: z.string().optional(),
  interpretation: z.enum(["normal", "low", "high", "abnormal", "critical"]).optional(),
  referenceRange: z
    .object({
      low: z.number().optional(),
      high: z.number().optional(),
      unit: z.string(),
      text: z.string().optional(),
    })
    .optional(),
  performer: z.object({
    name: z.string(),
    facility: z.string(),
  }),
  bookletPage: z.number().optional(),
});

export type Observation = z.infer<typeof ObservationSchema>;

// 4. MEDICATION STATEMENT RESOURCE
export const MedicationStatementSchema = z.object({
  resourceType: z.literal("MedicationStatement"),
  id: z.string(),
  status: z.enum(["active", "completed", "intended", "stopped"]),
  medicationCodeableConcept: z.object({
    code: z.string(),
    display: z.string(),
    category: z.enum([
      "SUPPLEMENT_IFAS", // Iron + Folic Acid
      "MALARIA_IPTP",    // IPTp-SP
      "DEWORMING",       // Mebendazole
      "CALCIUM",         // Calcium carbonate
      "TETANUS",
      "OTC_SELF_REPORTED",
      "OTHER_PRESCRIPTION",
    ]),
  }),
  subject: ReferenceSchema,
  effectivePeriod: z.object({
    start: z.string(),
    end: z.string().optional(),
  }),
  dosage: z.object({
    text: z.string(), // e.g. "1 tablet daily after food"
    timing: z.string(),
    asNeeded: z.boolean().default(false),
  }),
  isOtc: z.boolean().default(false),
  adherenceSelfReport: z.enum(["always", "often", "sometimes", "rarely"]).optional(),
  prescribingFacility: z.string().optional(),
  bookletPage: z.number().optional(),
});

export type MedicationStatement = z.infer<typeof MedicationStatementSchema>;

// 5. IMMUNIZATION RESOURCE (Tetanus Diphtheria, Newborn Vaccines)
export const ImmunizationSchema = z.object({
  resourceType: z.literal("Immunization"),
  id: z.string(),
  status: z.enum(["completed", "not-done"]),
  vaccineCode: z.object({
    code: z.string(), // e.g. "TD1", "TD2", "BCG", "BOPV0"
    display: z.string(),
    doseNumber: z.number().int().min(1).max(5),
  }),
  patient: ReferenceSchema,
  occurrenceDateTime: z.string(),
  lotNumber: z.string().optional(),
  site: z.string().optional(), // e.g. "Left Deltoid"
  facility: z.object({
    name: z.string(),
    stampId: z.string(),
  }),
  bookletPage: z.number().optional(),
});

export type Immunization = z.infer<typeof ImmunizationSchema>;

// 6. DOCUMENT REFERENCE RESOURCE (Photographed lab slips, ultrasound images, doctor voice notes)
export const DocumentReferenceSchema = z.object({
  resourceType: z.literal("DocumentReference"),
  id: z.string(),
  status: z.enum(["current", "superseded", "entered-in-error"]),
  type: z.enum([
    "LAB_SLIP_PHOTO",
    "ULTRASOUND_IMAGE",
    "DOCTOR_VOICE_NOTE",
    "DISCHARGE_SUMMARY",
  ]),
  subject: ReferenceSchema,
  date: z.string(),
  author: z.object({
    name: z.string(),
    role: z.string(),
    facility: z.string(),
  }),
  content: z.object({
    attachmentUrl: z.string(), // URI or mock data URI
    mimeType: z.string(),
    title: z.string(),
    thumbnailUrl: z.string().optional(),
    transcript: z.string().optional(), // For doctor voice notes
    clinicianApproved: z.boolean().default(false),
  }),
  facilityStampId: z.string().optional(),
  bookletPage: z.number().optional(),
});

export type DocumentReference = z.infer<typeof DocumentReferenceSchema>;

// 7. CONSENT RESOURCE (Granular sharing permissions & de-identified research)
export const ConsentSchema = z.object({
  resourceType: z.literal("Consent"),
  id: z.string(),
  status: z.enum(["active", "inactive", "entered-in-error"]),
  scope: z.enum(["patient-privacy", "research", "emergency-override"]),
  category: z.enum([
    "FACILITY_FULL_ACCESS",
    "FACILITY_LAB_ONLY",
    "RESEARCH_DEIDENTIFIED",
    "EMERGENCY_FIRST_RESPONDER",
  ]),
  patient: ReferenceSchema,
  recipient: z.object({
    facilityId: z.string().optional(),
    facilityName: z.string(),
    mflCode: z.string().optional(),
  }),
  dateTime: z.string(),
  provision: z.object({
    type: z.enum(["permit", "deny"]),
    dataCategories: z.array(z.string()), // ["encounters", "observations", "medications", "photos"]
  }),
  lastUpdated: z.string(),
});

export type Consent = z.infer<typeof ConsentSchema>;
