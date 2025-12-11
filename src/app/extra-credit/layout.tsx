"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ExtraCreditLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="space-y-4">
      <nav className="flex space-x-4 border-b pb-2">
        <Link
          href="/extra-credit/classes"
          className={cn(
            "pb-2",
            pathname === "/extra-credit/classes"
              ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
              : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Manage Classes
        </Link>
        <Link
          href="/extra-credit/assignments"
          className={cn(
            "pb-2",
            pathname === "/extra-credit/assignments"
              ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
              : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Manage Assignments
        </Link>
      </nav>

      {children}
    </section>
  );
}