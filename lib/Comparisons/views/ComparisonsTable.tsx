import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AdminTable } from "@/lib/Admin";
import { FileId } from "@/lib/Files";
import {
  CopyToClipboardButton,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/ui";

interface ComparisonRow {
  _id: string;
  image1Id: FileId;
  image2Id: FileId;
  distance: number;
}

const columns: ColumnDef<ComparisonRow>[] = [
  {
    accessorKey: "image1Id",
    header: "Image 1 ID",
    cell: ({ row }) => row.original.image1Id,
  },
  {
    accessorKey: "image2Id",
    header: "Image 2 ID",
    cell: ({ row }) => row.original.image2Id,
  },
  {
    accessorKey: "distance",
    header: "Distance",
    cell: ({ row }) => row.original.distance,
  },
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="max-w-[100px] flex items-center justify-between">
        <Text className="truncate pr-2">{row.original._id}</Text>
        <Tooltip>
          <TooltipTrigger>
            <CopyToClipboardButton
              textToCopy={row.original._id}
              variant="ghost"
              size="sm"
            />
          </TooltipTrigger>
          <TooltipContent>Copy ID to clipboard</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

export const ComparisonsTable = () => {
  const comparisonsData = useQuery(api.imageComparisons.all);
  if (!comparisonsData) return null;
  return <AdminTable columns={columns} data={comparisonsData} />;
};
