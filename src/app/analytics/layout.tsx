import AnalyticsNav from "./AnalyticsNav";

type AnalyticsLayoutProps = {
  children: React.ReactNode;
};

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Analytics</h1>
        <p className="text-sm text-zinc-500">
          Monitor event metrics, registrations, and real-time trends.
        </p>
      </header>
      <AnalyticsNav />
      {children}
    </section>
  );
}
