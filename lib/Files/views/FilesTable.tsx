import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AdminTable } from "@/lib/Admin";
import {
  Text,
  CopyToClipboardButton,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TextLink,
} from "@/lib/ui";
// import { QuickEditCourseForm } from "../forms";
import { DeleteFileButton } from "../components";
import { FileId } from "../types";
import Image from "next/image";
import { FileText } from "lucide-react";

interface FileRow {
  _id: string;
  url: string | null;
  fileName: string;
  type: string;
  size: number;
}

const columns: ColumnDef<FileRow>[] = [
  {
    accessorKey: "url",
    header: "Thumb",
    cell: ({ row }) => {
      return (
        <TextLink
          href={`/admin/files/${row.original._id}`}
          className="w-[60px] h-[60px] block relative"
        >
          {row.original.type?.includes("image") ? (
            <Image
              src={row.original.url!}
              alt={row.original.fileName}
              fill
              className="object-contain"
            />
          ) : (
            <FileText className="w-full h-full" />
          )}
        </TextLink>
      );
    },
  },
  {
    accessorKey: "fileName",
    header: "File Name",
    cell: ({ row }) => {
      return (
        <TextLink href={`/admin/files/${row.original._id}`} arrow>
          {row.original.fileName}
        </TextLink>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => <Text>{Math.round(row.original.size / 1024)} KB</Text>,
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
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => <DeleteFileButton id={row.original._id as FileId} />,
  },
];

export const FilesTable = () => {
  const filesData = useQuery(api.files.all);
  if (!filesData) return null;
  return <AdminTable columns={columns} data={filesData} />;
};
