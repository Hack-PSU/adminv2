"use client";

import { DataTable, DataTableColumn } from "@/components/table";
import {
  useAllUsers,
  useDeleteUser,
  useUpdateUser,
} from "@/common/api/user/hook";
import { UserEntity } from "@/common/api/user/entity";

export default function HackersPage() {
  const { data: users = [], isLoading, refetch } = useAllUsers();
  const deleteUserMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();

  // Define columns - all static (not editable)
  const columns: DataTableColumn<UserEntity>[] = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: (value, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "university",
      header: "University",
    },
  ];

  const handleSave = async (data: UserEntity[]) => {
    // Since columns are static, this won't be used much
    // But we can implement it for future editable columns
    console.log("Save called with data:", data);
    // If you need to save updates, you would call updateUserMutation here
  };

  const handleDelete = async (ids: Array<string | number>) => {
    // Delete all selected users
    await Promise.all(
      ids.map((id) => deleteUserMutation.mutateAsync(String(id))),
    );
    // Refresh the list after deletion
    await refetch();
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">Hackers</h1>
          <p className="text-sm text-zinc-500">
            Manage hacker registrations, statuses, and communications from this
            workspace.
          </p>
        </header>
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-500">Loading hackers...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Hackers</h1>
        <p className="text-sm text-zinc-500">
          Manage hacker registrations, statuses, and communications from this
          workspace.
        </p>
      </header>
      <DataTable
        data={users}
        columns={columns}
        onSave={handleSave}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        idField="id"
      />
    </section>
  );
}
