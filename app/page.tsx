"use client";

import { Breadcrumbs, Button, Text } from "@/lib/ui";

export default function Home() {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs />
      </div>
      <div className="w-full py-4 px-8 border-b flex flex-row items-center justify-between">
        <Text className="text-3xl font-bold">Home</Text>
      </div>
    </>
  );
}
