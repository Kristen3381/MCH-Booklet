import Dexie, { type Table } from "dexie";
import {
  Patient,
  Encounter,
  Observation,
  MedicationStatement,
  Immunization,
  DocumentReference,
  Consent,
} from "../models/fhir";
import {
  MOCK_PATIENT,
  MOCK_ENCOUNTERS,
  MOCK_OBSERVATIONS,
  MOCK_MEDICATIONS,
  MOCK_IMMUNIZATIONS,
  MOCK_DOCUMENTS,
  MOCK_CONSENTS,
} from "../../mock/mch-data";

export interface SyncQueueItem {
  id?: number;
  entityType:
    | "Patient"
    | "Encounter"
    | "Observation"
    | "MedicationStatement"
    | "Immunization"
    | "DocumentReference"
    | "Consent";
  entityId: string;
  action: "create" | "update" | "delete";
  payload: Record<string, unknown>;
  createdAt: string;
  status: "synced" | "pending" | "failed";
  retryCount: number;
  errorMessage?: string;
}

export class MCHDatabase extends Dexie {
  patients!: Table<Patient, string>;
  encounters!: Table<Encounter, string>;
  observations!: Table<Observation, string>;
  medications!: Table<MedicationStatement, string>;
  immunizations!: Table<Immunization, string>;
  documents!: Table<DocumentReference, string>;
  consents!: Table<Consent, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super("MCH_Digital_Companion_DB");
    this.version(1).stores({
      patients: "id, active, [mchData.bloodGroup], mchData.paperBookletNumber",
      encounters: "id, status, type, contactNumber, [period.start]",
      observations: "id, category, status, effectiveDateTime, bookletPage",
      medications: "id, status, isOtc, [effectivePeriod.start]",
      immunizations: "id, status, occurrenceDateTime",
      documents: "id, type, date, [content.clinicianApproved]",
      consents: "id, status, scope, [recipient.facilityName]",
      syncQueue: "++id, entityType, entityId, action, status, createdAt",
    });
  }
}

export const db = new MCHDatabase();

// Seed database on client startup if empty
export async function seedDatabaseIfEmpty(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const patientCount = await db.patients.count();
    if (patientCount === 0) {
      await db.patients.put(MOCK_PATIENT);
      await db.encounters.bulkPut(MOCK_ENCOUNTERS);
      await db.observations.bulkPut(MOCK_OBSERVATIONS);
      await db.medications.bulkPut(MOCK_MEDICATIONS);
      await db.immunizations.bulkPut(MOCK_IMMUNIZATIONS);
      await db.documents.bulkPut(MOCK_DOCUMENTS);
      await db.consents.bulkPut(MOCK_CONSENTS);

      // Add a realistic simulated pending item in sync queue to showcase pending state
      await db.syncQueue.put({
        entityType: "MedicationStatement",
        entityId: "med-otc-para-01",
        action: "update",
        payload: { note: "Dose taken at 28w for pelvic ache" },
        createdAt: new Date().toISOString(),
        status: "pending",
        retryCount: 0,
      });
    }
  } catch (err) {
    console.error("Dexie seed error:", err);
  }
}
