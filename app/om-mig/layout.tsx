"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { getCurrentStreak } from "@/app/lib/progress";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const updateStreak = () => {
      setStreak(getCurrentStreak());
    };

    updateStreak();

    window.addEventListener("svenskasparet-progress-updated", updateStreak);
    window.addEventListener("storage", updateStreak);

    return () => {
      window.removeEventListener(
        "svenskasparet-progress-updated",
        updateStreak,
      );
      window.removeEventListener("storage", updateStreak);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f7f9]">
      <Header streak={streak} />
      {children}
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}
