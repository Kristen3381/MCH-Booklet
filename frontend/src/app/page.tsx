import Link from "next/link";
import { BookletIcon, StethoscopeIcon, PhoneIcon } from "@/components/icons";
import { TextileBorder } from "@/components/TextileBorder";

export default function RootHomePage() {
  return (
    <main className="min-h-screen bg-paper py-12 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col justify-center">
      <div className="bg-paper-card border border-ink/20 rounded-lg p-6 sm:p-10 shadow-2xs relative overflow-hidden">
        {/* Top Tagline */}
        <div className="flex items-center gap-2 text-xs font-heading text-forest uppercase font-bold tracking-wider">
          <BookletIcon size={20} className="stroke-[2.2]" />
          <span>Kitabu • Digital Health Wallet</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-black text-ink mt-3 leading-tight tracking-tight">
          The Booklet&apos;s Digital Companion
        </h1>

        <p className="font-heading italic text-lg sm:text-xl text-ink-muted mt-2">
          &ldquo;Your digital copy, alongside your clinic booklet.&rdquo;
        </p>

        {/* Signature Divider */}
        <TextileBorder variant="primary" size="lg" className="my-6" />

        <p className="text-base text-ink leading-relaxed max-w-2xl font-body">
          A patient-owned digital health wallet for Kenyan maternal and child health.
          Designed to feel like a well-kept, trusted paper booklet carried into the digital world.
          It <strong>supplements</strong> the physical clinic booklet—it does not replace it.
        </p>

        {/* Primary Action Button to Living Style Guide */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link
            href="/styleguide"
            className="touch-target inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-md bg-forest text-paper font-heading font-bold text-sm hover:bg-forest-dark transition-all shadow-xs"
          >
            <span>Open Living Style Guide</span>
            <span>→</span>
          </Link>
          <span className="text-xs font-tabular text-ink-muted text-center sm:text-left">
            Design tokens, typography, signatures, &amp; interactive components
          </span>
        </div>

        {/* Channels Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-ink/15">
          <Link
            href="/app"
            className="p-4 rounded border border-ink/15 bg-paper hover:border-forest hover:shadow-2xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-heading text-forest font-bold">
                <BookletIcon size={16} />
                <span>/app</span>
              </div>
              <h3 className="font-heading font-bold text-base text-ink mt-1">
                Patient Mobile PWA
              </h3>
              <p className="text-xs text-ink-muted mt-1 font-body">
                Offline emergency card, ANC timeline, and lab slips.
              </p>
            </div>
            <span className="text-xs font-heading font-bold text-forest mt-3">
              Preview Channel →
            </span>
          </Link>

          <Link
            href="/clinic"
            className="p-4 rounded border border-indigo/25 bg-paper hover:border-indigo hover:shadow-2xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-heading text-indigo font-bold">
                <StethoscopeIcon size={16} />
                <span>/clinic</span>
              </div>
              <h3 className="font-heading font-bold text-base text-ink mt-1">
                Clinician Portal
              </h3>
              <p className="text-xs text-ink-muted mt-1 font-body">
                Fast register entry, doctor audio notes, and stamps.
              </p>
            </div>
            <span className="text-xs font-heading font-bold text-indigo mt-3">
              Preview Channel →
            </span>
          </Link>

          <Link
            href="/ussd"
            className="p-4 rounded border border-ink/15 bg-paper hover:border-terracotta hover:shadow-2xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-heading text-terracotta-body font-bold">
                <PhoneIcon size={16} />
                <span>/ussd</span>
              </div>
              <h3 className="font-heading font-bold text-base text-ink mt-1">
                USSD Simulator
              </h3>
              <p className="text-xs text-ink-muted mt-1 font-body">
                Feature-phone access (*384#) over Africa&apos;s Talking.
              </p>
            </div>
            <span className="text-xs font-heading font-bold text-terracotta-body mt-3">
              Preview Channel →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
