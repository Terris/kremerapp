import { api } from "@/convex/_generated/api";
import { FileId } from "@/lib/Files";
import { useQuery } from "convex/react";

export function useFileComments({ fileId }: { fileId: FileId }) {
  const fileComments = useQuery(api.comments.findByFileId, {
    fileId,
  });
  const isLoading = !fileComments;
  const error = !isLoading && !fileComments ? "Error loading comments" : null;
  return { isLoading, error, fileComments };
}
