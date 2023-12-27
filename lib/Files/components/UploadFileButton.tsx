"use client";

import { useMutation } from "convex/react";
import {
  UploadButton as UploadButtonPrimitive,
  UploadFileResponse,
} from "@xixixao/uploadstuff/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/ui";
import { VariantProps } from "class-variance-authority";

interface UploadButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
}

export function UploadFileButton({
  variant,
  size,
  className,
}: UploadButtonProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageIds);
  const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
    await saveStorageId({
      uploads: uploaded.map((file) => ({
        storageId: (file.response as any).storageId,
        fileName: file.name,
        type: file.type,
        size: file.size,
      })),
    });
  };
  return (
    <UploadButtonPrimitive
      uploadUrl={generateUploadUrl}
      fileTypes={[".pdf", "image/*"]}
      onUploadComplete={saveAfterUpload}
      onUploadError={(error: unknown) => {
        // Do something with the error.
        alert(`ERROR! ${error}`);
      }}
      multiple
      className={() => cn(buttonVariants({ variant, size, className }))}
    />
  );
}
