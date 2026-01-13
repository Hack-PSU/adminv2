"use client";

import { EventFormData } from "@/app/events/createEvent/page";
import { EventType } from "@/common/api/event/entity";

interface ReviewStepProps {
  formData: EventFormData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReviewStep({
  formData,
  onBack,
  onSubmit,
  isSubmitting,
}: ReviewStepProps) {
  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "Not set";
    return new Date(dateTimeStr).toLocaleString();
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case EventType.activity:
        return "Activity";
      case EventType.food:
        return "Food";
      case EventType.workshop:
        return "Workshop";
      case EventType.checkIn:
        return "Check-in";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Review Your Event</h2>
        <p className="text-sm text-zinc-500">
          Please review all the information before creating the event
        </p>
      </div>

      <div className="space-y-6 bg-zinc-50 rounded-lg p-6">
        {/* Event Type */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase mb-2">Event Type</h3>
          <p className="text-base text-zinc-900">{getEventTypeLabel(formData.type)}</p>
        </div>

        {/* Event Details */}
        <div className="border-t border-zinc-200 pt-4">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase mb-3">Event Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-zinc-500">Name</p>
              <p className="text-base text-zinc-900">{formData.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Location</p>
              <p className="text-base text-zinc-900">{formData.location || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Description</p>
              <p className="text-base text-zinc-900">
                {formData.description || "No description provided"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-zinc-500">Start Time</p>
                <p className="text-base text-zinc-900">{formatDateTime(formData.startTime)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">End Time</p>
                <p className="text-base text-zinc-900">{formatDateTime(formData.endTime)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Details (if workshop) */}
        {formData.type === EventType.workshop && (
          <div className="border-t border-zinc-200 pt-4">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase mb-3">
              Workshop Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-zinc-500">Presenter Names</p>
                <p className="text-base text-zinc-900">
                  {formData.wsPresenterNames || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Skill Level</p>
                <p className="text-base text-zinc-900 capitalize">
                  {formData.wsSkillLevel || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Relevant Skills</p>
                <p className="text-base text-zinc-900">
                  {formData.wsRelevantSkills || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Workshop URLs</p>
                {formData.wsUrls.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {formData.wsUrls.map((url, index) => (
                      <li key={index} className="text-base text-blue-600 truncate">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-base text-zinc-900">No URLs added</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Icon */}
        <div className="border-t border-zinc-200 pt-4">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase mb-3">Event Icon</h3>
          {formData.icon ? (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded border border-zinc-200 flex items-center justify-center">
                <img
                  src={URL.createObjectURL(formData.icon)}
                  alt="Event icon"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <p className="text-sm text-zinc-700">{formData.icon.name}</p>
            </div>
          ) : (
            <p className="text-base text-zinc-900">No icon uploaded</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            "Create Event"
          )}
        </button>
      </div>
    </div>
  );
}
