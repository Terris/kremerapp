/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMe } from "@/lib/providers/MeProvider";
import { Breadcrumbs } from "@/lib/ui";

export default function Home() {
  const { isAuthenticated } = useMe();
  const files = useQuery(api.files.all, isAuthenticated ? {} : "skip");

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs />
      </div>
      <div className="w-full py-4 px-8 flex flex-row items-center justify-between">
        <div className="w-full columns-2 md:columns-3 gap-8">
          {files?.map((file) => (
            <div key={file._id} className="pb-8">
              <img
                src={file.url!}
                alt="Picture of the author"
                className="rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
