import * as Yup from "yup";
import { api } from "@/convex/_generated/api";
import { FileId } from "@/lib/Files";
import { useToast } from "@/lib/hooks";
import { Button, Input } from "@/lib/ui";
import { useMutation } from "convex/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { PlusIcon } from "lucide-react";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(30, "Tag name must be less than 30 characters")
    .required("Tag name is required"),
});

interface AddFileTagFormValues {
  name: string;
}

export function AddFileTagForm({ fileId }: { fileId: FileId }) {
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
