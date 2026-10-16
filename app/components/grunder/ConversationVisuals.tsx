import type { ReactNode } from "react";
import Image from "next/image";
import { Coffee, Milk, UserRound } from "lucide-react";
import type { Conversation } from "@/app/data/conversations";


// A consistent portrait anchors the speaker beside each of their bubbles.
export function SpeakerAvatar({ name, portrait }: { name: string; portrait?: "cafe" | "alex" | "clothes" | "visit" }) {
  if (portrait) return <span role="img" aria-label={name} className="h-16 w-14 shrink-0 rounded-2xl border-2 border-[#bedfd3] bg-[#edf6f0] sm:h-20 sm:w-[72px]" style={{ backgroundImage: `url(/images/grunder/${portrait === "alex" ? "alex-scene" : portrait === "clothes" ? "clothes-scene" : portrait === "visit" ? "friend-scene" : "cafe-scene"}.png)`, backgroundSize: "420% auto", backgroundPosition: "28% 13%", backgroundRepeat: "no-repeat" }} />;
  return <svg viewBox="0 0 80 88" role="img" aria-label={name} className="h-16 w-14 shrink-0 sm:h-20 sm:w-[72px]">
    <rect x="1" y="1" width="78" height="86" rx="25" fill="#e8f2eb" />
    <path d="M12 87V70Q12 52 40 52Q68 52 68 70V87" fill="#d49a70" />
    <path d="M25 60L31 55V72H49V55L55 60V87H25Z" fill="#35745f" />
    <path d="M34 46H46V58Q40 65 34 58Z" fill="#a97150" />
    <ellipse cx="40" cy="32" rx="21" ry="24" fill="#b67f5c" />
    <path d="M19 30Q16 7 39 7Q65 6 62 32L52 23Q37 29 19 30Z" fill="#51483c" />
    <circle cx="33" cy="33" r="2" fill="#342f2a" /><circle cx="47" cy="33" r="2" fill="#342f2a" />
    <path d="M34 44Q40 49 46 44" fill="none" stroke="#704737" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}

