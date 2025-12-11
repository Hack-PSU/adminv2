"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ExtraCreditLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Extra Credit
      </h1>
      <nav className="flex space-x-4 border-b pb-2">
        <Link
          href="/extra-credit/classes"
          className={cn(
            "pb-2",
            pathname === "/extra-credit/classes"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-black font-semibold"
          )}
        >
          Manage Classes
        </Link>
        <Link
          href="/extra-credit/assignments"
          className={cn(
            "pb-2",
            pathname === "/extra-credit/assignments"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-black font-semibold"
          )}
        >
          Manage Assignments
        </Link>
      </nav>

      {children}
    </section>
  );
}