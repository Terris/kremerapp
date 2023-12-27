"use client";

import { Button, ButtonProps } from "./Button";
import { ClipboardCopy, ClipboardCheck, ClipboardX } from "lucide-react";
import { useState } from "react";

interface CopyToClipboardButtonProps extends ButtonProps {
  textToCopy: string;
  callback?: () => void;
}

export const CopyToClipboardButton = ({
  textToCopy,
  callback,
  ...props
}: CopyToClipboardButtonProps) => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const setSuccess = () => {
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  const setError = () => {
    setStatus("error");
    setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  const size = "h-4 w-4";

  const renderIcon = () => {
    switch (status) {
      case "idle":
        return <ClipboardCopy className={size} />;
      case "success":
        return <ClipboardCheck className={size} color="green" />;
      case "error":
        return <ClipboardX className={size} color="red" />;
    }
  };

  return (
    <Button
      onClick={() =>
        navigator.clipboard
          .writeText(textToCopy)
          .then((clipText) => {
            setSuccess();
            callback?.();
          })
          .catch((err) => {
            setError();
          })
      }
      {...props}
    >
      {renderIcon()}
    </Button>
  );
};
