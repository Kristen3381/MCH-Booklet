import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// 1. Booklet / Clinic Register Icon
export function BookletIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20" />
      <path d="M8 8h8M8 12h8M8 16h5" />
      <path d="M6 2v20" />
    </svg>
  );
}

// 2. Official Facility Stamp Seal Icon
export function FacilityStampIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
      <circle cx="12" cy="12" r="6" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  );
}

// 3. Winding Journey Path Icon
export function JourneyPathIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M4 20c2-5 8-4 8-10S18 4 20 4" />
      <circle cx="4" cy="20" r="2" fill="currentColor" />
      <circle cx="12" cy="13" r="2" fill="currentColor" />
      <circle cx="20" cy="4" r="2" fill="currentColor" />
    </svg>
  );
}

// 4. Stethoscope Clinical Icon
export function StethoscopeIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M5 3v6a4 4 0 0 0 8 0V3" />
      <path d="M4 3h2M12 3h2" />
      <path d="M9 13v3a4 4 0 0 0 4 4h3" />
      <circle cx="18" cy="20" r="2" />
    </svg>
  );
}

// 5. Blood Drop / Lab Hb Icon
export function DropBloodIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M12 2.5c-3.5 4.5-7 8.5-7 12a7 7 0 0 0 14 0c0-3.5-3.5-7.5-7-12Z" />
      <path d="M12 11v6M9 14h6" />
    </svg>
  );
}

// 6. Pill / Medication Jar Icon
export function PillJarIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <rect x="6" y="7" width="12" height="14" rx="2" />
      <path d="M8 3h8v4H8z" />
      <path d="M10 14h4M12 12v4" />
    </svg>
  );
}

// 7. Shield & Consent Check Icon
export function ShieldCheckIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M12 3s7 2 7 8c0 6-7 10-7 10S5 17 5 11c0-6 7-8 7-8Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// 8. Camera with Lab Receipt Slip
export function CameraSlipIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M4 9h16v12H4z" />
      <path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
      <circle cx="12" cy="15" r="3" />
      <path d="M7 11h.01" />
    </svg>
  );
}

// 9. Doctor Voice Note / Microphone Icon
export function VoiceMicrophoneIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
    </svg>
  );
}

// 10. Sync Check Icon
export function SyncCheckIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M21 12a9 9 0 0 1-9 9A9.01 9.01 0 0 1 3.5 15" />
      <path d="M3 12a9 9 0 0 1 9-9 9.01 9.01 0 0 1 8.5 6" />
      <path d="M3 18v-3h3M21 6v3h-3" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// 11. Sync Pending Icon
export function SyncPendingIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M21 12a9 9 0 1 1-6.2-8.5" />
      <path d="M21 3v5h-5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

// 12. Offline Cloud Icon
export function CloudOfflineIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M4 14.899A7 7 0 0 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2" />
      <path d="m3 3 18 18" />
      <path d="M8.5 18H17" />
    </svg>
  );
}

// 13. Fetal / Maternal Heart Rate Icon
export function HeartRateIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
      <path d="M19.5 6.5A3.5 3.5 0 0 0 16 5c-1.5 0-2.5.8-3.5 2C11.5 5.8 10.5 5 9 5a3.5 3.5 0 0 0-3.5 3.5c0 4 6.5 8.5 6.5 8.5s6.5-4.5 6.5-8.5a3.5 3.5 0 0 0 1-2" strokeDasharray="2 2" />
    </svg>
  );
}

// 14. Maternal Warning / Danger Signs Alert Icon
export function AlertTriangleIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v5M12 17h.01" />
    </svg>
  );
}

// 15. Mother & Child Silhouette Icon
export function UserHeartIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a5 5 0 0 1 9.5-2" />
      <circle cx="17" cy="11" r="2.5" />
      <path d="M14.5 19v-1a3 3 0 0 1 5.5-1.5" />
    </svg>
  );
}

// 16. Booklet Page Tag Marker
export function BookletTagIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M18 2H6a2 2 0 0 0-2 2v18l8-4 8 4V4a2 2 0 0 0-2-2Z" />
      <path d="M8 6h8M8 10h5" />
    </svg>
  );
}

// 17. Checkmark
export function CheckIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

// 18. Chevron Right
export function ChevronRightIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// 19. Emergency Phone Receiver
export function PhoneIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// 20. Appointment Calendar Sheet
export function CalendarIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="8" cy="14" r="1" fill="currentColor" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
      <circle cx="16" cy="14" r="1" fill="currentColor" />
      <circle cx="8" cy="18" r="1" fill="currentColor" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

// 21. Eye Inspection Icon
export function EyeIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} className={className} {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
