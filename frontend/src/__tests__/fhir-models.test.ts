import { describe, it, expect } from "vitest";
import {
  PatientSchema,
  EncounterSchema,
  ObservationSchema,
  MedicationStatementSchema,
  ImmunizationSchema,
  DocumentReferenceSchema,
  ConsentSchema,
} from "../lib/models/fhir";
import {
  MOCK_PATIENT,
  MOCK_ENCOUNTERS,
  MOCK_OBSERVATIONS,
  MOCK_MEDICATIONS,
  MOCK_IMMUNIZATIONS,
  MOCK_DOCUMENTS,
  MOCK_CONSENTS,
} from "../mock/mch-data";

describe("FHIR R4-Shaped MCH Data Models", () => {
  it("successfully validates realistic fictional Patient resource with MCH extensions", () => {
    const parsed = PatientSchema.parse(MOCK_PATIENT);
    expect(parsed.name.text).toBe("Amina Wanjiku Muthoni");
    expect(parsed.mchData.bloodGroup).toBe("O+");
    expect(parsed.mchData.gestationalAgeWeeks).toBe(28);
    expect(parsed.mchData.paperBookletNumber).toBe("KB-2026/092");
    expect(parsed.mchData.registeredFacility.name).toBe("Mto Mukuu Health Centre");
    expect(parsed.mchData.allergies).toContain("Penicillin (moderate rash)");
  });

  it("fails validation when required MCH fields are out of bounds", () => {
    const invalidPatient = {
      ...MOCK_PATIENT,
      mchData: {
        ...MOCK_PATIENT.mchData,
        gestationalAgeWeeks: -5,
      },
    };
    expect(() => PatientSchema.parse(invalidPatient)).toThrow();
  });

  it("validates 8 ANC encounters matching national schedule", () => {
    expect(MOCK_ENCOUNTERS.length).toBe(8);
    MOCK_ENCOUNTERS.forEach((enc) => {
      const parsed = EncounterSchema.parse(enc);
      expect(parsed.contactNumber).toBeGreaterThanOrEqual(1);
      expect(parsed.contactNumber).toBeLessThanOrEqual(8);
      expect(parsed.bookletCrossReference.pageNumber).toBeGreaterThan(0);
    });
  });

  it("validates clinical observations with LOINC and clinical codes", () => {
    MOCK_OBSERVATIONS.forEach((obs) => {
      const parsed = ObservationSchema.parse(obs);
      expect(parsed.resourceType).toBe("Observation");
      expect(parsed.status).toBe("final");
      expect(parsed.subject.reference).toContain("Patient/");
    });
  });

  it("validates medication statements including IFAS and OTC tracking", () => {
    MOCK_MEDICATIONS.forEach((med) => {
      const parsed = MedicationStatementSchema.parse(med);
      expect(parsed.resourceType).toBe("MedicationStatement");
      expect(parsed.dosage.text).toBeTruthy();
    });

    const otc = MOCK_MEDICATIONS.find((m) => m.isOtc);
    expect(otc).toBeDefined();
    expect(otc?.medicationCodeableConcept.category).toBe("OTC_SELF_REPORTED");
  });

  it("validates immunizations with batch numbers and facility stamp linkage", () => {
    MOCK_IMMUNIZATIONS.forEach((imm) => {
      const parsed = ImmunizationSchema.parse(imm);
      expect(parsed.resourceType).toBe("Immunization");
      expect(parsed.facility.stampId).toBeTruthy();
    });
  });

  it("validates lab slips and doctor voice note documents", () => {
    MOCK_DOCUMENTS.forEach((doc) => {
      const parsed = DocumentReferenceSchema.parse(doc);
      expect(parsed.resourceType).toBe("DocumentReference");
      expect(parsed.content.title).toBeTruthy();
    });
  });

  it("validates patient consent resources", () => {
    MOCK_CONSENTS.forEach((con) => {
      const parsed = ConsentSchema.parse(con);
      expect(parsed.resourceType).toBe("Consent");
      expect(parsed.provision.dataCategories.length).toBeGreaterThan(0);
    });
  });
});
