import React from "react";
import { AlertTriangleIcon, PhoneIcon, DropBloodIcon, ShieldCheckIcon } from "./icons";
import { Patient } from "../lib/models/fhir";

export interface OfflineEmergencyCardProps {
  patient: Patient;
  className?: string;
}

export function OfflineEmergencyCard({
  patient,
  className = "",
}: OfflineEmergencyCardProps) {
  const { mchData, name } = patient;

  return (
    <div
      className={`bg-paper-card border-2 border-terracotta rounded-lg overflow-hidden shadow-xs max-w-xl ${className}`}
      role="region"
      aria-label="Critical Emergency Health Card"
    >
      {/* Top Banner */}
      <div className="bg-terracotta text-paper-light px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangleIcon size={18} className="stroke-[2.5]" />
          <span className="font-heading text-xs font-bold tracking-wider uppercase">
            Critical Emergency Card • Offline Ready
          </span>
        </div>
        <span className="text-xs font-heading font-extrabold uppercase bg-paper-light/25 px-2 py-0.5 rounded">
          EMERGENCY READY
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4 font-body">
        {/* Patient Name & Gestation */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/15 pb-3 gap-1">
          <div>
            <h3 className="font-heading text-2xl font-bold text-ink">
              {name.text}
            </h3>
            <p className="text-xs font-tabular text-ink-muted">
              Clinic ID: {mchData.registeredFacility.mflCode}-{mchData.paperBookletNumber}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="font-tabular font-bold text-forest text-sm bg-forest-light px-2.5 py-1 rounded inline-block border border-forest-border/30">
              {mchData.gestationalAgeWeeks} Weeks Gestation
            </span>
            <div className="text-xs font-tabular text-ink-muted mt-0.5">
              EDD: {mchData.edd}
            </div>
          </div>
        </div>

        {/* Asymmetrical High-Impact Grid: Large Blood Group + Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {/* Big Blood Group Block */}
          <div className="sm:col-span-1 bg-terracotta-light border border-terracotta-border/40 rounded-md p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-xs font-heading font-bold uppercase text-terracotta-body">
              <DropBloodIcon size={15} />
              <span>Blood Group</span>
            </div>
            <div className="font-heading text-4xl sm:text-5xl font-black text-terracotta my-1 tracking-tight">
              {mchData.bloodGroup}
            </div>
            <span className="text-xs font-heading uppercase text-terracotta-body font-bold">
              Rhesus {mchData.rhesusFactor}
            </span>
          </div>

          {/* Allergies & Chronic Conditions */}
          <div className="sm:col-span-2 space-y-3 flex flex-col justify-between">
            {/* Allergies */}
            <div className="bg-paper p-3 rounded border border-ink/15">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-terracotta-body block mb-1.5">
                ⚠ Known Drug Allergies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {mchData.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-terracotta-light text-terracotta-body border border-terracotta-border/40"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="bg-paper p-3 rounded border border-ink/15">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-ink-muted block mb-1">
                Chronic Medical Conditions
              </span>
              <div className="text-xs text-ink font-semibold">
                {mchData.chronicConditions.join(", ")}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact & Registered Facility */}
        <div className="pt-2 border-t border-ink/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-forest-light text-forest flex items-center justify-center shrink-0">
              <PhoneIcon size={16} />
            </div>
            <div>
              <span className="text-[11px] font-heading font-bold uppercase text-ink-muted block">
                Next of Kin ({mchData.emergencyContact.relationship})
              </span>
              <a
                href={`tel:${mchData.emergencyContact.phone}`}
                className="font-tabular font-bold text-forest hover:underline text-xs"
              >
                {mchData.emergencyContact.name} • {mchData.emergencyContact.phone}
              </a>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-heading font-bold uppercase text-ink-muted block">
              Registered Facility
            </span>
            <span className="font-semibold text-ink text-xs">
              {mchData.registeredFacility.name}
            </span>
          </div>
        </div>

        {/* Bottom Responder Advisory */}
        <div className="bg-clay-light/60 p-2.5 rounded text-xs text-ink-muted flex items-center gap-2 border border-clay-dark/30">
          <ShieldCheckIcon size={16} className="text-forest shrink-0" />
          <span>
            <strong className="text-ink">Emergency Responders:</strong> This critical card is cryptographically cached on the patient&apos;s device and loads instantly without cellular data.
          </span>
        </div>
      </div>
    </div>
  );
}
