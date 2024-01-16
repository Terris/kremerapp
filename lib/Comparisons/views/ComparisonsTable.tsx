import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AdminTable } from "@/lib/Admin";
import { FileDoc, FileId } from "@/lib/Files";
import {
  CopyToClipboardButton,
  Text,
  TextLink,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/ui";
import Image from "next/image";

interface ComparisonRow {
  _id: string;
  image1Id: FileId;
  image2Id: FileId;
  distance: number;
  diffPercent: number;
  average: number;
  image1: FileDoc;
  image2: FileDoc;
}

const columns: ColumnDef<ComparisonRow>[] = [
  {
    accessorKey: "image1Id",
    header: "Image 1 ID",
    cell: ({ row }) => (
      <div className="max-w-[100px] flex items-center justify-between">
        <Text className="truncate pr-2">{row.original.image1Id}</Text>
        <Tooltip>
          <TooltipTrigger>
            <CopyToClipboardButton
              textToCopy={row.original.image1Id}
              variant="ghost"
              size="sm"
            />
          </TooltipTrigger>
          <TooltipContent>Copy ID to clipboard</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
  {
    accessorKey: "image2Id",
    header: "Image 2 ID",
    cell: ({ row }) => (
      <div className="max-w-[100px] flex items-center justify-between">
        <Text className="truncate pr-2">{row.original.image2Id}</Text>
        <Tooltip>
          <TooltipTrigger>
            <CopyToClipboardButton
              textToCopy={row.original.image2Id}
              variant="ghost"
              size="sm"
            />
          </TooltipTrigger>
          <TooltipContent>Copy ID to clipboard</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
  {
    accessorKey: "image1.url",
    header: "Thumb 1",
    cell: ({ row }) => {
      return (
        <TextLink
          href={`/admin/files/${row.original._id}`}
          className="w-[60px] h-[60px] block relative"
        >
          <Image
            src={row.original.image1.url!}
            alt={row.original.image1.fileName!}
            fill
            className="object-contain"
          />
        </TextLink>
      );
    },
  },
  {
    accessorKey: "image2.url",
    header: "Thumb 2",
    cell: ({ row }) => {
      return (
        <TextLink
          href={`/admin/files/${row.original._id}`}
          className="w-[60px] h-[60px] block relative"
        >
          <Image
            src={row.original.image2.url!}
            alt={row.original.image2.fileName!}
            fill
            className="object-contain"
          />
        </TextLink>
      );
    },
  },
  {
    accessorKey: "distance",
    header: "Distance",
    cell: ({ row }) => row.original.distance,
  },
  {
    accessorKey: "diffPercent",
    header: "Diff Percent",
    cell: ({ row }) => row.original.diffPercent,
  },
  {
    accessorKey: "average",
    header: "Average",
    cell: ({ row }) => row.original.average,
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

export const ComparisonsTable = ({
  maxAverage = 1,
}: {
  maxAverage?: number;
}) => {
  const comparisonsData = useQuery(
    api.imageComparisons.findAllCloseComparisons,
    { maxAverage }
  );
  if (!comparisonsData) return null;
  return <AdminTable columns={columns} data={comparisonsData} />;
};
