"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FileId } from "@/lib/Files";
import { useFile } from "@/lib/Files";
import { EditFileDescriptionForm } from "@/lib/Files/forms";
import { EditFileNameForm } from "@/lib/Files/forms/EditFileNameForm";
import { useToast } from "@/lib/hooks";
import { Breadcrumbs, Button, Input, Loader, Text } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { Pencil, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import * as Yup from "yup";

export default function FilePage({ params }: { params: { id: string } }) {
  const { file } = useFile({ id: params.id as FileId });
  const [editingFileName, setEditingFileName] = useState(false);
  const [editingFileDescription, setEditingFileDescription] = useState(false);

  if (!file) return <Loader />;

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/photos", label: "Photos" },
            { href: `/photos/${file._id}`, label: file.fileName },
          ]}
        />
      </div>
      <div className="w-full p-8 flex flex-col md:flex-row justify-start">
        <div className="md:w-4/5 lg:w-5/6">
          <Image
            src={file.url!}
            alt={file.fileName}
            className="rounded mx-auto"
            width={file.dimensions?.width ?? 600}
            height={file.dimensions?.height ?? 600}
          />
        </div>
        <div className="w-full flex flex-col gap-8 py-4 md:w-1/5 md:px-4 md:pt-0 lg:w-1/6">
          {/* <div>
            <div className="flex flex-row items-center justify-between">
              <Text>File name</Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingFileName((editing) => !editing)}
              >
                <Pencil className="w-3 h-3" />
              </Button>
            </div>
            {editingFileName ? (
              <EditFileNameForm
                fileId={file._id}
                onSuccess={() => setEditingFileName(false)}
              />
            ) : (
              <Text
                className={cn("text-sm", !file.fileName && "text-gray-500")}
              >
                {file.fileName ?? "No description yet."}
              </Text>
            )}
          </div> */}
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
              <EditFileDescriptionForm
                fileId={file._id}
                onSuccess={() => setEditingFileDescription(false)}
              />
            ) : (
              <Text
                className={cn("text-sm", !file.description && "text-gray-500")}
              >
                {file.description ?? "No description yet."}
              </Text>
            )}
          </div>
          <div>
            <Text>Tags</Text>
            <div className="flex flex-row flex-wrap gap-2">
              {file.tags.length ? (
                file.tags.map((tag) => (
                  <Link href={`/tags/${tag?._id}`} key={tag?._id}>
                    <Button variant="outline" size="sm">
                      {tag?.name}
                    </Button>
                  </Link>
                ))
              ) : (
                <Text className="text-gray-500 text-sm">No tags yet.</Text>
              )}
              <AddFileTagForm fileId={file._id} />
            </div>
          </div>
          <div>
            <Text>Comments</Text>
          </div>
        </div>
      </div>
    </>
  );
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(30, "Tag name must be less than 30 characters")
    .required("Tag name is required"),
});

interface AddFileTagFormValues {
  name: string;
}

function AddFileTagForm({ fileId }: { fileId: Id<"files"> }) {
  const { toast } = useToast();
  const createFileTag = useMutation(api.fileTags.setFileTag);

  async function onSubmit(
    values: AddFileTagFormValues,
    actions: FormikHelpers<AddFileTagFormValues>
  ) {
    try {
      await createFileTag({
        fileId,
        tagName: values.name,
      });
      actions.resetForm();
      toast({
        title: "Success!",
        description: "Tag created.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to create tag.",
      });
    }
  }

  return (
    <Formik
      initialValues={{
        name: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="flex flex-row items-center justify-between">
            <Field name="name">
              {({ field }: FieldProps) => (
                <Input placeholder="Add a tag..." className="mr-2" {...field} />
              )}
            </Field>
            <Button type="submit" variant="outline" disabled={isSubmitting}>
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
