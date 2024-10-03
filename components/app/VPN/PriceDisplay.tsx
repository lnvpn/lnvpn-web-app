import * as React from "react";

interface PriceDisplayProps {
  selectedDuration: number;
}

export default function PriceDisplay({ selectedDuration }: PriceDisplayProps) {
  return (
    <div className="text-2xl font-semibold">
      {`Total: $${selectedDuration.toFixed(2)}`}
    </div>
  );
}
