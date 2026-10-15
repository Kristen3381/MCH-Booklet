import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FacilityStamp } from "../components/FacilityStamp";
import { BookletMatchTag } from "../components/BookletMatchTag";
import { SyncStatusIndicator } from "../components/SyncStatusIndicator";
import { TextileBorder } from "../components/TextileBorder";

describe("Signature UI Components", () => {
  it("renders FacilityStamp with genuine inked styling and FACILITY CONFIRMED header", () => {
    const { container } = render(
      <FacilityStamp
        facilityName="Mto Mukuu Health Centre"
        date="30 SEP 2026"
        stampNumber="MMHC-405-992"
        rotation={-2}
        variant="terracotta"
      />
    );

    expect(screen.getByText("Mto Mukuu Health Centre")).toBeInTheDocument();
    expect(screen.getByText("30 SEP 2026")).toBeInTheDocument();
    expect(screen.getByText(/FACILITY CONFIRMED/)).toBeInTheDocument();
    expect(screen.getByText(/REF: MMHC-405-992/)).toBeInTheDocument();

    const stampElement = container.firstChild as HTMLElement;
    expect(stampElement.style.transform).toBe("rotate(-2deg)");
  });

  it("renders BookletMatchTag with booklet page cross reference", () => {
    render(<BookletMatchTag pageNumber={8} />);
    expect(screen.getByText("In Booklet p. 8")).toBeInTheDocument();
    expect(
      screen.getByTitle("Also recorded in your physical clinic booklet on page 8")
    ).toBeInTheDocument();
  });

  it("renders SyncStatusIndicator in synced, pending, and offline states", () => {
    const { rerender } = render(<SyncStatusIndicator state="synced" compact />);
    expect(screen.getByText("Synced")).toBeInTheDocument();

    rerender(<SyncStatusIndicator state="pending" pendingCount={3} compact />);
    expect(screen.getByText("3 Pending")).toBeInTheDocument();

    rerender(<SyncStatusIndicator state="offline" compact />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("renders TextileBorder with aria-hidden separator semantics", () => {
    render(<TextileBorder variant="primary" size="lg" />);
    const separator = screen.getByRole("separator", { hidden: true });
    expect(separator).toBeInTheDocument();
  });
});
