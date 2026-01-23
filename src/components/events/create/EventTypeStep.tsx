"use client";

import { EventFormData } from "@/app/events/create/page";
import { EventType } from "@/common/api/event/entity";

interface EventTypeStepProps {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
}

export function EventTypeStep({
  formData,
  updateFormData,
  onNext,
  onBack,
  isFirstStep,
}: EventTypeStepProps) {
  const handleNext = () => {
    if (formData.type) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Select Event Type</h2>
        <p className="text-sm text-zinc-500">Choose the type of event you want to create</p>
      </div>

      <div className="space-y-3">
        <label htmlFor="eventType" className="block text-sm font-medium text-zinc-700">
          Event Type *
        </label>
        <select
          id="eventType"
          value={formData.type}
          onChange={(e) => updateFormData({ type: e.target.value as EventType })}
          className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Select Event Type --</option>
          <option value={EventType.activity}>Activity</option>
          <option value={EventType.food}>Food</option>
          <option value={EventType.workshop}>Workshop</option>
          <option value={EventType.checkIn}>Check-in</option>
        </select>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirstStep}
          className="px-6 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!formData.type}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
