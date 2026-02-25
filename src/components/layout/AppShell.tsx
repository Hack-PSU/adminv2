"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  BarChart2,
  CalendarDays,
  FileText,
  FileUser,
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
  { label: "Participant Applications", href: "/participant-applications/penn-state", icon: FileUser },
  { label: "Organizer Applications", href: "/organizer-applications", icon: FileText },
  { label: "Extra Credit", href: "/extra-credit/classes", icon: Star },
  { label: "Sponsorship", href: "/sponsorship", icon: Handshake },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Settings", href: "/settings/members", icon: Settings },
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
          "fixed inset-y-0 top-0 left-0 z-20 flex flex-col border-r rounded-2xl border-zinc-200 bg-zinc-50 shadow-sm transition-transform duration-300 md:sticky md:top-0 md:h-screen md:transition-none",
          isOpen
            ? "translate-x-0 md:w-[240px] w-1/2 sm:w-3/4"
            : "-translate-x-full md:!translate-x-0 md:w-0 md:border-transparent md:shadow-none",
        )}
        aria-hidden={!isOpen}
      >
        <div
          className={cn(
            "flex h-full flex-col",
            "transition-opacity duration-200",
            isOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
        <div className="flex items-center gap-2 px-2 py-2 sm:gap-3 sm:px-4 sm:py-4">
            <div className="relative h-8 w-8 overflow-hidden rounded-md sm:h-10 sm:w-10">
              <Image src="/logo.svg" alt="HackPSU" fill sizes="40px" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-wide text-black-600 sm:text-sm">
                HackPSU
              </span>
              <span className="hidden text-xs text-zinc-500 sm:block">Admin Dashboard</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              aria-controls="app-sidebar"
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-1 pb-4 sm:px-2">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href} className="block">
                  <span
                    className={cn(
                      "group flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors sm:gap-3 sm:px-3 sm:py-4 sm:text-md",
                      isActive
                        ? "bg-zinc-100 text-black-700"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                    )}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span>{label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
{!isOpen && (
         <Button
           variant="outline"
           size="icon"
           onClick={() => setIsOpen(true)}
           className="fixed top-2 left-2 z-30 h-8 w-8 sm:top-4 sm:left-4 sm:h-10 sm:w-10"
           aria-label="Open navigation"
         >
           <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
         </Button>
       )}


      <main className="flex-1 overflow-x-hidden">
        <div className="min-h-screen px-3 pb-10 pt-12 sm:px-6 sm:pt-16 md:px-10">{children}</div>
      </main>
    </div>
  );
}
