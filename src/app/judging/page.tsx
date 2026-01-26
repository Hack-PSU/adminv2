import { redirect } from "next/navigation";

export default function JudgingPage() {
  redirect("/hackers");

/*
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">Judging</h1>
        <p className="text-sm text-zinc-500">
          Coordinate judging assignments, criteria, and scoring workflows.
        </p>
      </header>
    </section>
  );
*/
}
