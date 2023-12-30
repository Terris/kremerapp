import { ChangeEvent, useRef, useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { useToast } from "@/lib/hooks";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { VariantProps } from "class-variance-authority";
import { Loader, buttonVariants } from "@/lib/ui";
import { cn, getImageDimensions } from "@/lib/utils";

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
  const [isUploading, setIsUploading] = useState(false);
  const keyPrefixRef = useRef("");

  const createFileRecords = useMutation(api.files.create);

  async function uploadFile(file: File) {
    const client = new S3Client({
      region: "us-east-1",
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "us-east-2" },
        identityPoolId: "us-east-2:801e5743-f82a-49d4-848e-7b9a1609476d",
      }),
    });

    const params = {
      Bucket: "kremerapp",
      Key: `${keyPrefixRef.current}-${file.name}`,
      Body: file,
    };

    const command = new PutObjectCommand(params);
    const data = await client.send(command);
    return data;
  }

  async function onSelectFiles(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files === null) {
      return;
    }
    setIsUploading(true);
    keyPrefixRef.current = new Date().toISOString();
    const files = Array.from(event.target.files);

    try {
      const uploads = await Promise.all(files.map((file) => uploadFile(file)));
      const fileDetails = await Promise.all(
        files.map(async (file) => ({
          url: `https://kremerapp.s3.amazonaws.com/${keyPrefixRef.current}-${file.name}`,
          fileName: file.name,
          mimeType: file.type,
          type: file.type.includes("image") ? "image" : "document",
          size: file.size,
          dimensions: await getImageDimensions(file),
        }))
      );

      if (uploads && fileDetails) {
        await createFileRecords({
          uploads: fileDetails,
        });
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
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="file-upload"
        className={cn(buttonVariants({ variant, size, className }))}
      >
        <input
          type="file"
          onChange={onSelectFiles}
          multiple
          id="file-upload"
          className="hidden"
        />
        {content ?? "Upload files"}
        {isUploading && <Loader className="ml-2" />}
      </label>
    </div>
  );
}
