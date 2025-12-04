# DataTable Component

A reusable, feature-rich table component for displaying and managing data.

## Features

- ✅ **Pagination**: Navigate through data with customizable page sizes (10, 25, 50, 100)
- ✅ **Sorting**: Sort by any column (alphabetically or numerically, ascending/descending) - sorts all data, not just current page
- ✅ **Search**: Global search that filters data starting with the search string
- ✅ **Editable Cells**: Configure columns to be editable (text, number, or select inputs) or static (read-only)
- ✅ **Row Selection**: Checkboxes for selecting individual rows or all rows
- ✅ **Actions**: Save, Delete, and Refresh buttons
- ✅ **Responsive**: Mobile-friendly design

## Usage

```tsx
import { DataTable, DataTableColumn } from "@/components/table";

interface Location {
  id: number;
  name: string;
  capacity: number;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);

  // Define columns
  const columns: DataTableColumn<Location>[] = [
    {
      accessorKey: "name",
      header: "Location Name",
      editable: true, // Users can edit this field
      type: "text",
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      editable: true,
      type: "number",
    },
  ];

  // Handle save
  const handleSave = async (data: Location[]) => {
    // Send updated data to your API
    await api.locations.updateAll(data);
  };

  // Handle delete
  const handleDelete = async (ids: number[]) => {
    // Delete selected items
    await api.locations.deleteMany(ids);
  };

  // Handle refresh
  const handleRefresh = async () => {
    // Fetch fresh data from API
    const freshData = await api.locations.getAll();
    setLocations(freshData);
  };

  return (
    <DataTable
      data={locations}
      columns={columns}
      onSave={handleSave}
      onDelete={handleDelete}
      onRefresh={handleRefresh}
      idField="id" // Specify which field is the unique identifier (default: "id")
    />
  );
}
```

## Props

### DataTableProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `TData[]` | Yes | Array of data to display |
| `columns` | `DataTableColumn<TData>[]` | Yes | Column configuration |
| `onSave` | `(data: TData[]) => void \| Promise<void>` | No | Callback when Save button is clicked |
| `onDelete` | `(ids: Array<string \| number>) => void \| Promise<void>` | No | Callback when Delete button is clicked |
| `onRefresh` | `() => void \| Promise<void>` | No | Callback when Refresh button is clicked |
| `idField` | `keyof TData` | No | Field to use as unique identifier (default: `"id"`) |
| `className` | `string` | No | Additional CSS classes |

### DataTableColumn

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `accessorKey` | `keyof TData` | Yes | Key of the data field to display |
| `header` | `string` | Yes | Column header text |
| `editable` | `boolean` | No | Whether the column is editable (default: `false`) |
| `type` | `"text" \| "number" \| "select"` | No | Type of input for editable columns (default: `"text"`) |
| `options` | `Array<{label: string, value: string \| number}>` | No | Options for select type columns |
| `cell` | `(value: any, row: TData, onChange?: (value: any) => void) => React.ReactNode` | No | Custom cell renderer |

## Column Configuration Examples

### Static (Read-only) Column
```tsx
{
  accessorKey: "id",
  header: "ID",
  // editable is false by default
}
```

### Editable Text Column
```tsx
{
  accessorKey: "name",
  header: "Name",
  editable: true,
  type: "text",
}
```

### Editable Number Column
```tsx
{
  accessorKey: "capacity",
  header: "Capacity",
  editable: true,
  type: "number",
}
```

### Editable Select Column
```tsx
{
  accessorKey: "status",
  header: "Status",
  editable: true,
  type: "select",
  options: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ],
}
```

### Custom Cell Renderer
```tsx
{
  accessorKey: "createdAt",
  header: "Created",
  cell: (value, row) => {
    return <span>{new Date(value).toLocaleDateString()}</span>;
  },
}
```

## Features Detail

### Search
- Searches across all columns
- Filters data starting with the search string (prefix match)
- Case-insensitive

### Sorting
- Click column headers to sort
- First click: ascending
- Second click: descending
- Third click: remove sort
- Sorts all data, not just current page

### Pagination
- Choose rows per page: 10, 25, 50, or 100
- Navigate with first, previous, next, last buttons
- Shows current page and total pages

### Actions
- **Save**: Calls `onSave` with current data state (including edits)
- **Delete**: Calls `onDelete` with selected row IDs, then removes them from the table
- **Refresh**: Calls `onRefresh` to fetch updated data from the backend

### Row Selection
- Checkboxes in the first column
- Select/deselect individual rows
- Select/deselect all rows with header checkbox
- Delete button shows count of selected rows

## TypeScript Support

The component is fully typed with TypeScript generics:

```tsx
interface YourDataType {
  id: number;
  field1: string;
  field2: number;
}

// TypeScript will enforce correct column accessorKey values
const columns: DataTableColumn<YourDataType>[] = [
  { accessorKey: "field1", header: "Field 1" }, // ✓ Valid
  { accessorKey: "invalidField", header: "Invalid" }, // ✗ Type error
];
```
