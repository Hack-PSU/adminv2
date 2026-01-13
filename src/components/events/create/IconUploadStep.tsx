"use client";

import { useRef, useState } from "react";
import { EventFormData } from "@/app/events/createEvent/page";

interface IconUploadStepProps {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function IconUploadStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: IconUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    updateFormData({ icon: file });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    updateFormData({ icon: null });
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Event Icon</h2>
        <p className="text-sm text-zinc-500">Upload an icon for your event (optional)</p>
      </div>

      <div className="space-y-4">
        {!preview ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-12
              flex flex-col items-center justify-center
              cursor-pointer transition-colors
              ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100"
              }
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              className="w-16 h-16 text-zinc-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-base font-medium text-zinc-700 mb-1">
              Drag and drop your icon here
            </p>
            <p className="text-sm text-zinc-500">or click to browse files</p>
            <p className="text-xs text-zinc-400 mt-2">Supported formats: PNG, JPG, SVG</p>
          </div>
        ) : (
          <div className="border border-zinc-300 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <img
                src={preview}
                alt="Icon preview"
                className="w-24 h-24 object-contain rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-zinc-700">{formData.icon?.name}</p>
                <p className="text-sm text-zinc-500">
                  {formData.icon && (formData.icon.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
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
