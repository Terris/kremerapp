"use client";

import { api } from "@/convex/_generated/api";
import { AdminLayout } from "@/lib/Admin";
import { Breadcrumbs, Button, Text } from "@/lib/ui";
import { useAction } from "convex/react";

export default function AdminCoursesPage() {
  const performMyAction = useAction(api.filesActions.compareImages);
  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
        <Breadcrumbs breadcrumbs={[{ href: "/admin", label: "Admin" }]} />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper>
        <Text className="text-3xl font-bold">Admin</Text>
        <Button onClick={() => performMyAction()}>Compare images</Button>
      </AdminLayout.PageTitleWrapper>
    </>
  );
}
