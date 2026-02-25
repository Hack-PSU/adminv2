import SubNavigation from "@/components/layout/SubNavigation";

type AnalyticsLayoutProps = {
  children: React.ReactNode;
};

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  const navItems = [
    { label: "Summary", href: "/analytics/summary" },
    { label: "Attendance", href: "/analytics/attendance" },
    { label: "Events", href: "/analytics/events" },
    { label: "Organizers", href: "/analytics/organizers" },
  ];

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Analytics</h1>
      </header>
      <SubNavigation items={navItems} baseHref="/analytics" />
      {children}
    </section>
  );
}
