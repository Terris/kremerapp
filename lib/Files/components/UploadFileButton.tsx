"use client";

import { useMutation } from "convex/react";
import {
  UploadButton as UploadButtonPrimitive,
  UploadFileResponse,
  useUploadFiles,
} from "@xixixao/uploadstuff/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Loader, buttonVariants } from "@/lib/ui";
import { VariantProps } from "class-variance-authority";
import { useToast } from "@/lib/hooks";

interface UploadButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  content?: string;
}

export function UploadFileButton({
  variant,
  size,
  className,
  content,
}: UploadButtonProps) {
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageIds);
  const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
    await saveStorageId({
      uploads: uploaded.map((file) => ({
        storageId: (file.response as any).storageId,
        fileName: file.name,
        mimeType: file.type,
        type: file.type.includes("image") ? "image" : "document",
        size: file.size,
      })),
    });
  };

  const { startUpload, isUploading } = useUploadFiles(generateUploadUrl);

  return (
    <>
      <label
        htmlFor="file-upload"
        className={cn(buttonVariants({ variant, size, className }))}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={async (event) => {
            if (event.target.files === null) {
              return;
            }
            const files = Array.from(event.target.files);
            try {
              const uploaded = await startUpload(files);
              if (uploaded) {
                await saveAfterUpload(uploaded);
              } else {
                throw new Error("Upload failed");
              }
            } catch (error) {
              toast({
                variant: "destructive",
                title: "Error",
                description:
                  "Something went wrong trying to upload a file. Please try again.",
              });
            }
          }}
          className="hidden"
        />
        {content ?? "Upload files"}
        {isUploading && <Loader className="ml-2" />}
      </label>
    </>
  );
}
