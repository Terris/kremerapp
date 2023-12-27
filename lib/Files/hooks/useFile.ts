import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { FileId } from "../types";

export function useFile({ id }: { id: FileId }) {
  const file = useQuery(api.files.findById, { id });
  const isLoading = !file;
  const error = !isLoading && !file ? "Error loading assessment" : null;
  return { file, isLoading, error };
}
