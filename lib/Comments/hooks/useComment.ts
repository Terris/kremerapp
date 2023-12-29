import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { CommentId } from "../types";

export function useComment({ id }: { id: CommentId }) {
  const comment = useQuery(api.comments.findById, { id });
  const isLoading = !comment;
  const error = !isLoading && !comment ? "Error loading comment" : null;
  return { comment, isLoading, error };
}
