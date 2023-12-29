import * as Yup from "yup";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { FileId } from "@/lib/Files";
import { Button, Textarea } from "@/lib/ui";
import { useCreateComment } from "../hooks";
import { useToast } from "@/lib/hooks";
import { useMe } from "@/lib/providers/MeProvider";

const validationSchema = Yup.object().shape({
  text: Yup.string(),
});

interface CreateCommentFormValues {
  text: string;
}

interface CreateCommentFormProps {
  fileId: FileId;
  onSuccess?: () => void;
}
export function CreateCommentForm({
  fileId,
  onSuccess,
}: CreateCommentFormProps) {
  const { toast } = useToast();
  const { me } = useMe();
  const { createComment } = useCreateComment();
  async function onSubmit(
    values: CreateCommentFormValues,
    actions: FormikHelpers<CreateCommentFormValues>
  ) {
    if (!me) throw new Error("User must be logged in to create comment.");
    try {
      createComment({ fileId, userId: me.id, text: values.text });
      onSuccess?.();
      toast({
        title: "Success!",
        description: "Comment created.",
      });
      actions.resetForm();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to create comment.",
      });
    }
  }

  return (
    <Formik<CreateCommentFormValues>
      initialValues={{
        text: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="text">
            {({ field }: FieldProps) => (
              <Textarea
                placeholder="Add your comment..."
                className="mr-2"
                {...field}
              />
            )}
          </Field>
          <div className="flex flex-row justify-end pt-2">
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
