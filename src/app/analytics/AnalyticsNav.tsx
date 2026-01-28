"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Summary", href: "/analytics/summary" },
  { label: "Events", href: "/analytics/events" },
  { label: "Organizers", href: "/analytics/organizers" },
] as const;

export default function AnalyticsNav() {
  const pathname = usePathname();

  return (
    <nav
      className="inline-flex w-fit gap-2 rounded-3xl border border-zinc-200 bg-white p-2 shadow-sm"
      aria-label="Analytics sections"
    >
      {NAV_ITEMS.map((item) => {
        const isSummary = item.href === "/analytics/summary";
        const isActive = isSummary
          ? pathname === "/analytics" || pathname.startsWith("/analytics/summary")
          : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className="inline-flex">
            <span
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
