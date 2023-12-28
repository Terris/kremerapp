"use client";

import * as React from "react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { TextLink } from "@/lib/ui";
import Link from "next/link";
import { useMe } from "../providers/MeProvider";
import { PocketKnife, Shield } from "lucide-react";
import { ThemeModeToggle } from "../ui/ThemeModeToggle";

export function Masthead() {
  const { isAuthenticated, isAdmin } = useMe();

  return (
    <div className="flex flex-row items-center justify-between w-full px-8 py-2 border-b text-sm leading-none">
      <Link href="/" className="mr-6">
        <Shield className="text-primary" />
      </Link>

      {isAuthenticated && (
        <div className="flex flex-row gap-8 mr-auto ml-4">
          <TextLink href="/photos" className="font-bold">
            Photos
          </TextLink>
          <TextLink href="/photos" className="font-bold">
            Videos
          </TextLink>
          <TextLink href="/photos" className="font-bold">
            Documents
          </TextLink>
        </div>
      )}
      {isAdmin && (
        <div className="flex flex-row gap-8 items-center ml-auto mr-16">
          <TextLink href="/admin/files" className="font-bold">
            Files
          </TextLink>
        </div>
      )}
      <div className="flex flex-row items-center justify-between gap-4">
        <ThemeModeToggle />
        <div className="items-center">
          {isAuthenticated ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonPopoverCard: "rounded shadow-md",
                },
              }}
            />
          ) : (
            <SignInButton mode="modal" />
          )}
        </div>
      </div>
    </div>
  );
}
