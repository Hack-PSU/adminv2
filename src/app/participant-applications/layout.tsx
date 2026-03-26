"use client";
import React from "react";
import { usePathname } from "next/navigation";
import SubNavigation from "@/components/layout/SubNavigation";
import StatusBreakdownBar from "@/components/StatusBreakdownBar";
import { usePennStateRegistrationScores, useOtherRegistrationScores } from "@/common/api/registration/hook";

export default function ParticipantApplicationsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: psuData = [] } = usePennStateRegistrationScores();
  const { data: otherData = [] } = useOtherRegistrationScores();

  const isOther = pathname.includes("/other");
  const activeData = isOther ? otherData : psuData;

  const navItems = [
    { label: "Penn State", href: "/participant-applications/penn-state" },
    { label: "Other", href: "/participant-applications/other" },
  ];

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Participant Applications
      </h1>
      <div className="flex items-center gap-4">
        <SubNavigation items={navItems} baseHref="/participant-applications" />
        <StatusBreakdownBar data={activeData} />
      </div>
      {children}
    </section>
  );
}
