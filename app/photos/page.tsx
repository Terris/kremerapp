"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Breadcrumbs, Button, Input, Text } from "@/lib/ui";
import Image from "next/image";
import { useMe } from "@/lib/providers/MeProvider";
import { Search } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks";
import { useState } from "react";

const ITEMS_PER_PAGE = 36;

export default function PhotosPage() {
  const { isAuthenticated } = useMe();
  const [queryTerm, setQueryTerm] = useState<string>("");
  const debouncedQueryTerm = useDebounce(queryTerm, 500);

  const {
    results: allFiles,
    status: paginationStatus,
    loadMore,
  } = usePaginatedQuery(
    api.files.findAllImages,
    !isAuthenticated || !!debouncedQueryTerm ? "skip" : {},
    { initialNumItems: ITEMS_PER_PAGE }
  );

  const fileSearchResults = useQuery(
    api.files.searchByTag,
    !debouncedQueryTerm
      ? "skip"
      : {
          queryTerm: debouncedQueryTerm,
        }
  );

  const filesToDisplay = fileSearchResults ?? allFiles;

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs breadcrumbs={[{ href: "/photos", label: "Photos" }]} />
      </div>
      <div className="w-full p-8">
        <div className="w-full flex flex-row mx-auto p-4 mb-8 rounded shadow-md md:w-1/2 ">
          <Input
            placeholder="Search..."
            className="mr-2"
            value={queryTerm}
            onChange={(e) => setQueryTerm(e.currentTarget.value)}
          />
          <Button variant="secondary">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-full columns-2 md:columns-5 gap-8">
          {filesToDisplay?.map((file) => (
            <div key={file._id} className="pb-8">
              <Link href={`/photos/${file._id}`} className="block">
                <Image
                  src={file.url ?? ""}
                  alt={file.fileName}
                  className="rounded"
                  width={file.dimensions?.width ?? 600}
                  height={file.dimensions?.height ?? 600}
                />
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center justify-center pt-8 pb-16 border-t">
          {filesToDisplay?.length > 0 ? (
            <>
              {paginationStatus === "CanLoadMore" && (
                <Button
                  variant="secondary"
                  onClick={() => loadMore(ITEMS_PER_PAGE)}
                >
                  Load more
                </Button>
              )}
              {paginationStatus === "Exhausted" && (
                <Text className="text-gray-500">
                  You&rsquo;ve reached the end of the line.
                </Text>
              )}
            </>
          ) : (
            <Text className="text-gray-500">
              There are no files yet. Upload some!
            </Text>
          )}
        </div>
      </div>
    </>
  );
}
