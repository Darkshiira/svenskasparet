import Link from "next/link";
import Image from "next/image";
import { Heart, Leaf } from "lucide-react";

const footerLinks = [
  { label: "Hem", href: "/#hem" },
  { label: "Övningar", href: "/#ovningar" },
  { label: "Mina framsteg", href: "/framsteg" },
  { label: "Om mig", href: "/om-mig" },
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[#dce9e6] py-8 text-[#688087]">
      <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
        <div>
          <Link
            href="/#hem"
            aria-label="Tillbaka till Svenskaspåret startsida"
            className="relative block h-11 w-[180px]"
          >
            <Image
              src="/images/svenskasparet-logo.png"
              alt="Svenskaspåret"
              fill
              sizes="180px"
              className="object-contain object-left"
            />
          </Link>

          <p className="mt-2 max-w-xs text-xs leading-6">
            Du behöver inte kunna allt. Du behöver bara fortsätta.
          </p>
        </div>

        <nav
          aria-label="Sidfotsmeny"
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-bold text-[#42676a] transition hover:text-[#17665d] hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-7 flex flex-col gap-2 border-t border-[#e2ebee] pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2">
          <Leaf size={14} className="text-[#478a70]" />
          Ett steg i taget.
        </span>

        <span className="inline-flex items-center gap-1.5">
          Byggt med{" "}
          <Heart size={13} className="fill-[#e6a4a0] text-[#d68e8a]" /> för att
          lära
        </span>
      </div>
    </footer>
  );
}
