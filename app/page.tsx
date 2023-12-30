/* eslint-disable @next/next/no-img-element */
"use client";

import { useMe } from "@/lib/providers/MeProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useMe();

  useEffect(() => {
    if (isAuthenticated) router.push("/photos");
  }, [isAuthenticated, router]);

  return <h1>Home</h1>;
}
