import { Loader2 } from "lucide-react";
import { cn } from "../utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Loader({ className }: LoaderProps) {
  return <Loader2 className={cn("w-4 h-4 animate-spin", className)} />;
}
