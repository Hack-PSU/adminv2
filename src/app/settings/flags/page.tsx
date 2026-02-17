"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import { useAllFlags, usePatchFlags } from "@/common/api/flag/hook";
import { FlagEntity } from "@/common/api/flag/entity";

export default function FlagsSettingsPage() {
  const { data: flags = [], refetch } = useAllFlags();
  const patchFlags = usePatchFlags();

  const columns: DataTableColumn<FlagEntity>[] = [
    {
      accessorKey: "name",
      header: "Flag Name",
      editable: false,
      type: "text",
    },
    {
      accessorKey: "isEnabled",
      header: "Enabled",
      editable: true,
      cell: (value, row, onChange) => {
        const isEnabled = typeof value === "string" ? value === "true" : value;
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => onChange?.(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Info",
      editable: false,
      cell: (value) => (
        <div className="group relative flex items-center justify-center w-8">
          {/* Info Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-zinc-400 hover:text-blue-500 cursor-help"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>

          {/* Tooltip Popup */}
          {value && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden w-48 p-2 bg-zinc-800 text-white text-xs rounded shadow-lg group-hover:block z-50 pointer-events-none">
              {value}
              {/* Arrow/Triangle pointing down */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleSave = async (updated: FlagEntity[]) => {
    await patchFlags.mutateAsync({
      flags: updated.map((f) => ({
        name: f.name,
        isEnabled:
          typeof f.isEnabled === "string"
            ? f.isEnabled === "true"
            : f.isEnabled,
      })),
    });

    await refetch();
  };

  return (
    <DataTable
      data={flags}
      columns={columns}
      onSave={handleSave}
      onRefresh={async () => {
          await refetch();
        }}
    />
  );
}
