import Link from "next/link";
import { BookletIcon } from "@/components/icons";

export default function PatientAppShellPage() {
  return (
    <main className="min-h-screen bg-paper p-6 max-w-2xl mx-auto flex flex-col justify-center">
      <div className="bg-paper-card border border-ink/20 rounded-lg p-6 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-heading text-forest uppercase font-bold">
          <BookletIcon size={18} />
          <span>Patient Channel • /app</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-ink mt-2">
          Kitabu (Patient Mobile PWA)
        </h1>
        <p className="text-sm text-ink-muted mt-2 leading-relaxed font-body">
          This channel will host the patient-owned mobile-first digital health wallet:
          ANC visit timeline, offline emergency health card, photographed lab results,
          clinician audio note reviews, and granular sharing controls.
        </p>
        <div className="mt-4 p-3 rounded bg-clay/30 border border-ink/15 text-xs text-ink-muted font-body">
          <span className="font-semibold text-ink">Design Phase Scope:</span> Full screens will be built in the next step following style guide review.
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/styleguide"
            className="touch-target inline-flex items-center gap-2 px-4 py-2 rounded bg-forest text-paper font-heading text-xs font-bold hover:bg-forest-dark transition-colors"
          >
            <span>Explore Living Style Guide</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
