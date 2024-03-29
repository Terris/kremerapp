"use client";
import { AdminLayout } from "@/lib/Admin";
import { FilesTable } from "@/lib/Files";
import { Breadcrumbs } from "@/lib/ui";

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
