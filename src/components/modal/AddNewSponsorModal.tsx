"use client";

import { 
  Controller, 
  FormProvider, 
  useForm 
} from "react-hook-form";
import { useCreateSponsor } from "@/common/api/sponsor/hook";
import Select from "react-select";
import { Button } from "../ui/button";
import Dropzone from "../ui/dropzone";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

interface AddSponsorshipProps {
    totalSponsors: number;
    closeModal: () => void;
}

enum SponsorLevels { 
  BRONZE = "bronze", 
  SILVER = "silver", 
  GOLD = "gold", 
  PLATINUM = "platinum", 
  EMERALD = "emerald" 
};

interface SponsorOption {
  value: SponsorLevels,
  label: string,
}

const SponsorLevelOptions: SponsorOption[] = [
  { value: SponsorLevels.BRONZE, label: "Bronze"},
  { value: SponsorLevels.SILVER, label: "Silver"},
  { value: SponsorLevels.GOLD, label: "Gold"},
  { value: SponsorLevels.PLATINUM, label: "Platinum"},
  { value: SponsorLevels.EMERALD, label: "Emerald"},
]

interface IFormInput {
  name: string,
  level: SponsorOption,
  website: string,
  lightLogo: File | null,
  darkLogo: File | null,
  order: number
}

export default function AddNewSponsorModal({
  totalSponsors,
  closeModal
}: AddSponsorshipProps) {
    const methods = useForm<IFormInput>({
      defaultValues: {
        name: "",
        level: { value: SponsorLevels.GOLD, label: "Gold"} as SponsorOption,
        website: "",
        lightLogo: null,
        darkLogo: null,
        order: totalSponsors
      }
    });
    const createSponsorMutation = useCreateSponsor();
    const isCreating = createSponsorMutation.isPending;
    const { register, control, watch, handleSubmit, setValue } = methods;

    useEffect(() => {
      setValue("order", totalSponsors);
    }, [setValue, totalSponsors]);

    // Watch the form values
    const name = watch("name");
    const website = watch("website");
    const lightLogo = watch("lightLogo");
    const darkLogo = watch("darkLogo");

    const { mutateAsync } = useMutation({
      mutationFn: (data: IFormInput) => {
        
      }
    })

    const handleAddSponsorship = async(data: IFormInput) => {
      if (!name.trim() || !website.trim() || (!lightLogo && !darkLogo)) return;
      
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("level", data.level.value);
      formData.append("link", data.website);
      if (data.lightLogo) formData.append("lightLogo", data.lightLogo);
      if (data.darkLogo) formData.append("darkLogo", data.darkLogo);

      await createSponsorMutation.mutateAsync(formData)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl space-y-4 rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Add Sponsor
                </h2>
                <p className="text-sm text-zinc-500">
                  Add a new sponsor to this event.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={closeModal}
                className="px-2 py-1"
              >
                Close
              </Button>
            </div>
            <FormProvider {...methods} >
              <form onSubmit={handleSubmit(handleAddSponsorship)} className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 items-center sm:justify-between sm:flex-row">
                  <div className="w-full space-y-1">
                    <label className="text-sm font-medium text-zinc-800">Name</label>
                    <input
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter sponsor's name"
                      {...register("name")} 
                    />
                  </div>

                  <div className="w-full space-y-1">
                    <label className="text-sm font-medium text-zinc-800">Level</label>
                    <Controller
                      name="level"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          className="text-sm"
                          {...field}
                          options={SponsorLevelOptions}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-full space-y-1">
                  <label className="text-sm font-medium text-zinc-800">Website</label>
                    <input
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter website name"
                      {...register("website")} 
                    />
                </div>
                <div className="flex flex-col gap-3 items-center sm:justify-between sm:flex-row">
                  <div className="w-full space-y-1">
                    <label className="text-sm font-medium text-zinc-800">Light Logo</label>
                    <Dropzone 
                      name="lightLogo" 
                      control={control} 
                      rules={{
                        validate: (value) => {
                          if (!darkLogo && !value) { return false; }
                          return true;
                        }
                      }} 
                    />
                  </div>

                  <div className="w-full space-y-1">
                    <label className="text-sm font-medium text-zinc-800">Dark Logo</label>
                    <Dropzone 
                      name="darkLogo" 
                      control={control} 
                      rules={{
                        validate: (value) => {
                          if (!darkLogo && !value) { return false; }
                          return true;
                        }
                      }} 
                      />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit" 
                    disabled={
                      isCreating || !name.trim() || !website.trim() || (!lightLogo && !darkLogo)
                    }
                  >
                    {isCreating ? "Adding..." : "Add Sponsor"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
    )
}