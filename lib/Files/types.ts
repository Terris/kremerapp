import { Doc, Id } from "../../../convex/_generated/dataModel";

export type FileId = Id<"files">;
export type FileDoc = Doc<"files">;

export interface FileFormFields {
  fileName: string;
}
