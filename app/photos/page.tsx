/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Breadcrumbs, Button, Input } from "@/lib/ui";
import Image from "next/image";
import { useMe } from "@/lib/providers/MeProvider";
import { Search } from "lucide-react";
import Link from "next/link";

export default function PhotosPage() {
  const { isAuthenticated } = useMe();
  const files = useQuery(
    api.files.findAllImages,
    isAuthenticated ? {} : "skip"
  );

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs breadcrumbs={[{ href: "/photos", label: "Photos" }]} />
      </div>
      <div className="w-full p-8">
        <div className="w-full flex flex-row mx-auto p-4 mb-8 shadow-md md:w-1/2 ">
          <Input className="mr-2" placeholder="Search..." />
          <Button variant="secondary">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-full columns-2 md:columns-3 gap-8">
          {files?.map((file) => (
            <div key={file._id} className="pb-8">
              <Link href={`/photos/${file._id}`} className="block">
                <Image
                  src={file.url!}
                  alt="Picture of the author"
                  className="rounded"
                  width={file.dimensions?.width}
                  height={file.dimensions?.height}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
