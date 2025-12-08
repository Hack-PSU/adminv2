"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AnalyticsLayoutProps {
  children: React.ReactNode;
}

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  const pathname = usePathname();

  return (
    <section className="space-y-4">
      <nav className="flex space-x-4 border-b pb-2">
        <Link
          href="/analytics"
          className={cn(
            "pb-2",
            pathname === "/analytics"
              ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
              : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Overview
        </Link>
        <Link
          href="/analytics/events"
          className={cn(
            "pb-2",
            pathname === "/analytics/events"
              ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
              : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Events
        </Link>
      </nav>
      {children}
    </section>
  );
}