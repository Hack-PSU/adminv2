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
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <nav className="flex space-x-4 border-b pb-2">
        <Link
          href="/analytics"
          className={cn(
            "pb-2",
            pathname === "/analytics"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-black font-semibold"
          )}
        >
          Summary
        </Link>
        <Link
          href="/analytics/events"
          className={cn(
            "pb-2",
            pathname === "/analytics/events"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-black font-semibold"
          )}
        >
          Events
        </Link>
        <Link
          href="/analytics/organizers"
          className={cn(
            "pb-2",
            pathname === "/analytics/organizers"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-black font-semibold"
          )}
        >
          Organizers
        </Link>
      </nav>
      {children}
    </section>
  );
}