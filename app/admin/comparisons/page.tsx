"use client";
import { AdminLayout } from "@/lib/Admin";
import { ComparisonsTable } from "@/lib/Comparisons/views/ComparisonsTable";
import { Breadcrumbs } from "@/lib/ui";

export default function FilesPage() {
  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/comparisons", label: "Comparisons" },
          ]}
        />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.TableWrapper>
        <ComparisonsTable />
      </AdminLayout.TableWrapper>
    </>
  );
}
