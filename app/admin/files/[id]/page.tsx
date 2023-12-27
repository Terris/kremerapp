"use client";

import { AdminLayout } from "@/lib/Admin";
import { FileId } from "@/lib/Files";
import { useFile } from "@/lib/Files";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function FilePage({ params }: { params: { id: string } }) {
  const { isLoading, file } = useFile({ id: params.id as FileId });
  if (!file) return null;
  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/files", label: "Files" },
            { href: `/admin/files/${file._id}`, label: file.fileName },
          ]}
        />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper align="between">
        <Text className="text-3xl font-bold">{file.fileName}</Text>
      </AdminLayout.PageTitleWrapper>
      <AdminLayout.TableWrapper>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file.url!}
          alt={file.fileName}
          className="object-none mx-auto m-4"
        />
      </AdminLayout.TableWrapper>
    </>
  );
}
