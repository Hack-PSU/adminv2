"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  BarChart2,
  CalendarDays,
  FileText,
  Handshake,
  MapPin,
  Menu,
  Settings,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Hackers", href: "/hackers", icon: Users },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Locations", href: "/locations", icon: MapPin },
  {
    label: "Organizer Applications",
    href: "/organizer-applications",
    icon: FileText,
  },
  { label: "Extra Credit", href: "/extra-credit", icon: Star },
  { label: "Judging", href: "/judging", icon: Trophy },
  { label: "Sponsorship", href: "/sponsorship", icon: Handshake },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const sidebarWidth = useMemo(() => (isOpen ? 240 : 0), [isOpen]);

  return (
    <div className="flex min-h-screen bg-white text-zinc-900">
      <aside
        id="app-sidebar"
        className={cn(
          "relative z-20 flex h-screen flex-col border-r rounded-2xl border-zinc-200 bg-zinc-50 shadow-sm transition-[width] duration-400",
          !isOpen && "border-transparent shadow-none",
        )}
        style={{ width: sidebarWidth }}
        aria-hidden={!isOpen}
      >
        <div
          className={cn(
            "flex h-full flex-col",
            "transition-opacity duration-200",
            isOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image src="/logo.svg" alt="HackPSU" fill sizes="40px" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-black-600">
                HackPSU
              </span>
              <span className="text-xs text-zinc-500">Admin Dashboard</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href} className="block">
                  <span
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-zinc-100 text-black-700"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span>{label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 z-30 shadow-sm"
        style={{ left: sidebarWidth + 16 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        aria-controls="app-sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <main className="flex-1 overflow-x-hidden">
        <div className="min-h-screen px-6 pb-10 pt-16 sm:px-10">{children}</div>
      </main>
    </div>
  );
}
