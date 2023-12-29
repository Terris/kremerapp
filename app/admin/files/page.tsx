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
            { href: "/admin/files", label: "All Files" },
          ]}
        />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.TableWrapper>
        <FilesTable />
      </AdminLayout.TableWrapper>
    </>
  );
}
