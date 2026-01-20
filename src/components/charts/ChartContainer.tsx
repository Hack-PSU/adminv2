import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChartContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function ChartContainer({
  title,
  description,
  children,
  className,
}: ChartContainerProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div className="mb-4 space-y-1">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        {description ? (
          <p className="text-sm text-zinc-500">{description}</p>
        ) : null}
      </div>
      <div className="w-full">{children}</div>
    </section>
  );
}
