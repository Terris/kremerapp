import * as Yup from "yup";
import { Field, FieldProps, Form, Formik } from "formik";
import { FileId } from "../types";
import { Button, Input } from "@/lib/ui";
import { useEditFile, useFile } from "../hooks";
import { useToast } from "@/lib/hooks";

const validationSchema = Yup.object().shape({
  fileName: Yup.string(),
});

interface EditFileNameFormValues {
  fileName: string;
}

interface EditFileNameFormProps {
  fileId: FileId;
  onSuccess?: () => void;
}
export function EditFileNameForm({ fileId, onSuccess }: EditFileNameFormProps) {
  const { toast } = useToast();
  const { file } = useFile({ id: fileId });
  const { editFile } = useEditFile();
  async function onSubmit(values: EditFileNameFormValues) {
    if (values.fileName === file?.fileName) return;
    try {
      editFile({ id: fileId, fileName: values.fileName });
      onSuccess?.();
      toast({
        title: "Success!",
        description: "File name updated.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to update file name.",
      });
    }
  }

  return (
    <Formik<EditFileNameFormValues>
      initialValues={{
        fileName: file?.fileName ?? "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="fileName">
            {({ field }: FieldProps) => (
              <Input
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
