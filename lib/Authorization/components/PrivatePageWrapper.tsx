"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/lib/ui";
import { useMe } from "@/lib/providers/MeProvider";

interface PrivatePageWrapperProps {
  children: React.ReactNode;
  authorizedRoles?: string[];
}

export function PrivatePageWrapper({
  children,
  authorizedRoles,
}: PrivatePageWrapperProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, me } = useMe();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/`);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      authorizedRoles &&
      !authorizedRoles.includes("admin") &&
      !me?.isAdmin
    ) {
      router.push(`/`);
    }
  }, [authorizedRoles, isAuthenticated, isLoading, me?.isAdmin, router]);

  if (isLoading || !isAuthenticated) return <LoadingScreen />;

  return children;
}
