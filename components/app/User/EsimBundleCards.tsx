"use client";
import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

interface EsimBundleAssignment {
  id: string;
  callTypeGroup: string;
  initialQuantity: number;
  remainingQuantity: number;
  startTime?: string;
  endTime?: string;
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
  const [showInactive, setShowInactive] = useState(false);

  // 1. Flatten so each assignment is now its own "bundle" for display.
  const allAssignments = useMemo(() => {
    return bundles.flatMap((b) =>
      b.assignments.map((assignment) => ({
        // "clone" the bundle fields but store only this single assignment
        ...b,
        assignments: [assignment],
      }))
    );
  }, [bundles]);

  // 2. Filter out if user doesn't want inactive assignments
  const filtered = useMemo(() => {
    if (showInactive) {
      return allAssignments;
    }
    // only keep items that have an assignment with bundleState === "active"
    return allAssignments.filter((b) =>
      b.assignments.some((a) => a.bundleState === "active")
    );
  }, [allAssignments, showInactive]);

  const hasBundles = filtered.length > 0;

  return (
    <section className="space-y-4">
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

      {!hasBundles && (
        <div className="p-4 text-center">
          <p className="mb-2">
            No {showInactive ? "bundles" : "active bundles"} found.
          </p>
        </div>
      )}

      {hasBundles && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <BundleCard
              key={b.assignments[0].id} // each flattened item has exactly 1 assignment
              bundle={b}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// Each card now displays exactly one assignment
function BundleCard({ bundle }: { bundle: EsimBundle }) {
  const { description, assignments } = bundle;
  const assignment = assignments[0];

  if (!assignment) return null; // should not happen, but just in case

  // Helper to format date
  function formatDateTime(date: string | undefined): string {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  }

  // Calculate data usage
  const isUnlimited = assignment.unlimited;
  const initialMB = assignment.initialQuantity / (1000 * 1000);
  const remainingMB = assignment.remainingQuantity / (1000 * 1000);
  const progress = initialMB > 0 ? (remainingMB / initialMB) * 100 : 0;

  // Calculate days left
  const now = Date.now();
  let daysRemaining: string | number = "Not activated";
  if (assignment.endTime) {
    const endTime = new Date(assignment.endTime).getTime();
    const diffMs = endTime - now;
    daysRemaining = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

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
          <li>Start: {formatDateTime(assignment.startTime)}</li>
          <li>End: {formatDateTime(assignment.endTime)}</li>

          {!isUnlimited && (
            <>
              <Progress value={progress} className="w-full my-2" />
              <li>
                Data Remaining: <strong>{remainingMB.toFixed(2)} MB</strong>
              </li>
            </>
          )}

          <li>
            Days Remaining:{" "}
            <strong>
              {typeof daysRemaining === "number"
                ? `${daysRemaining} day(s)`
                : daysRemaining}
            </strong>
          </li>
        </ul>

        {/* Show this notice if the bundle is still inactive */}
        {assignment.bundleState === "queued" && (
          <p className="text-xs text-gray-500 mt-2">
            This bundle will activate once you connect to the mobile service in
            the assigned country.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
