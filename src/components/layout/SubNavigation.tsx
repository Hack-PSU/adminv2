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
      className="flex flex-wrap w-fit gap-1 rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm sm:gap-2 sm:p-2"
      aria-label="Sub sections navigation"
    >
      {items.map((item) => {
        const isBaseActive = baseHref && (pathname === baseHref || pathname.startsWith(baseHref + "/"));
        const isActive = isBaseActive && item.href === baseHref
          ? true
          : pathname.startsWith(item.href);

        return (
          <Link key={item.href} href={item.href} className="flex">
            <span
              className={cn(
                "rounded-xl px-2 py-1 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
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
