"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventTypeStep } from "@/components/events/create/EventTypeStep";
import { EventDetailsStep } from "@/components/events/create/EventDetailsStep";
import { WorkshopDetailsStep } from "@/components/events/create/WorkshopDetailsStep";
import { IconUploadStep } from "@/components/events/create/IconUploadStep";
import { ReviewStep } from "@/components/events/create/ReviewStep";
import { EventType } from "@/common/api/event/entity";
import { useCreateEvent } from "@/common/api/event/hook";

export interface EventFormData {
  // Event type
  type: EventType | "";
  
  // Event details
  name: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  
  // Workshop details
  wsPresenterNames: string;
  wsSkillLevel: string;
  wsRelevantSkills: string;
  wsUrls: string[];
  
  // Icon
  icon: File | null;
}

const INITIAL_FORM_DATA: EventFormData = {
  type: "",
  name: "",
  location: "",
  description: "",
  startTime: "",
  endTime: "",
  wsPresenterNames: "",
  wsSkillLevel: "",
  wsRelevantSkills: "",
  wsUrls: [],
  icon: null,
};

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EventFormData>(INITIAL_FORM_DATA);
  const createEventMutation = useCreateEvent();

  const steps = [
    { title: "Event Type", component: EventTypeStep },
    { title: "Event Details", component: EventDetailsStep },
    { title: "Workshop Details", component: WorkshopDetailsStep },
    { title: "Event Icon", component: IconUploadStep },
    { title: "Review", component: ReviewStep },
  ];

  const updateFormData = (data: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("type", formData.type);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("locationId", formData.location);
      formDataToSubmit.append("startTime", new Date(formData.startTime).getTime().toString());
      formDataToSubmit.append("endTime", new Date(formData.endTime).getTime().toString());
      
      // Workshop details (only if workshop type)
      if (formData.type === EventType.workshop) {
        formDataToSubmit.append("wsPresenterNames", formData.wsPresenterNames);
        formDataToSubmit.append("wsSkillLevel", formData.wsSkillLevel);
        formDataToSubmit.append("wsRelevantSkills", formData.wsRelevantSkills);
        formData.wsUrls.forEach((url) => {
          formDataToSubmit.append("wsUrls[]", url);
        });
      }
      
      // Icon
      if (formData.icon) {
        formDataToSubmit.append("icon", formData.icon);
      }

      await createEventMutation.mutateAsync(formDataToSubmit);
      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <section className="space-y-6 max-w-4xl mx-auto py-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Create New Event</h1>
        <p className="text-sm text-zinc-500">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </p>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-zinc-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Current step content */}
      <div className="bg-white rounded-lg shadow p-6">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
          isSubmitting={createEventMutation.isPending}
        />
      </div>
    </section>
  );
}