import { TextLink } from "./TextLink";
import { ArrowRight } from "lucide-react";

export interface Breadcrumb {
  href: string;
  label: string;
}

export interface BreadcrumbsProps {
  breadcrumbs?: Breadcrumb[];
}
export const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps) => {
  return (
    <div className="flex flex-row items-center text-xs gap-4">
      <TextLink
        href="/"
        className={breadcrumbs?.length === 0 ? "font-bold" : ""}
      >
        Home
      </TextLink>
      {breadcrumbs?.length && <ArrowRight className="h-3 w-3" />}
      {breadcrumbs?.map((bc, index) => (
        <span key={bc.href} className="flex items-center gap-3">
          <TextLink
            href={bc.href}
            className={index + 1 === breadcrumbs.length ? "font-bold" : ""}
          >
            {bc.label}
          </TextLink>
          {index + 1 < breadcrumbs.length && <ArrowRight className="h-3 w-3" />}
        </span>
      ))}
    </div>
  );
};
