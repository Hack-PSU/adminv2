"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ViewParticipantApplicationModalProps {
  application: Record<string, any> | null;
  onClose: () => void;
  onAccept: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
  onWaitlist?: (id: number) => Promise<void>;
}

export default function ViewParticipantApplicationModal({
  application,
  onClose,
  onAccept,
  onReject,
  onWaitlist,
}: ViewParticipantApplicationModalProps) {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isWaitlistLoading, setIsWaitlistLoading] = useState(false);

  if (!application) return null;

  const isPending = application.applicationStatus === "pending";

  const handleAccept = async () => {
    setIsAcceptLoading(true);
    try {
      await onAccept(application.userId);
      onClose();
    } finally {
      setIsAcceptLoading(false);
    }
  };

  const handleReject = async () => {
    setIsRejectLoading(true);
    try {
      await onReject(application.userId);
      onClose();
    } finally {
      setIsRejectLoading(false);
    }
  };

  const handleWaitlist = async () => {
    if (!onWaitlist) return;
    setIsWaitlistLoading(true);
    try {
      await onWaitlist(application.userId);
      onClose();
    } finally {
      setIsWaitlistLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Application Details</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900"
          >
            ✕
          </button>
        </div>

        {/* Personal Information */}
        <section className="mb-6 space-y-2">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {["firstName", "lastName", "age", "email"].map((key) => (
              application[key] !== undefined && (
                <div key={key}>
                  <p className="text-zinc-500">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </p>
                  <p>{String(application[key])}</p>
                </div>
              )
            ))}
          </div>
        </section>

        {/* Education Information */}
        <section className="mb-6 space-y-2">
          <h3 className="text-lg font-medium">Education</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              "university",
              "educationalInstitutionType",
              "major",
              "academicYear",
            ].map((key) => (
              application[key] !== undefined && (
                <div key={key}>
                  <p className="text-zinc-500">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </p>
                  <p>{String(application[key])}</p>
                </div>
              )
            ))}
          </div>
        </section>

        {/* Hackathon Information */}
        <section className="mb-6 space-y-2">
          <h3 className="text-lg font-medium">Hackathon Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              "firstHackathon",
              "codingExperience",
              "veteran",
              "referral",
              "expectations",
              "project",
            ].map((key) => (
              application[key] !== undefined && (
                <div key={key}>
                  <p className="text-zinc-500">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </p>
                  <p>
                    {typeof application[key] === "boolean"
                      ? application[key]
                        ? "Yes"
                        : "No"
                      : String(application[key])}
                  </p>
                </div>
              )
            ))}
          </div>
        </section>

        {/* Travel Information */}
        <section className="mb-6 space-y-2">
          <h3 className="text-lg font-medium">Travel</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {["driving", "travelReimbursement", "travelCost", "country"].map(
              (key) => (
                application[key] !== undefined && (
                  <div key={key}>
                    <p className="text-zinc-500">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </p>
                    <p>
                      {typeof application[key] === "boolean"
                        ? application[key]
                          ? "Yes"
                          : "No"
                        : String(application[key])}
                    </p>
                  </div>
                )
              )
            )}
          </div>
        </section>

        {/* Scoring Information */}
        <section className="mb-6 space-y-2">
          <h3 className="text-lg font-medium">Scoring</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {["mu", "sigmaSquared", "prioritized", "applicationStatus"].map(
              (key) => (
                application[key] !== undefined && (
                  <div key={key}>
                    <p className="text-zinc-500">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </p>
                    <p>
                      {typeof application[key] === "boolean"
                        ? application[key]
                          ? "Yes"
                          : "No"
                        : typeof application[key] === "number"
                          ? application[key].toFixed(2)
                          : String(application[key])}
                    </p>
                  </div>
                )
              )
            )}
          </div>
        </section>

        {/* Status Info */}
        {!isPending && (
          <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
            <p className="text-sm text-yellow-800">
              This application cannot be updated because its status is <span className="font-semibold">{application.applicationStatus}</span>. Only pending applications can be updated.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          {onWaitlist && (
            <Button
              onClick={handleWaitlist}
              disabled={isWaitlistLoading || !isPending}
              title={!isPending ? "Can only update pending applications" : ""}
              className="bg-yellow-500 hover:bg-yellow-600 text-white disabled:bg-zinc-300 disabled:cursor-not-allowed"
            >
              {isWaitlistLoading ? "Waitlisting..." : "Waitlist"}
            </Button>
          )}
          <Button
            onClick={handleReject}
            disabled={isRejectLoading || !isPending}
            title={!isPending ? "Can only update pending applications" : ""}
            className="bg-red-500 hover:bg-red-600 text-white disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {isRejectLoading ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isAcceptLoading || !isPending}
            title={!isPending ? "Can only update pending applications" : ""}
            className="bg-green-500 hover:bg-green-600 text-white disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {isAcceptLoading ? "Accepting..." : "Accept"}
          </Button>
        </div>
      </div>
    </div>
  );
}
