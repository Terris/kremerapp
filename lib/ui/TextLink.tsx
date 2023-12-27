import Link, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface TextLinkProps extends LinkProps {
  children: React.ReactNode;
  underline?: boolean;
  arrow?: boolean;
  className?: string;
}

export function TextLink({
  children,
  underline,
  arrow,
  className,
  ...rest
}: TextLinkProps) {
  return (
    <Link
      className={cn(
        "hover:text-muted-foreground",
        underline && "underline",
        className
      )}
      {...rest}
    >
      {children}
      {arrow && <ArrowUpRight className="ml-0.5 h-2 w-2 inline mb-2" />}
    </Link>
  );
}
