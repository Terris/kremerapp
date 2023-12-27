"use client";
import { AdminLayout } from "@/lib/Admin";
import { FilesTable, UploadFileButton } from "@/lib/Files";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function FilesPage() {
  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/files", label: "Files" },
          ]}
        />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper align="between">
        <Text className="text-3xl font-bold">Files</Text>
        <UploadFileButton variant="outline" size="sm" />
      </AdminLayout.PageTitleWrapper>
      <AdminLayout.TableWrapper>
        <FilesTable />
      </AdminLayout.TableWrapper>
    </>
  );
}
