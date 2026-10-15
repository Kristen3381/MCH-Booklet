"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { db, seedDatabaseIfEmpty, SyncQueueItem } from "../db";
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

// 1. Patient Query Hook
export function usePatient(patientId: string = "pat-amina-muthoni-01") {
  return useQuery<Patient>({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (typeof window === "undefined") return MOCK_PATIENT;
      await seedDatabaseIfEmpty();
      const local = await db.patients.get(patientId);
      return local || MOCK_PATIENT;
    },
  });
}

// 2. Encounters Query Hook (ANC Visits 1-8)
export function useEncounters(patientId: string = "pat-amina-muthoni-01") {
  return useQuery<Encounter[]>({
    queryKey: ["encounters", patientId],
    queryFn: async () => {
      if (typeof window === "undefined") return MOCK_ENCOUNTERS;
      await seedDatabaseIfEmpty();
      const local = await db.encounters.toArray();
      if (local && local.length > 0) {
        return local.sort((a, b) => a.contactNumber - b.contactNumber);
      }
      return MOCK_ENCOUNTERS;
    },
  });
}

// 3. Observations Query Hook (Labs, Vitals, Ultrasound)
export function useObservations(
  patientId: string = "pat-amina-muthoni-01",
  category?: "vital-signs" | "laboratory" | "exam"
) {
  return useQuery<Observation[]>({
    queryKey: ["observations", patientId, category],
    queryFn: async () => {
      if (typeof window === "undefined") {
        return category
          ? MOCK_OBSERVATIONS.filter((o) => o.category === category)
          : MOCK_OBSERVATIONS;
      }
      await seedDatabaseIfEmpty();
      let list = await db.observations.toArray();
      if (!list || list.length === 0) list = MOCK_OBSERVATIONS;
      if (category) {
        list = list.filter((o) => o.category === category);
      }
      return list;
    },
  });
}

// 4. Medications Query Hook (IFAS, Deworming, Malaria Prophylaxis, OTC)
export function useMedications(patientId: string = "pat-amina-muthoni-01") {
  return useQuery<MedicationStatement[]>({
    queryKey: ["medications", patientId],
    queryFn: async () => {
      if (typeof window === "undefined") return MOCK_MEDICATIONS;
      await seedDatabaseIfEmpty();
      const list = await db.medications.toArray();
      return list && list.length > 0 ? list : MOCK_MEDICATIONS;
    },
  });
}

// 5. Immunizations Query Hook
export function useImmunizations(patientId: string = "pat-amina-muthoni-01") {
  return useQuery<Immunization[]>({
    queryKey: ["immunizations", patientId],
    queryFn: async () => {
      if (typeof window === "undefined") return MOCK_IMMUNIZATIONS;
      await seedDatabaseIfEmpty();
      const list = await db.immunizations.toArray();
      return list && list.length > 0 ? list : MOCK_IMMUNIZATIONS;
    },
  });
}

// 6. Documents Query Hook (Lab slips, Voice Notes)
export function useDocuments(patientId: string = "pat-amina-muthoni-01") {
  return useQuery<DocumentReference[]>({
    queryKey: ["documents", patientId],
    queryFn: async () => {
      if (typeof window === "undefined") return MOCK_DOCUMENTS;
      await seedDatabaseIfEmpty();
      const list = await db.documents.toArray();
      return list && list.length > 0 ? list : MOCK_DOCUMENTS;
    },
  });
}

// 7. Consents Query Hook (Provider sharing & research)
export function useConsents(patientId: string = "pat-amina-muthoni-01") {
  return useQuery<Consent[]>({
    queryKey: ["consents", patientId],
    queryFn: async () => {
      if (typeof window === "undefined") return MOCK_CONSENTS;
      await seedDatabaseIfEmpty();
      const list = await db.consents.toArray();
      return list && list.length > 0 ? list : MOCK_CONSENTS;
    },
  });
}

// 8. Toggle Consent Mutation Hook
export function useToggleConsent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      consentId,
      newStatus,
    }: {
      consentId: string;
      newStatus: "active" | "inactive";
    }) => {
      if (typeof window !== "undefined") {
        await db.consents.update(consentId, {
          status: newStatus,
          lastUpdated: new Date().toISOString(),
        });
        // Enqueue sync event
        await db.syncQueue.put({
          entityType: "Consent",
          entityId: consentId,
          action: "update",
          payload: { status: newStatus },
          createdAt: new Date().toISOString(),
          status: "pending",
          retryCount: 0,
        });
      }
      return { consentId, newStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consents"] });
      queryClient.invalidateQueries({ queryKey: ["syncQueue"] });
    },
  });
}

// 9. Sync Queue & Network Status Hook
export type SyncState = "synced" | "pending" | "offline";

export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const queueQuery = useQuery<SyncQueueItem[]>({
    queryKey: ["syncQueue"],
    queryFn: async () => {
      if (typeof window === "undefined") {
        return [
          {
            entityType: "MedicationStatement",
            entityId: "med-otc-para-01",
            action: "update",
            payload: {},
            createdAt: new Date().toISOString(),
            status: "pending",
            retryCount: 0,
          },
        ];
      }
      await seedDatabaseIfEmpty();
      return await db.syncQueue.where("status").equals("pending").toArray();
    },
  });

  const pendingCount = queueQuery.data?.length ?? 1;

  let state: SyncState = "synced";
  if (!isOnline) {
    state = "offline";
  } else if (pendingCount > 0) {
    state = "pending";
  }

  // Trigger sync mutation (mocks uploading pending queue to server)
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (typeof window === "undefined") return 0;
      const pendingItems = await db.syncQueue
        .where("status")
        .equals("pending")
        .toArray();
      for (const item of pendingItems) {
        if (item.id) {
          await db.syncQueue.update(item.id, { status: "synced" });
        }
      }
      return pendingItems.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syncQueue"] });
    },
  });

  return {
    state,
    isOnline,
    pendingCount,
    triggerSync: syncMutation.mutate,
    isSyncing: syncMutation.isPending,
  };
}
