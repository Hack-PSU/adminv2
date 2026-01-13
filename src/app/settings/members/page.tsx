"use client";

import React, { useMemo, useState } from "react";
import {
  OrganizerEntity,
  Role,
  useAllOrganizers,
  useUpdateOrganizer,
  useDeleteOrganizer,
  useCreateOrganizer,
} from "@/common/api/organizer";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

function roleLabel(role: Role) {
  switch (role) {
    case Role.NONE:
      return "None";
    case Role.VOLUNTEER:
      return "Volunteer";
    case Role.TEAM:
      return "Team Member";
    case Role.EXEC:
      return "Exec";
    case Role.TECH:
      return "Tech";
    case Role.FINANCE:
      return "Finance";
    default:
      return String(role);
  }
}

const roleOptions = [
  { label: roleLabel(Role.NONE), value: Role.NONE },
  { label: roleLabel(Role.VOLUNTEER), value: Role.VOLUNTEER },
  { label: roleLabel(Role.TEAM), value: Role.TEAM },
  { label: roleLabel(Role.EXEC), value: Role.EXEC },
  { label: roleLabel(Role.TECH), value: Role.TECH },
  { label: roleLabel(Role.FINANCE), value: Role.FINANCE },
];

function groupBy<T>(arr: T[], keyFn: (item: T) => string) {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = keyFn(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}

export default function MembersSettingsPage() {
  const { data, refetch, isFetching } = useAllOrganizers();
  const organizers = data ?? []; 

  const updateOrganizer = useUpdateOrganizer();
  const deleteOrganizer = useDeleteOrganizer();
  const createOrganizer = useCreateOrganizer();

  const [isWorking, setIsWorking] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());


  const [draft, setDraft] = useState<OrganizerEntity[]>([]);

  React.useEffect(() => {
    if (!data) return;     
    setDraft((prev) => (prev.length === 0 ? data : prev));
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return draft;
    return draft.filter((o) => {
      const name = `${o.firstName ?? ""} ${o.lastName ?? ""}`.toLowerCase();
      const email = (o.email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [draft, search]);

const grouped = useMemo(() => {
  return groupBy(filtered, (o) => roleLabel(o.privilege));
}, [filtered]);

  const divisionNames = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    const visibleIds = filtered.map((o) => String(o.id));
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const setPrivilege = (id: string, privilege: Role) => {
    setDraft((prev) =>
      prev.map((o) => (String(o.id) === id ? { ...o, privilege } : o)),
    );
  };

  const onRefresh = async () => {
    await refetch();
    setSelected(new Set());
  };

  const onSave = async () => {
    setIsWorking(true);
    try {
      const originalById = new Map(organizers.map((o) => [String(o.id), o]));

      for (const row of draft) {
        const original = originalById.get(String(row.id));
        if (!original) continue;

        const newPrivilege =
          typeof row.privilege === "string"
            ? (Number(row.privilege) as Role)
            : (row.privilege as Role);

        if (original.privilege !== newPrivilege) {
          await updateOrganizer.mutateAsync({
            id: String(row.id),
            data: { privilege: newPrivilege },
          });
        }
      }

      await refetch();
    } finally {
      setIsWorking(false);
    }
  };

  const onDeleteSelected = async () => {
    if (selected.size === 0) return;
    setIsWorking(true);
    try {
      for (const id of selected) {
        await deleteOrganizer.mutateAsync(id);
      }
      await refetch();
      setSelected(new Set());
    } finally {
      setIsWorking(false);
    }
  };

  const onAddMember = async () => {
    const email = prompt("Enter member email:");
    if (!email) return;

    const firstName = prompt("First name:") ?? "";
    const lastName = prompt("Last name:") ?? "";

    setIsWorking(true);
    try {
      await createOrganizer.mutateAsync({
        email,
        firstName,
        lastName,
        privilege: Role.TEAM,
      });
      await refetch();
    } finally {
      setIsWorking(false);
    }
  };

  const onExportCsv = () => {
    const rows = organizers.map((o) => ({
      name: `${o.firstName} ${o.lastName}`.trim(),
      email: o.email,
      permission: roleLabel(o.privilege),
    }));

    const header = ["Name", "Email", "Permission"];
const csv = [
  header.join(","),
  ...rows.map((r) =>
    [r.name, r.email, r.permission]
      .map((x) => `"${String(x).replaceAll('"', '""')}"`)
      .join(","),
  ),
].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleIds = filtered.map((o) => String(o.id));
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  return (
    <div className="space-y-4">
      {/* Toolbar matches old layout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="w-full rounded-md border border-zinc-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onRefresh} disabled={isWorking || isFetching} variant="outline">
            <RefreshCw className={cn("mr-2 h-4 w-4", (isWorking || isFetching) && "animate-spin")} />
            Refresh
          </Button>

          <Button onClick={onExportCsv} disabled={organizers.length === 0} variant="outline">
            Export CSV
          </Button>

          <Button onClick={onAddMember} disabled={isWorking}>
            Add Member
          </Button>

          <Button onClick={onSave} disabled={isWorking} variant="default">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>

          <Button
            onClick={onDeleteSelected}
            disabled={isWorking || selected.size === 0}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selected.size})
          </Button>
        </div>
      </div>

      {/* Grouped table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-zinc-50">
            <tr>
              <th className="border-b border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="border-b border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                Name
              </th>
              <th className="border-b border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                Email
              </th>
              <th className="border-b border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                Permission
              </th>
            </tr>
          </thead>

          <tbody>
            {divisionNames.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No data available
                </td>
              </tr>
            ) : (
              divisionNames.map((division) => {
                const rows = grouped[division] ?? [];
                return (
                  <React.Fragment key={division}>
                    {/* Division section header */}
                    <tr className="bg-zinc-50">
                      <td colSpan={4} className="border-t border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900">
                        {division} ({rows.length} members)
                      </td>
                    </tr>

                    {rows.map((o) => {
                      const id = String(o.id);
                      return (
                        <tr key={id} className="border-t border-zinc-200 hover:bg-zinc-50">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selected.has(id)}
                              onChange={() => toggleRow(id)}
                              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-zinc-900">
                            {`${o.firstName ?? ""} ${o.lastName ?? ""}`.trim()}
                          </td>
                          <td className="px-4 py-3 text-sm text-zinc-900">{o.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={String(o.privilege)}
                              onChange={(e) => setPrivilege(id, Number(e.target.value) as Role)}
                              className="h-10 w-full max-w-xs rounded-full border border-zinc-200 bg-white px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {roleOptions.map((opt) => (
                                <option key={String(opt.value)} value={String(opt.value)}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
