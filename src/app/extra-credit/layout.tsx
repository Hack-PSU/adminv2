"use client";
import React from "react";
import SubNavigation from "@/components/layout/SubNavigation";

export default function ExtraCreditLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Manage Classes", href: "/extra-credit/classes" },
    { label: "Manage Assignments", href: "/extra-credit/assignments" },
  ];

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Extra Credit
      </h1>
      <SubNavigation items={navItems} baseHref="/extra-credit" />
      {children}
    </section>
  );
}