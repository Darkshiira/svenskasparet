
"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Flame } from "lucide-react";

type HeaderProps = {
  streak: number;
};

export default function Header({ streak }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e2ebee] bg-[#f8fbfc]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[88px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/#hem"
          aria-label="Svenskaspåret startsida"
          className="relative block h-14 w-[220px] shrink-0 sm:h-[72px] sm:w-[300px]"
        >
          <Image
            src="/images/svenskasparet-logo.png"
            alt="Svenskaspåret"
            fill
            priority
            sizes="(max-width: 640px) 220px, 300px"
            className="object-contain object-left"
          />
        </Link>

        {/* Navigation */}
        <nav
          aria-label="Huvudmeny"
          className="hidden items-center gap-7 self-stretch md:flex lg:gap-9"
        >
          <Link
            href="/#hem"
            className="flex items-center border-b-[3px] border-[#17665d] pt-[3px] text-sm font-bold text-[#12655c]"
          >
            Hem
          </Link>

          <Link
            href="/#ovningar"
            className="flex items-center border-b-[3px] border-transparent pt-[3px] text-sm font-semibold text-[#284d55] transition hover:text-[#12655c]"
          >
            Övningar
          </Link>

          <Link
            href="/#kluriga-ord"
            className="flex items-center border-b-[3px] border-transparent pt-[3px] text-sm font-semibold text-[#284d55] transition hover:text-[#12655c]"
          >
            Ord att träna på
          </Link>

          <Link
            href="/#framsteg"
            className="flex items-center border-b-[3px] border-transparent pt-[3px] text-sm font-semibold text-[#284d55] transition hover:text-[#12655c]"
          >
            Mina framsteg
          </Link>
        </nav>

        {/* Streak and profile */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/#framsteg"
            className="flex items-center gap-2 rounded-full bg-[#f5f2ed] px-3 py-2.5 text-xs font-extrabold text-[#29484f] sm:px-4"
          >
            <Flame
              size={18}
              className="fill-[#ffd1a6] text-[#f47c43]"
            />
            <span>
              {streak} {streak === 1 ? "dag" : "dagar"}
            </span>
          </Link>

          <button
            type="button"
            aria-label="Profilmeny"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#c4dfdc] text-xs font-extrabold text-[#20545a] transition hover:ring-4 hover:ring-[#c4dfdc]/40"
          >
            AN
          </button>

          <ChevronDown
            size={16}
            className="hidden text-[#234c52] sm:block"
          />
        </div>
      </div>
    </header>
  );
}
