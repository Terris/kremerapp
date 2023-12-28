"use client";

import { AdminLayout } from "@/lib/Admin";
import { FileId } from "@/lib/Files";
import { useFile } from "@/lib/Files";
import { Breadcrumbs, Button, Loader, Text } from "@/lib/ui";
import { Tags } from "lucide-react";
import Image from "next/image";

export default function FilePage({ params }: { params: { id: string } }) {
  const { file } = useFile({ id: params.id as FileId });
  if (!file) return <Loader />;
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/photos", label: "Photos" },
            { href: `/photos/${file._id}`, label: file.fileName },
          ]}
        />
      </div>
      <div className="w-full p-8 flex flex-col md:flex-row justify-start">
        <div className="md:w-5/6">
          <Image
            src={file.url!}
            alt={file.fileName}
            className="rounded mx-auto"
            width={file.dimensions?.width}
            height={file.dimensions?.height}
          />
        </div>
        <div className="w-full mx-auto px-4 py-4 md:w-1/6 md:pt-0">
          <Text className="pb-2">Description</Text>
          {file.description ? (
            <Text className="text-sm">{file.description}</Text>
          ) : (
            <Text className="text-gray-500 text-sm">No description yet.</Text>
          )}
          <Text className="pt-8 pb-2">Tags</Text>
          <div className="flex flex-row flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Terris Kremer
            </Button>
            <Button variant="outline" size="sm">
              Terris Kremer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
