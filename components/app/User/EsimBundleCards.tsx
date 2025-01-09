"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

// These types match your data structure
interface EsimBundleAssignment {
  id: string;
  callTypeGroup: string;
  initialQuantity: number;
  remainingQuantity: number;
  startTime: string;
  endTime: string;
  assignmentDateTime: string;
  assignmentReference: string;
  bundleState: "active" | "inactive" | string;
  unlimited: boolean;
}

interface EsimBundle {
  name: string;
  description: string;
  assignments: EsimBundleAssignment[];
}

interface EsimBundlesClientProps {
  bundles: EsimBundle[];
  iccid: string;
}

export function EsimBundlesCards({ bundles }: EsimBundlesClientProps) {
  // Checkbox state
  const [showInactive, setShowInactive] = useState(false);

  // 1. We filter the bundles based on the assignment states
  //    Usually “active” means we only show ones that have an assignment with bundleState=active
  //    If showInactive is false, we exclude those with only “inactive”
  const filteredBundles = useMemo(() => {
    if (showInactive) {
      return bundles;
    } else {
      return bundles.filter((b) =>
        b.assignments.some((a) => a.bundleState === "active")
      );
    }
  }, [bundles, showInactive]);

  // 2. If no bundles are found (based on the filter), user can “Buy Bundle”
  const hasBundles = filteredBundles.length > 0;

  return (
    <section className="space-y-4">
      {/* Title / Check Inactive */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold">Your Bundles</h2>
        <div className="flex items-center space-x-2 ml-auto">
          <Checkbox
            checked={showInactive}
            onCheckedChange={(checked) => setShowInactive(Boolean(checked))}
            id="showInactive"
          />
          <label
            htmlFor="showInactive"
            className="text-sm text-black dark:text-white"
          >
            Show Inactive Bundles
          </label>
        </div>
      </div>

      {/* If no bundles (after filter), show a "Buy Bundle" button */}
      {!hasBundles && (
        <div className="p-4 text-center">
          <p className="mb-2">
            No {showInactive ? "bundles" : "active bundles"} found.
          </p>
        </div>
      )}

      {/* If we do have bundles, map them */}
      {hasBundles && (
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          {filteredBundles.map((b) => (
            <BundleCard key={b.name} bundle={b} />
          ))}
        </div>
      )}
    </section>
  );
}

// We can extract a subcomponent for each bundle card
function BundleCard({ bundle }: { bundle: EsimBundle }) {
  const { description, assignments } = bundle;

  // Get the first assignment
  const assignment = assignments[0];
  if (!assignment) {
    return null;
  }

  // Handle endTime
  const now = new Date().getTime();
  const endTime = assignment.endTime
    ? new Date(assignment.endTime).getTime()
    : null;

  let remainingDays: string | number = "Not activated";
  if (endTime) {
    const remainingMs = endTime - now;
    remainingDays = Math.max(
      0,
      Math.floor(remainingMs / (1000 * 60 * 60 * 24))
    );
  }

  function formatExpiryDateForDisplay(date: Date | string | null): string {
    if (!date) return "-"; // Handle null or undefined input

    // Convert string to Date if necessary
    const validDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(validDate.getTime())) return "Invalid date"; // Handle invalid date

    const year = validDate.getUTCFullYear();
    const month = String(validDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(validDate.getUTCDate()).padStart(2, "0");
    const hours = String(validDate.getUTCHours()).padStart(2, "0");
    const minutes = String(validDate.getUTCMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  }

  // Data in MB/GB
  const initialMB = assignment.initialQuantity / (1024 * 1024); // Convert to MB
  const remainingMB = assignment.remainingQuantity / (1024 * 1024);
  const progress = initialMB > 0 ? (remainingMB / initialMB) * 100 : 0;

  // If unlimited, skip showing progress
  const isUnlimited = assignment.unlimited;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{description}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-1">
          <li>
            State: <strong>{assignment.bundleState}</strong>
          </li>

          <li>
            Start Time: {formatExpiryDateForDisplay(assignment.startTime)}
          </li>
          <li>End Time: {formatExpiryDateForDisplay(assignment.endTime)}</li>

          {!isUnlimited && (
            <>
              <Progress value={progress} className="w-full" />
              <li>
                Data Remaining: <strong>{remainingMB.toFixed(2)} MB</strong>
              </li>
            </>
          )}
          <li>
            Days Remaining:{" "}
            <strong>
              {typeof remainingDays === "number"
                ? `${remainingDays} day(s)`
                : remainingDays}
            </strong>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
