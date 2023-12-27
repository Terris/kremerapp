"use client";

import * as React from "react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { TextLink } from "@/lib/ui";
import Link from "next/link";
import { useMe } from "../providers/MeProvider";
import { PocketKnife } from "lucide-react";
import { ThemeModeToggle } from "../ui/ThemeModeToggle";

export function Masthead() {
  const { isAuthenticated, isAdmin } = useMe();

  return (
    <div className="flex flex-row items-center justify-between w-full px-8 py-2 border-b text-sm leading-none">
      <Link href="/" className="mr-6">
        <PocketKnife className="text-primary" />
      </Link>

      {isAuthenticated && (
        <div className="flex flex-row gap-8 mr-auto ml-4">
          <TextLink href="/files" className="font-bold">
            Files
          </TextLink>
        </div>
      )}
      {isAdmin && (
        <div className="flex flex-row gap-8 items-center ml-auto mr-16">
          <TextLink href="/admin" className="font-bold">
            Admin
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
