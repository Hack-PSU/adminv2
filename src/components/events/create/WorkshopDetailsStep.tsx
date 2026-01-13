"use client";

import { useState } from "react";
import { EventFormData } from "@/app/events/createEvent/page";
import { EventType } from "@/common/api/event/entity";

interface WorkshopDetailsStepProps {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function WorkshopDetailsStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: WorkshopDetailsStepProps) {
  const [urlInput, setUrlInput] = useState("");

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      updateFormData({
        wsUrls: [...formData.wsUrls, urlInput.trim()],
      });
      setUrlInput("");
    }
  };

  const handleRemoveUrl = (index: number) => {
    const newUrls = formData.wsUrls.filter((_, i) => i !== index);
    updateFormData({ wsUrls: newUrls });
  };

  const handleNext = () => {
    onNext();
  };

  // Skip this step if not a workshop
  if (formData.type !== EventType.workshop) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Workshop Details</h2>
          <p className="text-sm text-zinc-500">
            This step is only required for workshop events. Skipping to next step.
          </p>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Workshop Details</h2>
        <p className="text-sm text-zinc-500">Provide additional information for this workshop</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="presenterNames" className="block text-sm font-medium text-zinc-700 mb-1">
            Presenter Names
          </label>
          <input
            type="text"
            id="presenterNames"
            value={formData.wsPresenterNames}
            onChange={(e) => updateFormData({ wsPresenterNames: e.target.value })}
            className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., John Doe, Jane Smith"
          />
        </div>

        <div>
          <label htmlFor="skillLevel" className="block text-sm font-medium text-zinc-700 mb-1">
            Skill Level
          </label>
          <select
            id="skillLevel"
            value={formData.wsSkillLevel}
            onChange={(e) => updateFormData({ wsSkillLevel: e.target.value })}
            className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Skill Level --</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all">All Levels</option>
          </select>
        </div>

        <div>
          <label htmlFor="relevantSkills" className="block text-sm font-medium text-zinc-700 mb-1">
            Relevant Skills
          </label>
          <input
            type="text"
            id="relevantSkills"
            value={formData.wsRelevantSkills}
            onChange={(e) => updateFormData({ wsRelevantSkills: e.target.value })}
            className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Python, Machine Learning, Web Development"
          />
        </div>

        <div>
          <label htmlFor="workshopUrl" className="block text-sm font-medium text-zinc-700 mb-1">
            Workshop URLs
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              id="workshopUrl"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddUrl()}
              className="flex-1 px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/workshop"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200"
            >
              Add
            </button>
          </div>
          {formData.wsUrls.length > 0 && (
            <ul className="mt-3 space-y-2">
              {formData.wsUrls.map((url, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-zinc-50 rounded-lg"
                >
                  <span className="text-sm text-zinc-700 truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(index)}
                    className="ml-2 text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
