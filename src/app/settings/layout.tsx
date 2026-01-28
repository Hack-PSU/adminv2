"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
  { name: "Members", href: "/settings/members" },
  { name: "Flags", href: "/settings/flags" },
  { name: "Hackathons", href: "/settings/hackathon" },
];

  return (
    <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>


<nav className="flex space-x-4 border-b pb-2">
  {tabs.map((tab) => {
    const active = pathname.startsWith(tab.href);

    return (
      <Link
        key={tab.href}
        href={tab.href}
        className={cn(
          "text-base font-semibold pb-2 transition-colors",
          active
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-black"
        )}
      >
        {tab.name}
      </Link>
    );
  })}
</nav>



      <div className="pt-3">{children}</div>
    </section>
  );
}
