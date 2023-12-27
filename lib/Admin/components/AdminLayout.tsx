import { cn } from "../../utils";

function AdminLayout() {}

interface LayoutComponentWithChildren {
  children: React.ReactNode;
}

/* 
  This wraps the breadcrumbs row of admin pages
*/
function BreadcrumbsWrapper({ children }: LayoutComponentWithChildren) {
  return (
    <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
      {children}
    </div>
  );
}
AdminLayout.BreadcrumbsWrapper = BreadcrumbsWrapper;

/* 
  This wraps the page title and quick create/edit form
*/
interface PageTitleWrapperProps extends LayoutComponentWithChildren {
  align?: "start" | "between";
}
function PageTitleWrapper({ children, align }: PageTitleWrapperProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-row items-center justify-start py-4 px-8 border-b",
        align === "start" && "justify-start",
        align === "between" && "justify-between"
      )}
    >
      {children}
    </div>
  );
}
AdminLayout.PageTitleWrapper = PageTitleWrapper;

/* 
  This wraps admin data tables
*/
function TableWrapper({ children }: LayoutComponentWithChildren) {
  return <div className="px-4 w-full max-w-screen-2xl mx-auto">{children}</div>;
}
AdminLayout.TableWrapper = TableWrapper;

/* 
  This wraps a flex row with a left side nav column and a right side content column
*/
function NavAndContentFlexWrapper({ children }: LayoutComponentWithChildren) {
  return (
    <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
      {children}
    </div>
  );
}
AdminLayout.NavAndContentFlexWrapper = NavAndContentFlexWrapper;

/* 
  This wraps the nav column of the NavAndContentFlexWrapper
*/
export function NavWrapper({ children }: LayoutComponentWithChildren) {
  return (
    <aside className="px-4 lg:w-1/4 lg:max-w-[20rem] flex-shrink lg:pl-8">
      <div className="sticky top-4">{children}</div>
    </aside>
  );
}
AdminLayout.NavWrapper = NavWrapper;

/*
  This wraps the content column of the NavAndContentFlexWrapper
*/
export function ContentWrapper({ children }: LayoutComponentWithChildren) {
  return (
    <div className="px-4 lg:w-3/4 lg:pr-8">
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  );
}
AdminLayout.ContentWrapper = ContentWrapper;

export { AdminLayout };
