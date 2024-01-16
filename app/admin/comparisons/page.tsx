"use client";
import { AdminLayout } from "@/lib/Admin";
import { ComparisonsTable } from "@/lib/Comparisons/views/ComparisonsTable";
import { Breadcrumbs, Input, Slider } from "@/lib/ui";
import { useState } from "react";

export default function FilesPage() {
  const [maxAverage, setMaxAverage] = useState(1);
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
        <div className="flex flex-row items-center justify-end">
          <div className="w-full max-w-[300px] mr-4">
            <Slider
              defaultValue={[0, 1]}
              min={0}
              max={1}
              step={0.05}
              value={[maxAverage]}
              onValueChange={(v) => setMaxAverage(v[0])}
            />
          </div>
          <Input
            value={maxAverage}
            type="number"
            className="ml-4 max-w-[100px]"
          />
        </div>
        <ComparisonsTable maxAverage={maxAverage} />
      </AdminLayout.TableWrapper>
    </>
  );
}
