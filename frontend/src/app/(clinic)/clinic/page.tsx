import Link from "next/link";
import { StethoscopeIcon } from "@/components/icons";

export default function ClinicianChannelShellPage() {
  return (
    <main className="min-h-screen bg-paper p-6 max-w-2xl mx-auto flex flex-col justify-center">
      <div className="bg-paper-card border-2 border-indigo/30 rounded-lg p-6 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-heading text-indigo uppercase font-bold">
          <StethoscopeIcon size={18} />
          <span>Clinician Channel • /clinic</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-ink mt-2">
          Kitabu Clinician Portal (Hospital &amp; Dispensary Web)
        </h1>
        <p className="text-sm text-ink-muted mt-2 leading-relaxed font-body">
          This channel uses the designated <span className="font-tabular text-indigo font-bold">Indigo (#26346B)</span> palette token. It will provide fast register entry, clinician voice-note capture, patient booklet QR scanning, and facility stamp confirmation.
        </p>
        <div className="mt-4 p-3 rounded bg-indigo-light/60 border border-indigo/20 text-xs text-indigo font-body">
          <span className="font-semibold">Design Phase Scope:</span> Full clinical workstation screens will be constructed in subsequent phases.
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/styleguide"
            className="touch-target inline-flex items-center gap-2 px-4 py-2 rounded bg-indigo text-paper font-heading text-xs font-bold hover:bg-indigo-dark transition-colors"
          >
            <span>Explore Living Style Guide</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
