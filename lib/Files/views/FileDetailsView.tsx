"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus, X } from "lucide-react";
import { CreateCommentForm } from "@/lib/Comments/forms";
import { useFileComments } from "@/lib/Comments/hooks/useFileComments";
import { FileId } from "@/lib/Files";
import { useFile } from "@/lib/Files";
import { EditFileDescriptionForm } from "@/lib/Files/forms";
import { AddFileTagForm } from "@/lib/Tags/forms";
import { Button, LoadingScreen, Text } from "@/lib/ui";
import { cn, formatDate } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TagId } from "@/lib/Tags/types";

export function FileDetailsView({ fileId }: { fileId: FileId }) {
  const { file } = useFile({ id: fileId });
  const { fileComments } = useFileComments({ fileId });
  const removeFileTag = useMutation(api.fileTags.deleteById);
  const [editingFileDescription, setEditingFileDescription] = useState(false);
  const [addingComment, setAddingComment] = useState(false);

  if (!file) return <LoadingScreen />;

  return (
    <>
      <div className="w-full p-8 flex flex-col md:flex-row md:justify-between">
        <div className="md:flex-grow md:flex-shrink">
          <Image
            src={file.url!}
            alt={file.fileName}
            className="rounded mx-auto"
            width={file.dimensions?.width ?? 600}
            height={file.dimensions?.height ?? 600}
            priority
          />
        </div>
        <div className="w-full flex flex-col gap-8 py-4 md:w-[275px] md:flex-shrink-0 md:px-4 md:pt-0 md:ml-4">
          <div>
            <div className="flex flex-row items-center justify-between">
              <Text>Description</Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingFileDescription((editing) => !editing)}
              >
                <Pencil className="w-3 h-3" />
              </Button>
            </div>
            {editingFileDescription ? (
              <div className="pt-2">
                <EditFileDescriptionForm
                  fileId={file._id}
                  onSuccess={() => setEditingFileDescription(false)}
                />
              </div>
            ) : (
              <Text
                className={cn("text-sm", !file.description && "text-gray-500")}
              >
                {file.description ?? "No description yet."}
              </Text>
            )}
          </div>
          <div>
            <Text className="pb-2">Tags</Text>
            <div className="flex flex-row flex-wrap gap-2">
              {file.tags.length ? (
                file.tags.map((tag) => (
                  <Link href={`/tags/${tag?._id}`} key={tag?._id}>
                    <Button variant="outline" size="sm">
                      {tag?.name}{" "}
                      <X
                        className="w-4 h-4 ml-3 text-gray-500 hover:text-red-500"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFileTag({ id: tag.fileTag._id });
                        }}
                      />
                    </Button>
                  </Link>
                ))
              ) : (
                <Text className="text-gray-500 text-sm">No tags yet.</Text>
              )}
              <div className="w-full">
                <AddFileTagForm fileId={file._id} />
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-between">
              <Text className="pb-2">Comments</Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAddingComment((adding) => !adding)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {addingComment && (
              <div className="pt-2">
                <CreateCommentForm
                  fileId={fileId}
                  onSuccess={() => setAddingComment(false)}
                />
              </div>
            )}
            {fileComments && fileComments.length > 0 ? (
              fileComments?.map((comment) => (
                <div key={comment._id} className="pb-4">
                  <Text className="font-bold text-sm pb-1">
                    {comment.user?.name}
                  </Text>
                  <Text className="text-sm pb-1">{comment.text}</Text>
                  <Text className="text-xs text-gray-500">
                    {formatDate(comment._creationTime)}
                  </Text>
                </div>
              ))
            ) : (
              <Text className="text-gray-500 text-sm">No comments yet.</Text>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
