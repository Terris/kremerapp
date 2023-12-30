"use client";

import { useRouter } from "next/navigation";
import { FileId, FileDetailsView } from "@/lib/Files";
import { Button } from "@/lib/ui";
import { X } from "lucide-react";
import { useModalBodyClassSwitch } from "@/lib/hooks";

export default function PhotoModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  useModalBodyClassSwitch();

  return (
    <>
      <div
        className="fixed top-0 right-0 bottom-0 left-0 bg-black/85 cursor-pointer"
        onClick={() => router.back()}
      />
      <div className="fixed top-16 bottom-0 bg-background rounded-t-xl shadow-md animate-modal-up overflow-auto p-2 md:left-8 md:right-8 lg:left-16 lg:right-16">
        <div className="w-full flex flex-row justify-end">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <FileDetailsView fileId={params.id as FileId} />
      </div>
    </>
  );
}
