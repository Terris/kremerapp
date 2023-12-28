"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FileId } from "@/lib/Files";
import { useFile } from "@/lib/Files";
import { useToast } from "@/lib/hooks";
import { Breadcrumbs, Button, Input, Loader, Text } from "@/lib/ui";
import { useMutation } from "convex/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as Yup from "yup";

export default function FilePage({ params }: { params: { id: string } }) {
  const { file } = useFile({ id: params.id as FileId });

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
        <div className="md:w-5/6">
          <Image
            src={file.url!}
            alt={file.fileName}
            className="rounded mx-auto"
            width={file.dimensions?.width}
            height={file.dimensions?.height}
          />
        </div>
        <div className="w-full mx-auto py-4 md:w-1/6 md:px-4 md:pt-0">
          <Text className="pb-2">Description</Text>
          {file.description ? (
            <Text className="text-sm">{file.description}</Text>
          ) : (
            <Text className="text-gray-500 text-sm">No description yet.</Text>
          )}
          <Text className="pt-8 pb-2">Tags</Text>
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
      {({ isSubmitting, errors }) => (
        <Form>
          {errors.name && (
            <Text className="text-destructive" size="sm">
              {errors.name}
            </Text>
          )}
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
