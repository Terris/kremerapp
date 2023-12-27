import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useDeleteFile() {
  const deleteFile = useMutation(api.files.deleteById);
  return { deleteFile };
}
