"use client";

import SubNavigation from "@/components/layout/SubNavigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Members", href: "/settings/members" },
    { label: "Flags", href: "/settings/flags" },
    { label: "Hackathons", href: "/settings/hackathon" },
  ];

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
      <SubNavigation items={navItems} baseHref="/settings" />
      <div className="pt-3">{children}</div>
    </section>
  );
}
