import Link from "next/link";
import { PhoneIcon } from "@/components/icons";

export default function USSDChannelShellPage() {
  return (
    <main className="min-h-screen bg-paper p-6 max-w-2xl mx-auto flex flex-col justify-center">
      <div className="bg-paper-card border border-ink/20 rounded-lg p-6 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-heading text-terracotta-body uppercase font-bold">
          <PhoneIcon size={18} />
          <span>USSD Channel • /ussd</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-ink mt-2">
          Kitabu USSD Feature Phone Simulator (*384#)
        </h1>
        <p className="text-sm text-ink-muted mt-2 leading-relaxed font-body">
          Provides feature-phone session simulation for mothers without smartphones, powered via Africa&apos;s Talking gateway. Allows querying next ANC date, emergency warning signs, and clinic contacts via keypad.
        </p>
        <div className="mt-4 p-3 rounded bg-ochre-light border border-ochre/30 text-xs text-ochre-dark font-body">
          <span className="font-semibold">Design Phase Scope:</span> Interactive USSD dial pad will be activated following review.
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/styleguide"
            className="touch-target inline-flex items-center gap-2 px-4 py-2 rounded bg-ink text-paper font-heading text-xs font-bold hover:bg-forest transition-colors"
          >
            <span>Explore Living Style Guide</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
