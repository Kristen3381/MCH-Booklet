import React from "react";
import { FacilityStamp } from "./FacilityStamp";
import { BookletMatchTag } from "./BookletMatchTag";
import { CameraSlipIcon, CheckIcon, EyeIcon } from "./icons";

export interface PerforatedCardProps {
  title: string;
  testDate: string;
  facilityName: string;
  bookletPage?: number;
  resultsSummary: Array<{ label: string; value: string; unit?: string; normal?: boolean }>;
  stampDate?: string;
  stampNumber?: string;
  imageUrl?: string;
  onViewImage?: () => void;
  className?: string;
}

export function PerforatedCard({
  title,
  testDate,
  facilityName,
  bookletPage = 7,
  resultsSummary,
  stampDate,
  stampNumber = "LAB-9921",
  onViewImage,
  className = "",
}: PerforatedCardProps) {
  return (
    <div
      className={`relative bg-paper-card border border-ink/20 rounded-md shadow-2xs overflow-hidden max-w-md ${className}`}
    >
      {/* Top Perforation Teeth Simulation */}
      <div className="w-full h-3 bg-paper-dark/40 border-b border-dashed border-ink/25 flex items-center justify-around px-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-paper -mt-1.5 border border-ink/20"
          />
        ))}
      </div>

      <div className="p-4 sm:p-5">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 border-b border-ink/15 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-terracotta-body">
              <CameraSlipIcon size={14} className="text-terracotta stroke-[2]" />
              <span>Photographed Lab Receipt Slip</span>
            </div>
            <h4 className="font-heading text-lg font-bold text-ink mt-0.5">
              {title}
            </h4>
            <span className="text-xs font-tabular text-ink-muted block mt-0.5">
              Specimen Date: {testDate} • {facilityName}
            </span>
          </div>

          {bookletPage && <BookletMatchTag pageNumber={bookletPage} size="sm" />}
        </div>

        {/* Photographed Slip Mock Visual Frame */}
        <div className="my-4 bg-paper rounded border border-ink/20 p-3 flex flex-col sm:flex-row gap-3 relative overflow-hidden">
          {/* Simulated Lab Printout Texture */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-paper-light border border-ink/15 rounded flex flex-col items-center justify-center p-2 text-center shrink-0 relative shadow-inner">
            <div className="w-full h-1 bg-ink/10 rounded mb-1"></div>
            <div className="w-3/4 h-1 bg-ink/10 rounded mb-1"></div>
            <div className="font-heading text-[10px] font-bold uppercase tracking-tight text-ink-muted">
              EASTGATE LAB
            </div>
            <div className="font-tabular text-xs font-bold text-ink my-0.5">
              HB: 11.4 g/dL
            </div>
            <div className="font-body text-[10px] font-semibold text-forest">NORMAL</div>
            <div className="w-full h-0.5 border-b border-dashed border-ink/20 my-1"></div>
            <button
              type="button"
              onClick={onViewImage}
              className="mt-1 text-xs font-heading font-bold text-forest flex items-center gap-0.5 hover:underline"
            >
              <EyeIcon size={13} />
              <span>Full Slip</span>
            </button>
          </div>

          {/* Extracted Ledger Details */}
          <div className="flex-1 space-y-1.5 text-xs font-body">
            <div className="text-[11px] font-heading font-bold uppercase tracking-wide text-ink-muted">
              Structured Lab Findings
            </div>
            {resultsSummary.map((res, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-ink/10 pb-1"
              >
                <span className="text-ink font-medium">{res.label}</span>
                <span className="font-tabular font-bold text-ink">
                  {res.value} {res.unit && <span className="font-normal text-ink-muted">{res.unit}</span>}
                </span>
              </div>
            ))}
          </div>

          {/* Stamp overlay */}
          <div className="absolute -bottom-2 right-1 pointer-events-none opacity-90">
            <FacilityStamp
              facilityName={facilityName}
              date={stampDate || testDate}
              stampNumber={stampNumber}
              size="sm"
              rotation={3.5}
              variant="terracotta"
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-1 text-xs font-tabular text-ink-muted">
          <span className="flex items-center gap-1 text-forest font-semibold">
            <CheckIcon size={14} className="stroke-[2.5]" />
            Clinician Approved
          </span>
          <span>Digital copy safely stored</span>
        </div>
      </div>

      {/* Bottom Perforation Teeth Simulation */}
      <div className="w-full h-3 bg-paper-dark/40 border-t border-dashed border-ink/25 flex items-center justify-around px-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-paper -mb-1.5 border border-ink/20"
          />
        ))}
      </div>
    </div>
  );
}