export function SpeakerBubble({ role, name, children, portrait }: { role: "other" | "you"; name: string; children: ReactNode; portrait?: "cafe" | "alex" | "clothes" | "visit" }) {
  const other = role === "other";
  return <div className={`flex items-end gap-2 sm:gap-3 ${other ? "pr-5 sm:pr-12" : "flex-row-reverse pl-5 sm:pl-12"}`}>
    {other ? <SpeakerAvatar name={name} portrait={portrait} /> : <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full border border-[#bedfd3] bg-[#f0f7f3] text-[#17695d] sm:size-12"><UserRound size={24} /></span>}
    <div className={`relative min-w-0 flex-1 rounded-2xl p-4 sm:p-5 ${other ? "rounded-bl-sm bg-[#edf6f0] text-[#183f47]" : "rounded-br-sm bg-[#17695d] text-white"}`}>
      <span aria-hidden="true" className={`absolute bottom-3 size-3 rotate-45 ${other ? "-left-1.5 bg-[#edf6f0]" : "-right-1.5 bg-[#17695d]"}`} />
      <p className={`mb-2 text-xs font-extrabold ${other ? "text-[#54727b]" : "text-white/85"}`}>{name}</p>
      {children}
    </div>
  </div>;
}

const sceneAssets: Record<string, { file: string; alt: string }> = {
  greeting: { file: "alex-scene", alt: "Alex hälsar på en person på en stig i parken." },
  cafe: { file: "cafe-scene", alt: "En caféanställd och en kund vid en disk med kaffe och mjölk." },
  clothes: { file: "clothes-scene", alt: "En kassörska till vänster hjälper en kund att köpa en tröja. En kortläsare står på disken." },
  visit: { file: "friend-scene", alt: "En vän till vänster välkomnar sin gäst. På bordet står en tekanna och koppar med te." },
};
export function ConversationScene({ scene }: { scene: Conversation }) {
  const asset = sceneAssets[scene.id];
  if (!asset) return null;
  return <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[22px] bg-[#edf6f0] sm:aspect-[16/9]">
    <Image src={`/images/grunder/${asset.file}.png`} alt={asset.alt} fill sizes="(max-width: 768px) 90vw, 700px" className="object-cover" />
  </div>;
}

export function TimeBreak({ english }: { english: boolean }) {
  return <div role="separator" aria-label={english ? "Some time later" : "En stund senare"} className="my-7 flex items-center gap-3 text-[#54727b]">
    <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" className="h-3 min-w-0 flex-1"><path d="M0 6Q5 0 10 6T30 6T50 6T70 6T90 6T110 6T130 6" fill="none" stroke="#a8cbbd" strokeWidth="2" /></svg>
    <span className="shrink-0 rounded-full border border-[#d1e4da] bg-[#f6faf8] px-4 py-2 text-xs font-bold">{english ? "Some time later" : "En stund senare"}</span>
    <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" className="h-3 min-w-0 flex-1"><path d="M0 6Q5 0 10 6T30 6T50 6T70 6T90 6T110 6T130 6" fill="none" stroke="#a8cbbd" strokeWidth="2" /></svg>
  </div>;
}

export function TeaSupport({ english }: { english: boolean }) {
  return <div className="my-4 flex items-center justify-center gap-4 rounded-2xl border-2 border-[#c9dbc5] bg-[#f3f7ec] p-4">
    <svg viewBox="0 0 120 100" role="img" aria-label={english ? "A cup of tea" : "En kopp te"} className="h-24 w-28 shrink-0">
      <ellipse cx="53" cy="88" rx="45" ry="7" fill="#dce7cb" />
      <path d="M84 43H94Q114 43 108 61Q104 73 85 69" fill="none" stroke="#7c9c72" strokeWidth="7" />
      <path d="M20 40H88L83 74Q79 87 54 87Q29 87 25 74Z" fill="#e5edd5" stroke="#7c9c72" strokeWidth="3" />
      <ellipse cx="54" cy="41" rx="34" ry="9" fill="#b67b36" stroke="#7c9c72" strokeWidth="3" />
      <path d="M67 40L72 58V66" fill="none" stroke="#fff9e8" strokeWidth="2" /><rect x="64" y="63" width="17" height="20" rx="3" fill="#4f8060" />
      <path d="M39 27Q30 19 40 10M61 26Q52 18 62 8" fill="none" stroke="#a4b99c" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <p className="font-extrabold text-[#183f47]">En kopp te{english && <span className="mt-1 block text-xs font-normal text-[#54727b]">A cup of tea</span>}</p>
  </div>;
}

export function DrinkSupport({ english, focus = "both" }: { english: boolean; focus?: "coffee" | "milk" | "both" }) {
  return <div className="my-4 grid grid-cols-2 gap-3" aria-label={english ? "Picture support: coffee and milk" : "Bildstöd: kaffe och mjölk"}>
    <div className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 ${focus === "coffee" || focus === "both" ? "border-[#cbb495] bg-[#faf4ea]" : "border-[#e5ebe6] bg-[#f8faf8]"}`}>
      <Coffee aria-hidden="true" size={54} strokeWidth={1.7} className="text-[#946944]" />
      <span className="text-sm font-extrabold text-[#183f47]">En kaffe{english && <span className="block text-xs font-normal text-[#54727b]">A coffee</span>}</span>
    </div>
    <div className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 ${focus === "milk" || focus === "both" ? "border-[#a8cbbd] bg-[#edf6f0]" : "border-[#e5ebe6] bg-[#f8faf8]"}`}>
      <Milk aria-hidden="true" size={54} strokeWidth={1.7} className="text-[#548677]" />
      <span className="text-sm font-extrabold text-[#183f47]">Mjölk{english && <span className="block text-xs font-normal text-[#54727b]">Milk</span>}</span>
    </div>
  </div>;
}
