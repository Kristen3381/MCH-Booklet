import React from "react";

export interface MeasurementPoint {
  week: number;
  cm: number;
  date: string;
  facility: string;
}

export interface FundalGrowthChartProps {
  currentWeek?: number;
  measurements?: MeasurementPoint[];
  className?: string;
}

const DEFAULT_MEASUREMENTS: MeasurementPoint[] = [
  { week: 20, cm: 19.5, date: "14 Jul 2026", facility: "Mto Mukuu Health Centre" },
  { week: 26, cm: 25.0, date: "25 Aug 2026", facility: "Eastgate Mission Hospital" },
  { week: 28, cm: 27.0, date: "30 Sep 2026", facility: "Mto Mukuu Health Centre" },
];

export function FundalGrowthChart({
  currentWeek = 28,
  measurements = DEFAULT_MEASUREMENTS,
  className = "",
}: FundalGrowthChartProps) {
  // Chart dimensions
  const width = 640;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Domain: weeks 16 to 40
  const minWeek = 16;
  const maxWeek = 40;
  // Range: 14 cm to 42 cm
  const minCm = 14;
  const maxCm = 42;

  const scaleX = (week: number) =>
    padding.left + ((week - minWeek) / (maxWeek - minWeek)) * innerWidth;

  const scaleY = (cm: number) =>
    padding.top + innerHeight - ((cm - minCm) / (maxCm - minCm)) * innerHeight;

  // Generate percentile curves (SFH approx = gestational age in cm ± 2cm)
  const weeksList = [16, 20, 24, 28, 32, 36, 40];

  const p50Points = weeksList.map((w) => `${scaleX(w)},${scaleY(w)}`).join(" ");
  const p90Points = weeksList.map((w) => `${scaleX(w)},${scaleY(w + 2.5)}`).join(" ");
  const p10Points = weeksList.map((w) => `${scaleX(w)},${scaleY(w - 2.5)}`).join(" ");

  // Shaded normal zone between 10th and 90th percentile
  const normalZonePath = `
    M ${weeksList.map((w) => `${scaleX(w)} ${scaleY(w + 2.5)}`).join(" L ")}
    L ${[...weeksList].reverse().map((w) => `${scaleX(w)} ${scaleY(w - 2.5)}`).join(" L ")}
    Z
  `;

  return (
    <div className={`bg-paper-card border border-ink/15 rounded-md p-4 sm:p-5 shadow-2xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-ink/15 pb-3 mb-3 gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-heading text-forest font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-forest"></span>
            <span>Clinical Growth Graph</span>
          </div>
          <h4 className="font-heading text-lg font-bold text-ink mt-0.5">
            Symphysis-Fundal Height (SFH) Growth Curve
          </h4>
          <p className="text-xs text-ink-muted font-body">
            Tracking fetal growth velocity against national reference percentiles (10th–90th).
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-tabular">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-forest"></span>
            <span className="text-ink font-semibold">Amina&apos;s Visits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-2 bg-clay/50 border border-ink/20 rounded-xs"></span>
            <span className="text-ink-muted">Normal Zone</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] select-none font-tabular text-[10px]"
          role="img"
          aria-label="Symphysis-Fundal Height Growth Chart"
        >
          {/* Background Normal Band */}
          <path d={normalZonePath} fill="#E9C9B8" fillOpacity="0.45" />

          {/* Grid lines (horizontal cm lines) */}
          {[16, 20, 24, 28, 32, 36, 40].map((cm) => (
            <g key={cm}>
              <line
                x1={padding.left}
                y1={scaleY(cm)}
                x2={width - padding.right}
                y2={scaleY(cm)}
                stroke="rgba(31, 42, 36, 0.12)"
                strokeDasharray="2 3"
              />
              <text
                x={padding.left - 8}
                y={scaleY(cm) + 3}
                textAnchor="end"
                fill="#4B5A51"
              >
                {cm}
              </text>
            </g>
          ))}

          {/* Vertical week grid lines */}
          {weeksList.map((week) => (
            <g key={week}>
              <line
                x1={scaleX(week)}
                y1={padding.top}
                x2={scaleX(week)}
                y2={height - padding.bottom}
                stroke="rgba(31, 42, 36, 0.12)"
                strokeDasharray="2 3"
              />
              <text
                x={scaleX(week)}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                fill="#4B5A51"
              >
                {week}w
              </text>
            </g>
          ))}

          {/* Percentile curves */}
          <polyline
            points={p90Points}
            fill="none"
            stroke="#1F2A24"
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.4"
          />
          <polyline
            points={p10Points}
            fill="none"
            stroke="#1F2A24"
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.4"
          />
          <polyline
            points={p50Points}
            fill="none"
            stroke="#1E4D3B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.75"
          />

          {/* Curve labels */}
          <text
            x={scaleX(40) + 4}
            y={scaleY(42.5)}
            fill="#7A8C81"
            fontSize="9"
          >
            90th
          </text>
          <text
            x={scaleX(40) + 4}
            y={scaleY(40)}
            fill="#1E4D3B"
            fontSize="9"
            fontWeight="bold"
          >
            50th (Mean)
          </text>
          <text
            x={scaleX(40) + 4}
            y={scaleY(37.5)}
            fill="#7A8C81"
            fontSize="9"
          >
            10th
          </text>

          {/* Current Gestational Week Guide Marker */}
          <line
            x1={scaleX(currentWeek)}
            y1={padding.top}
            x2={scaleX(currentWeek)}
            y2={height - padding.bottom}
            stroke="#E0A030"
            strokeWidth="2"
          />

          {/* Patient Measurement Line */}
          <polyline
            points={measurements
              .map((m) => `${scaleX(m.week)},${scaleY(m.cm)}`)
              .join(" ")}
            fill="none"
            stroke="#1E4D3B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Patient Measurement Data Points */}
          {measurements.map((m, idx) => {
            const cx = scaleX(m.week);
            const cy = scaleY(m.cm);
            return (
              <g key={idx} className="cursor-pointer group">
                <circle
                  cx={cx}
                  cy={cy}
                  r="6"
                  fill="#1E4D3B"
                  stroke="#F6EFE3"
                  strokeWidth="2"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r="10"
                  fill="transparent"
                  stroke="#1E4D3B"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.5"
                />
                <rect
                  x={cx - 24}
                  y={cy - 24}
                  width="48"
                  height="16"
                  rx="3"
                  fill="#1F2A24"
                />
                <text
                  x={cx}
                  y={cy - 13}
                  textAnchor="middle"
                  fill="#F6EFE3"
                  fontWeight="bold"
                  fontSize="9"
                >
                  {m.cm} cm
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left + innerWidth / 2}
            y={height - 8}
            textAnchor="middle"
            fill="#1F2A24"
            fontWeight="bold"
            fontSize="11"
          >
            Gestational Age (Weeks)
          </text>
          <text
            transform={`rotate(-90 ${14} ${padding.top + innerHeight / 2})`}
            x={14}
            y={padding.top + innerHeight / 2}
            textAnchor="middle"
            fill="#1F2A24"
            fontWeight="bold"
            fontSize="11"
          >
            Fundal Height (cm)
          </text>
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-tabular text-ink-muted border-t border-ink/10 pt-2">
        <span>Latest: 27 cm at 28 weeks (Within normal velocity)</span>
        <span className="text-forest font-semibold">Booklet Page 8</span>
      </div>
    </div>
  );
}
