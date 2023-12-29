import * as Yup from "yup";
import { Field, FieldProps, Form, Formik } from "formik";
import { FileId } from "../types";
import { Button, Textarea } from "@/lib/ui";
import { useEditFile, useFile } from "../hooks";
import { useToast } from "@/lib/hooks";

const validationSchema = Yup.object().shape({
  description: Yup.string(),
});

interface EditFileDescriptionFormValues {
  description: string;
}

interface EditFileDescriptionFormProps {
  fileId: FileId;
  onSuccess?: () => void;
}
export function EditFileDescriptionForm({
  fileId,
  onSuccess,
}: EditFileDescriptionFormProps) {
  const { toast } = useToast();
  const { file } = useFile({ id: fileId });
  const { editFile } = useEditFile();
  async function onSubmit(values: EditFileDescriptionFormValues) {
    if (values.description === file?.description) return;
    try {
      editFile({ id: fileId, description: values.description });
      onSuccess?.();
      toast({
        title: "Success!",
        description: "File description updated.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to update file description.",
      });
    }
  }

  return (
    <Formik<EditFileDescriptionFormValues>
      initialValues={{
        description: file?.description ?? "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="description">
            {({ field }: FieldProps) => (
              <Textarea
                placeholder="File description..."
                className="mr-2"
                {...field}
              />
            )}
          </Field>
          <div className="flex flex-row justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="secondary"
              size="sm"
            >
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
