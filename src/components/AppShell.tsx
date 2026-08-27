"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="min-h-screen bg-[#092341] text-white">{children}</div>;
  }

  return (
    <>
      <SiteHeader />
      {children}
      <Footer />
    </>
  );
}
