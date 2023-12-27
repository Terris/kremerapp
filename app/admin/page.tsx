import { AdminLayout } from "@/lib/Admin";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function AdminCoursesPage() {
  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
        <Breadcrumbs breadcrumbs={[{ href: "/admin", label: "Admin" }]} />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper>
        <Text className="text-3xl font-bold">Admin</Text>
      </AdminLayout.PageTitleWrapper>
    </>
  );
}
