"use client";

import { useSyncExternalStore } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { getCurrentStreak } from "@/app/lib/progress";

function subscribe(onChange: () => void) {
  window.addEventListener(
    "svenskasparet-progress-updated",
    onChange,
  );
  window.addEventListener("storage", onChange);
  window.addEventListener("focus", onChange);

  return () => {
    window.removeEventListener(
      "svenskasparet-progress-updated",
      onChange,
    );
    window.removeEventListener("storage", onChange);
    window.removeEventListener("focus", onChange);
  };
}

function getServerSnapshot() {
  return 0;
}

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const streak = useSyncExternalStore(
    subscribe,
    getCurrentStreak,
    getServerSnapshot,
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8f1] text-[#183f47]">
      <Header streak={streak} />

      <div className="flex-1">{children}</div>

      <div className="mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}