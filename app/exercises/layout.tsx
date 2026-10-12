
"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { getCurrentStreak } from "@/app/lib/progress";

export default function ExercisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    function updateStreak() {
      setStreak(getCurrentStreak());
    }

    updateStreak();

    window.addEventListener(
      "svenskasparet-progress-updated",
      updateStreak
    );
    window.addEventListener("storage", updateStreak);

    return () => {
      window.removeEventListener(
        "svenskasparet-progress-updated",
        updateStreak
      );
      window.removeEventListener("storage", updateStreak);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_8%_20%,rgba(224,239,244,0.38),transparent_38%),#f3f7f9] text-[#153e43]">
      <Header streak={streak} />

      <main className="mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <div className="mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}
