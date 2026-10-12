
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex flex-col items-start justify-between gap-3 border-t border-[#e2ebee] py-6 text-xs text-[#688087] sm:flex-row sm:items-center">
      <Link
        href="/#hem"
        aria-label="Tillbaka till Svenskaspåret startsida"
        className="relative block h-9 w-[150px] shrink-0"
      >
        <Image
          src="/images/svenskasparet-logo.png"
          alt="Svenskaspåret"
          fill
          sizes="150px"
          className="object-contain object-left"
        />
      </Link>

      <p>Du behöver inte kunna allt. Du behöver bara fortsätta.</p>

      <span>Byggt för att lära 💚</span>
    </footer>
  );
}
