import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export function useEditFile() {
  const editFile = useMutation(api.files.edit);
  return { editFile };
}
