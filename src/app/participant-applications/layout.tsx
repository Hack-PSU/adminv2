"use client";
import React from "react";
import SubNavigation from "@/components/layout/SubNavigation";

export default function ParticipantApplicationsLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Penn State", href: "/participant-applications/penn-state" },
    { label: "Other", href: "/participant-applications/other" },
  ];

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Participant Applications
      </h1>
      <SubNavigation items={navItems} baseHref="/participant-applications" />
      {children}
    </section>
  );
}