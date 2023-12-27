"use client";

import { useState } from "react";
import { FormikValues } from "formik";
import { AdminForm, type AdminFormProps } from "@/lib/Admin";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/lib/ui";

interface AdminDialogFormProps<CustomFormValues>
  extends AdminFormProps<CustomFormValues> {
  formTitle: string;
  formDescription?: string;
  onCloseForm?: () => void;
}

export function AdminDialogForm<CustomFormValues extends FormikValues>({
  formTitle,
  renderTrigger,
  formDescription,
  config,
  onCloseForm,
}: AdminDialogFormProps<CustomFormValues>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOnSetOpen(open: boolean) {
    if (!open) onCloseForm?.();
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnSetOpen}>
      <DialogTrigger asChild>
        {renderTrigger ? (
          renderTrigger
        ) : (
          <Button variant="outline" size="sm">
            {formTitle}
          </Button>
        )}
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formTitle}</DialogTitle>
            {formDescription && (
              <DialogDescription>{formDescription}</DialogDescription>
            )}
          </DialogHeader>
          <AdminForm<CustomFormValues>
            config={config}
            onSuccess={() => handleOnSetOpen(false)}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
