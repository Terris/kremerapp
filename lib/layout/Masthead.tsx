"use client";

import * as React from "react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { KremerCrest, TextLink } from "@/lib/ui";
import Link from "next/link";
import { useMe } from "../providers/MeProvider";
import { Lock, Shield } from "lucide-react";
import { ThemeModeToggle } from "../ui/ThemeModeToggle";
import { UploadFileButton } from "../Files";

export function Masthead() {
  const { isAuthenticated, isAdmin } = useMe();

  return (
    <div className="flex flex-row items-center justify-between w-full px-8 py-2 border-b text-sm leading-none">
      <Link href="/" className="mr-6">
        {/* <Shield className="text-primary" /> */}
        <KremerCrest className="w-8 h-8" />
      </Link>

      {isAuthenticated && (
        <>
          <div className="flex flex-row gap-8 mr-auto ml-4">
            <TextLink href="/photos" className="font-bold">
              Photos
            </TextLink>
            {isAdmin && (
              <TextLink
                href="/admin/files"
                className="font-bold flex flex-row items-center"
              >
                <Lock className="mr-1 w-4 h-4" /> All Files
              </TextLink>
            )}
          </div>
          <UploadFileButton variant="secondary" size="sm" className="mr-8" />
        </>
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
