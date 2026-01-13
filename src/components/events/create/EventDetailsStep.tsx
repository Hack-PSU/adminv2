"use client";

import { EventFormData } from "@/app/events/createEvent/page";
import { useAllLocations } from "@/common/api/location/hook";

interface EventDetailsStepProps {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EventDetailsStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: EventDetailsStepProps) {
  const { data: locations = [], isLoading } = useAllLocations();

  const handleNext = () => {
    if (formData.name && formData.startTime && formData.endTime) {
      onNext();
    }
  };

  const isFormValid = formData.name && formData.startTime && formData.endTime;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Event Details</h2>
        <p className="text-sm text-zinc-500">Provide the basic information about your event</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-zinc-700 mb-1">
            Event Name *
          </label>
          <input
            type="text"
            id="eventName"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event name"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-zinc-700 mb-1">
            Location
          </label>
          {isLoading ? (
            <div className="text-sm text-zinc-500">Loading locations...</div>
          ) : (
            <select
              id="location"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Location --</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event description"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-zinc-700 mb-1">
              Start Date/Time *
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={formData.startTime}
              onChange={(e) => updateFormData({ startTime: e.target.value })}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-zinc-700 mb-1">
              End Date/Time *
            </label>
            <input
              type="datetime-local"
              id="endTime"
              value={formData.endTime}
              onChange={(e) => updateFormData({ endTime: e.target.value })}
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isFormValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
