import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export function useCreateComment() {
  const createComment = useMutation(api.comments.createByFileId);
  return { createComment };
}
