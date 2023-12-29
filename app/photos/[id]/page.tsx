"use client";

import { FileId, useFile, FileDetailsView } from "@/lib/Files";
import { Breadcrumbs, LoadingScreen } from "@/lib/ui";

export default function PhotoPage({ params }: { params: { id: string } }) {
  const { file } = useFile({ id: params.id as FileId });
  if (!file) return <LoadingScreen />;
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
      <FileDetailsView fileId={params.id as FileId} />
    </>
  );
}
