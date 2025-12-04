"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to hackers page
    router.push("/hackers");
  }, [router]);

  return (
    <section className="space-y-4">
    </section>
  );
}
