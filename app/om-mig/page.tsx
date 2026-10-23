
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  ExternalLink,
  GraduationCap,
  Heart,
  Leaf,
  Lightbulb,
  Monitor,
  Sparkles,
  Sprout,
} from "lucide-react";

const projects = [
  {
    title: "Matteäventyret",
    category: "MATEMATIK FÖR BARN",
    description:
      "Ett lekfullt matteäventyr för barn mellan 6 och 9 år. Här får barn upptäcka matematik genom djur, bilder och roliga utmaningar.",
    image: "/images/Matteaventyret-screenshot.png",
    href: "https://littlemathadventures.vercel.app",
    color: "border-[#f0dfbb] bg-[#fbf6e9]",
    badge: "bg-[#f5e8c7] text-[#80652b]",
  },
  {
    title: "The Unfolding Universe",
    category: "VETENSKAP & UPPTÄCKTER",
    description:
      "En interaktiv resa genom universums historia, från Big Bang till livet på jorden. Utforska vetenskap med hjälp av berättelser och interaktiva upplevelser.",
    image: "/images/unfolding-universe-screenshot.png",
    href: "https://the-unfolding-universe.vercel.app",
    color: "border-[#dcd6ef] bg-[#f4f1fb]",
    badge: "bg-[#e7e0f5] text-[#65518f]",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_8%_20%,rgba(224,239,244,0.38),transparent_38%),#f3f7f9] text-[#153e43]">
      <div className="mx-auto w-full max-w-[1450px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="relative isolate overflow-hidden rounded-[26px] border border-[#dce9e6] bg-gradient-to-br from-[#e4f0eb] via-[#edf5f1] to-[#d9ebef]">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />

          <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_0.75fr] lg:gap-14 lg:p-14">
            <div className="order-2 lg:order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c9e3d9] bg-white/65 px-4 py-2 text-xs font-extrabold tracking-wide text-[#27655e]">
                <Leaf size={16} />
                PERSONEN BAKOM SVENSKASPÅRET
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-[-0.05em] text-[#143f43] sm:text-5xl lg:text-6xl">
                Hej, jag heter
                <span className="block text-[#27816d]">
                  Hanna!
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-[#28545c] sm:text-lg">
                Jag är lärare, webbutvecklare och en nyfiken
                människa som tycker om att göra lärande både
                roligt och tillgängligt.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#54727b] sm:text-base">
                Jag tror att man lär sig bäst när man vågar
                prova, göra misstag och upptäcka saker i sin
                egen takt. Det är tanken bakom Svenskaspåret.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://hanna-arefiportfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#155d56] px-5 text-sm font-bold text-white shadow-md shadow-[#19564e]/10 transition hover:-translate-y-0.5 hover:bg-[#104c47]"
                >
                  Min portfolio <ArrowRight size={17} />
                </a>

                <a
                  href="https://github.com/Darkshiira"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#a9cac2] bg-white/70 px-5 text-sm font-bold text-[#24545b] transition hover:bg-white"
                >
                  <Code2 size={17} />
                  GitHub
                </a>
              </div>
            </div>

            {/* PORTRAIT */}
            <div className="order-1 mx-auto w-full max-w-[320px] lg:order-2 lg:max-w-[390px]">
              <div className="relative">
                <div className="absolute -inset-3 rotate-3 rounded-[35px] bg-white/45" />

                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border-[5px] border-white shadow-xl shadow-[#214c46]/15">
                  <Image
                    src="/images/om-mig.webp"
                    alt="Hanna ute på en skogspromenad"
                    fill
                    priority
                    sizes="(max-width: 1024px) 320px, 390px"
                    className="object-cover object-center"
                  />
                </div>

                <div className="absolute -bottom-4 -left-3 flex items-center gap-2 rounded-2xl border border-white bg-[#f9f7ec] px-4 py-3 shadow-lg sm:-left-7">
                  <Sprout size={19} className="text-[#478a70]" />
                  <span className="text-xs font-extrabold text-[#315e55]">
                    Nyfikenhet får oss att växa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MY STORY */}
        <section className="grid gap-6 py-10 lg:grid-cols-[1fr_0.85fr] lg:gap-8 lg:py-14">
          <div className="rounded-[24px] border border-[#dce9e6] bg-white/85 p-6 shadow-sm shadow-[#254b4d]/5 sm:p-9">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e0efe7] text-[#247363]">
                <BookOpen size={23} />
              </span>
              <div>
                <span className="text-xs font-extrabold tracking-widest text-[#478a70]">
                  MIN BERÄTTELSE
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#183f47]">
                  Från klassrummet till kod
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-8 text-[#54727b] sm:text-[15px]">
              <p>
                Jag är utbildad och legitimerad lärare för
                årskurs F–6. Under min tid som lärare har jag
                fått se hur olika vi människor lär oss, och
                hur viktigt det är att undervisning känns
                trygg, begriplig och inspirerande.
              </p>

              <p>
                Min nyfikenhet på teknik ledde mig vidare till
                en utbildning inom fullstackutveckling, där
                jag fick lära mig att bygga webbapplikationer
                med bland annat JavaScript, TypeScript,
                React och Next.js.
              </p>

              <p>
                Idag tycker jag om att kombinera dessa två
                världar. Med min erfarenhet från klassrummet
                och mina kunskaper inom programmering vill
                jag skapa digitala upplevelser som väcker
                nyfikenhet och gör det enklare att lära.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-1 items-start gap-4 rounded-[22px] border border-[#cfe6dd] bg-gradient-to-br from-[#eaf5ef] to-[#e2f0e9] p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/70 text-[#247363]">
                <GraduationCap size={24} />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#183f47]">
                  Pedagogik
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#54727b]">
                  Att möta människor där de befinner sig,
                  förklara på olika sätt och göra lärandet
                  lustfyllt.
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-start gap-4 rounded-[22px] border border-[#ded5f5] bg-gradient-to-br from-[#f5f1fd] to-[#f0eff9] p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/70 text-[#75609e]">
                <Code2 size={23} />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#183f47]">
                  Programmering
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#54727b]">
                  Att lösa problem, bygga användarvänliga
                  lösningar och förvandla idéer till något
                  som faktiskt fungerar.
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-start gap-4 rounded-[22px] border border-[#f0dfbb] bg-gradient-to-br from-[#fbf7ec] to-[#f8f2e4] p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/70 text-[#aa803d]">
                <Lightbulb size={23} />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#183f47]">
                  Kreativitet
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#54727b]">
                  Att tänka utanför ramarna och skapa
                  lekfulla upplevelser där det finns
                  utrymme att utforska.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY SVENSKASPÅRET */}
        <section className="relative overflow-hidden rounded-[24px] border border-[#cfe4dc] bg-gradient-to-r from-[#e3f0e9] to-[#e9f3ef] p-6 sm:p-9 lg:p-11">
          <div className="relative z-10 max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-extrabold tracking-widest text-[#347665]">
              <Heart size={17} />
              VARFÖR SVENSKASPÅRET?
            </span>

            <h2 className="text-2xl font-extrabold tracking-tight text-[#183f47] sm:text-3xl">
              Små steg kan leda långt.
            </h2>

            <p className="mt-4 text-sm leading-8 text-[#42676a] sm:text-base">
              Jag skapade Svenskaspåret för att göra det
              enklare och roligare att träna svenska.
              Här ska det vara okej att svara fel, försöka
              igen och ta den tid man behöver.
            </p>

            <p className="mt-3 text-sm leading-8 text-[#42676a] sm:text-base">
              Genom korta övningar, tydlig återkoppling och
              möjligheten att följa sina framsteg hoppas jag
              kunna göra språkinlärningen lite mindre svår
              och mycket mer uppmuntrande.
            </p>

            <p className="mt-5 font-extrabold text-[#17665d]">
              Du behöver inte kunna allt. Du behöver bara fortsätta. 💚
            </p>
          </div>

          <Leaf
            size={230}
            strokeWidth={0.6}
            className="absolute -bottom-20 -right-12 rotate-[-25deg] text-[#a6d3bd]/40"
            aria-hidden="true"
          />
        </section>

        {/* PROJECTS */}
        <section className="py-12 lg:py-16">
          <div className="mb-7">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest text-[#478a70]">
              <Sparkles size={17} />
              FLER SAKER JAG BYGGT
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#183f47] sm:text-3xl">
              Mina andra projekt
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#54727b]">
              Svenskaspåret är inte mitt enda projekt!
              Jag tycker om att utforska hur teknik kan
              användas för att göra kunskap mer levande.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.title}
                className={`group overflow-hidden rounded-[24px] border transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#254b4d]/10 ${project.color}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-white/50">
                  <Image
                    src={project.image}
                    alt={`Förhandsvisning av ${project.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-6 sm:p-7">
                  <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-wide ${project.badge}`}>
                    {project.category}
                  </span>

                  <h3 className="mt-4 text-xl font-extrabold text-[#183f47]">
                    {project.title}
                  </h3>

                  <p className="mt-3 min-h-[84px] text-sm leading-7 text-[#54727b]">
                    {project.description}
                  </p>

                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#b5d4ca] bg-white/75 px-5 text-sm font-extrabold text-[#17665d] transition hover:bg-white"
                  >
                    Besök projektet <ExternalLink size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PORTFOLIO / GITHUB */}
        <section className="rounded-[24px] border border-[#dce9e6] bg-white/85 p-6 sm:p-9">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-[#183f47] sm:text-3xl">
              Vill du se mer?
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#54727b]">
              Här hittar du fler projekt och kan kika på
              hur jag bygger mina webbapplikationer.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="https://hanna-arefiportfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#cfe6dd] bg-[#edf6f2] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-[#247363]">
                <Monitor size={23} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold text-[#183f47]">
                  Min portfolio
                </span>
                <span className="mt-1 block text-xs text-[#54727b]">
                  Läs mer om mig och mina kunskaper
                </span>
              </span>
              <ArrowRight size={19} className="shrink-0 text-[#247363] transition group-hover:translate-x-1" />
            </a>

            <a
              href="https://github.com/Darkshiira"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#ded5f5] bg-[#f5f1fd] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-[#75609e]">
                <Code2 size={23} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold text-[#183f47]">
                  GitHub
                </span>
                <span className="mt-1 block text-xs text-[#54727b]">
                  Utforska mina kodprojekt
                </span>
              </span>
              <ArrowRight size={19} className="shrink-0 text-[#75609e] transition group-hover:translate-x-1" />
            </a>
          </div>
        </section>

        {/* CLOSING */}
        <div className="mt-10 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e0efe7] text-[#247363]">
            <Sprout size={23} />
          </span>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#54727b]">
            Tack för att du tittade förbi! Jag hoppas
            att Svenskaspåret kan hjälpa dig en liten bit
            på vägen.
          </p>
          <Link
            href="/#ovningar"
            className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#17665d] hover:underline"
          >
            Tillbaka till övningarna <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
}
