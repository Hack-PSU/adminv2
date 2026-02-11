"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SubNavItem {
  label: string;
  href: string;
}

interface SubNavigationProps {
  items: SubNavItem[];
  baseHref?: string;
}

export default function SubNavigation({ items, baseHref }: SubNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className="inline-flex w-fit gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm"
      aria-label="Sub sections navigation"
    >
      {items.map((item) => {
        const isBaseActive = baseHref && (pathname === baseHref || pathname.startsWith(baseHref + "/"));
        const isActive = isBaseActive && item.href === baseHref
          ? true
          : pathname.startsWith(item.href);

        return (
          <Link key={item.href} href={item.href} className="inline-flex">
            <span
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-zinc-600 hover:bg-blue-50 hover:text-zinc-900",
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
