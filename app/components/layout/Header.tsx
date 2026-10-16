"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, Menu, X } from "lucide-react";

type HeaderProps = {
  streak: number;
};

const navigation = [
  { label: "Hem", href: "/#hem" },
  { label: "Övningar", href: "/#ovningar" },
  { label: "Ord att träna på", href: "/exercises/kluriga-ord" },
  { label: "Mina framsteg", href: "/framsteg" },
];

export default function Header({ streak }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleExerciseNavigation() {
    window.dispatchEvent(new Event("exercise:leave"));
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#e2ebee] bg-[#f8fbfc]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1500px] items-center justify-between gap-2 px-3 sm:min-h-[88px] sm:gap-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/#hem"
          aria-label="Svenskaspåret startsida"
          onClick={() => {
            handleExerciseNavigation();
            setMenuOpen(false);
          }}
          className="relative block h-12 min-w-0 w-[175px] shrink sm:h-[72px] sm:w-[300px]"
        >
          <Image
            src="/images/svenskasparet-logo.png"
            alt="Svenskaspåret"
            fill
            priority
            sizes="(max-width: 640px) 175px, 300px"
            className="object-contain object-left"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Huvudmeny"
          className="hidden items-center gap-7 self-stretch md:flex lg:gap-9"
        >
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleExerciseNavigation}
              className={`flex items-center border-b-[3px] pt-[3px] text-sm transition ${
                index === 0
                  ? "border-[#17665d] font-bold text-[#12655c]"
                  : "border-transparent font-semibold text-[#284d55] hover:text-[#12655c]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Streak and mobile menu */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/#framsteg"
            onClick={handleExerciseNavigation}
            aria-label={`Lärandeföljd: ${streak} ${streak === 1 ? "dag" : "dagar"}`}
            className="flex items-center gap-1.5 rounded-full bg-[#f5f2ed] px-2.5 py-2 text-sm font-extrabold text-[#29484f] sm:gap-2 sm:px-4"
          >
            <Flame size={18} className="fill-[#ffd1a6] text-[#f47c43]" />
            <span>{streak}</span>
            <span className="hidden sm:inline">
              {streak === 1 ? "dag" : "dagar"}
            </span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label={menuOpen ? "Stäng menyn" : "Öppna menyn"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[#20545a] transition hover:bg-[#e8f2f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17665d] md:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobilmeny"
          className="border-t border-[#e2ebee] bg-[#f8fbfc] px-4 py-3 shadow-lg md:hidden"
        >
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                handleExerciseNavigation();
                setMenuOpen(false);
              }}
              className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-sm transition hover:bg-[#e8f2f1] ${
                index === 0
                  ? "font-bold text-[#12655c]"
                  : "font-semibold text-[#284d55]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
