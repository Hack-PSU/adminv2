"use client";

import { 
    OrganizerApplicationEntity,
    OrganizerTeam,
    ApplicationStatus
 } from "@/common/api/organizer_applications";
import { Button } from "@/components/ui/button";

interface ViewApplicationModalProps {
  application: OrganizerApplicationEntity | null;
  onClose: () => void;
  onAccept: (id: number, team: OrganizerTeam) => Promise<void>;
  onReject: (id: number, team: OrganizerTeam) => Promise<void>;
}

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "text-yellow-600";
    case ApplicationStatus.ACCEPTED:
      return "text-green-600";
    case ApplicationStatus.REJECTED:
      return "text-red-600";
    default:
      return "text-zinc-600";
  }
};

export default function ViewApplicationModal({
  application,
  onClose,
  onAccept,
  onReject,
}: ViewApplicationModalProps) {
  if (!application) return null;

  const canAcceptFirst =
    application.firstChoiceStatus === ApplicationStatus.PENDING &&
    !application.assignedTeam;

  const canAcceptSecond =
    application.firstChoiceStatus === ApplicationStatus.REJECTED &&
    application.secondChoiceStatus === ApplicationStatus.PENDING &&
    !application.assignedTeam;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Application Details</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900"
          >
            ✕
          </button>
        </div>

        {/* Personal Info */}
        <section className="space-y-2">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500">Name</p>
              <p>{application.name}</p>
            </div>
            <div>
              <p className="text-zinc-500">Email</p>
              <p>{application.email}</p>
            </div>
            <div>
              <p className="text-zinc-500">Year Standing</p>
              <p>{application.yearStanding}</p>
            </div>
            <div>
              <p className="text-zinc-500">Major</p>
              <p>{application.major}</p>
            </div>
          </div>
        </section>

        {/* Team Preferences */}
        <section className="mt-6 space-y-2">
          <h3 className="text-lg font-medium">Team Preferences</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500">First Choice</p>
              <p>{application.firstChoiceTeam}</p>
              <p className={getStatusColor(application.firstChoiceStatus)}>
                {application.firstChoiceStatus}
              </p>
            </div>
            <div>
              <p className="text-zinc-500">Second Choice</p>
              <p>{application.secondChoiceTeam}</p>
              <p className={getStatusColor(application.secondChoiceStatus)}>
                {application.secondChoiceStatus}
              </p>
            </div>
          </div>

          {application.assignedTeam && (
            <div className="mt-2 text-sm">
              <p className="text-zinc-500">Assigned Team</p>
              <p className="text-green-600">{application.assignedTeam}</p>
            </div>
          )}
        </section>

        {/* Essays */}
        <section className="mt-6 space-y-4 text-sm">
          <h3 className="text-lg font-medium">Application Essays</h3>

          <div>
            <p className="text-zinc-500">Why HackPSU?</p>
            <p className="whitespace-pre-wrap">{application.whyHackpsu}</p>
          </div>

          <div>
            <p className="text-zinc-500">New Idea</p>
            <p className="whitespace-pre-wrap">{application.newIdea}</p>
          </div>

          <div>
            <p className="text-zinc-500">What Excites You?</p>
            <p className="whitespace-pre-wrap">{application.whatExcitesYou}</p>
          </div>
        </section>

        {/* Resume */}
        <section className="mt-6 text-sm">
          <h3 className="text-lg font-medium">Resume</h3>
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Resume
          </a>
        </section>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-2">
          {canAcceptFirst && (
            <>
              <Button
                variant="default"
                onClick={async () => {
                  await onAccept(
                    application.id,
                    application.firstChoiceTeam as OrganizerTeam
                  );
                  onClose();
                }}
              >
                Accept (1st Choice)
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await onReject(
                    application.id,
                    application.firstChoiceTeam as OrganizerTeam
                  );
                  onClose();
                }}
              >
                Reject (1st Choice)
              </Button>
            </>
          )}

          {canAcceptSecond && (
            <>
              <Button
                variant="default"
                onClick={async () => {
                  await onAccept(
                    application.id,
                    application.secondChoiceTeam as OrganizerTeam
                  );
                  onClose();
                }}
              >
                Accept (2nd Choice)
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await onReject(
                    application.id,
                    application.secondChoiceTeam as OrganizerTeam
                  );
                  onClose();
                }}
              >
                Reject (2nd Choice)
              </Button>
            </>
          )}

          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}