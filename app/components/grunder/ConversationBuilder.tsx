"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Star, Volume2 } from "lucide-react";
import { conversations, conversationAudio, exampleLines, conversationAudioPath, type Conversation } from "@/app/data/conversations";
import { ConversationScene, DrinkSupport, SpeakerBubble, TeaSupport, TimeBreak } from "@/app/components/grunder/ConversationVisuals";
import { recordAnswer } from "@/app/lib/progress";
import { recordCompletedRound } from "@/app/lib/exerciseProgress";
import { toGrunderTrickyWord } from "@/app/lib/grunderTrickyWords";
import { getTrickyWords, saveTrickyWord, removeTrickyWord, TRICKY_WORDS_EVENT } from "@/app/lib/trickyWords";

const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#17695d] px-5 py-3 text-sm font-bold text-white disabled:opacity-50";
const secondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#bedfd3] bg-white px-4 py-2 text-sm font-bold text-[#276b5b]";
function subscribe(update: () => void) {
  window.addEventListener(TRICKY_WORDS_EVENT, update);
  window.addEventListener("storage", update);
  return () => { window.removeEventListener(TRICKY_WORDS_EVENT, update); window.removeEventListener("storage", update); };
}
const snapshot = () => JSON.stringify(getTrickyWords());
const serverSnapshot = () => "[]";

export default function ConversationBuilder({ onBack }: { onBack: () => void }) {
  const [sourceScene, setScene] = useState<Conversation | null>(null);
  const [learnerName, setLearnerName] = useState("");
  const cleanName = learnerName.trim().replace(/\s+/g, " ");
  // Keep the name in this component's memory; it is not stored as a profile.
  const scene = sourceScene?.id === "greeting" ? {
    ...sourceScene,
    steps: sourceScene.steps.map((item, n) => ({
      ...item,
      answer: item.answer.replace(/\bSam\b/g, cleanName || "…").replace("….", "…"),
      alternative: item.alternative.replace(/\bSam\b/g, cleanName || "…").replace("….", "…"),
      ...(n === 1 ? { cue: "📛", hint: "Skriv ditt namn", hintEn: "Write your name" } : {}),
    })),
  } : sourceScene;
  const [phase, setPhase] = useState<"example" | "practice" | "done">("example");
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [chosenReplies, setChosenReplies] = useState<string[]>([]);
  const [english, setEnglish] = useState(false);
  const [orders, setOrders] = useState<boolean[]>([]);
  const [audioMessage, setAudioMessage] = useState("");
  const [autoSaved, setAutoSaved] = useState(false);
  const saved = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const locked = useRef(false);
  const active = useRef(true);
  const advancing = useRef(false);
  const player = useRef<HTMLAudioElement | null>(null);
  const generation = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const step = scene?.steps[index];
  const isNameStep = scene?.id === "greeting" && index === 1;
  const acceptsChoice = Boolean(step?.choiceReplies);
  const selectionCorrect = selection !== null && Boolean(step && (selection === step.answer || (acceptsChoice && selection === step.alternative)));
  function responseFor(item: NonNullable<typeof step>, value: string) {
    return item.choiceReplies ? (value === item.alternative ? item.choiceReplies.alternative : item.choiceReplies.answer) : item.reply;
  }
  const previousStep = scene?.steps[index - 1];
  const prompt = step && previousStep && step.prompt === previousStep.reply && chosenReplies[index - 1]
    ? responseFor(previousStep, chosenReplies[index - 1]) : step?.prompt;
  const selectedReply = step ? responseFor(step, selectionCorrect && selection ? selection : step.answer) : "";

  function stop() {
    generation.current += 1;
    if (player.current) { player.current.pause(); player.current.src = ""; player.current = null; }
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }
  useEffect(() => {
    active.current = true;
    const leave = () => { active.current = false; stop(); };
    window.addEventListener("exercise:leave", leave);
    window.addEventListener("popstate", leave);
    window.addEventListener("pagehide", leave);
    return () => {
      active.current = false; stop();
      window.removeEventListener("exercise:leave", leave);
      window.removeEventListener("popstate", leave);
      window.removeEventListener("pagehide", leave);
    };
  }, []);
  useEffect(() => { heading.current?.focus(); }, [sourceScene, phase, index]);

  // Optional recordings use the exact filename listed in AUDIO.txt.
  // Until uploaded, use an installed Swedish voice; never silently use another language.
  async function speak(text: string) {
    stop(); setAudioMessage("");
    const token = generation.current;
    try {
      // A personal name must never play the old recording saying Sam.
      if (!conversationAudio.includes(text)) throw new Error("Use Swedish speech for a personal phrase");
      const clip = new Audio(conversationAudioPath(text));
      player.current = clip;
      await clip.play();
    }
    catch {
      if (!active.current || token !== generation.current) return;
      const synth = window.speechSynthesis;
      const voice = synth?.getVoices().find((item) => /^sv(?:-|$)/i.test(item.lang));
      if (!voice) { setAudioMessage("Svenskt ljud saknas. / Swedish audio is unavailable on this device."); return; }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice; utterance.lang = "sv-SE"; utterance.rate = 0.85;
      utterance.onerror = () => { if (token === generation.current && active.current) setAudioMessage("Ljudet kunde inte spelas. / Could not play audio."); };
      synth.speak(utterance);
    }
  }
  function listen(text: string) {
    return <button type="button" className={secondary} onClick={() => void speak(text)} aria-label={`Lyssna: ${text}`}><Volume2 aria-hidden="true" size={18} /><span>{english ? "Listen" : "Lyssna"}</span></button>;
  }
  function open(next: Conversation) {
    stop(); setScene(next); setPhase("example"); setIndex(0); setScore(0); setChosenReplies([]); setSelection(null); setAutoSaved(false); setAudioMessage(""); locked.current = false; advancing.current = false;
    setOrders(next.steps.map(() => Math.random() < 0.5));
  }
  const savedQuestion = scene && step ? toGrunderTrickyWord({
    mode: "situations", choices: [step.answer, step.alternative],
    data: { id: `conversation-${scene.id}-${index}`, place: scene.place, title: `${scene.title} · ${index + 1}`, context: `${step.cue} ${step.hint}`, speech: step.prompt, answer: step.answer, options: [step.answer, step.alternative], reply: step.reply, explanation: step.hint },
  }) : null;
  const isSaved = savedQuestion ? (JSON.parse(saved) as { id: string; exercise: string }[]).some((item) => item.id === savedQuestion.id && item.exercise === "grunder") : false;
  function choose(value: string) {
    if (!active.current || locked.current || !step || !savedQuestion || !scene || phase !== "practice" || (isNameStep && !cleanName)) return;
    locked.current = true; advancing.current = false; stop(); setSelection(value);
    const correct = value === step.answer || (Boolean(step.choiceReplies) && value === step.alternative);
    setChosenReplies((previous) => { const next = [...previous]; next[index] = correct ? value : step.answer; return next; });
    recordAnswer(correct);
    if (correct) { setScore((n) => n + 1); removeTrickyWord(savedQuestion.id, "grunder"); setAutoSaved(false); }
    else { saveTrickyWord(savedQuestion); setAutoSaved(true); }
    if (index === scene.steps.length - 1) recordCompletedRound("grunder");
  }
  function next() {
    if (!scene || selection === null || !active.current || advancing.current) return;
    advancing.current = true; stop();
    if (index === scene.steps.length - 1) { setPhase("done"); return; }
    locked.current = false; setIndex((n) => n + 1); setSelection(null); setAutoSaved(false);
  }
  function toggleSave() {
    if (!savedQuestion || !active.current) return;
    setAutoSaved(false);
    if (isSaved) removeTrickyWord(savedQuestion.id, "grunder"); else saveTrickyWord(savedQuestion);
  }

  return <section className="mx-auto max-w-3xl rounded-[28px] border border-[#bedfd3] bg-white p-4 text-[#183f47] sm:p-9">
    <div className="mb-6 flex flex-wrap justify-between gap-3">
      <button className={secondary} onClick={() => { stop(); if (scene) { setScene(null); setAudioMessage(""); } else onBack(); }}><ArrowLeft size={17} />{english ? "Back" : "Tillbaka"}</button>
      <button className={secondary} aria-pressed={english} onClick={() => setEnglish((value) => !value)}>{english ? "Svenska" : "English help"}</button>
    </div>
    <h1 ref={heading} tabIndex={-1} className="text-2xl font-extrabold outline-none sm:text-3xl">{scene ? (english ? scene.titleEn : scene.title) : "Bygg ett samtal"}</h1>
    <p role="status" className="mt-2 text-sm text-[#54727b]">{audioMessage}</p>
    {!scene ? <>
      <p className="mt-3 leading-7 text-[#54727b]">{english ? "Choose a scene. Listen to the example, then try." : "Välj en bild. Lyssna på exemplet. Prova sedan själv."}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{conversations.map((item) => <button key={item.id} className="rounded-2xl border border-[#bedfd3] bg-[#eff7f3] p-4 text-left hover:bg-[#e3f0e9]" onClick={() => open(item)}>
        <ConversationScene scene={item} /><span className="mt-3 block text-lg font-bold">{item.emoji} {english ? item.titleEn : item.title}</span><span className="mt-2 block text-sm">{english ? "3 replies · watch first" : "3 svar · se ett exempel först"} →</span>
      </button>)}</div>
    </> : phase === "done" ? <div className="py-8 text-center">
      <span className="text-5xl" aria-hidden="true">🌿</span><h2 className="mt-5 text-2xl font-bold">{english ? "Well done!" : "Bra jobbat!"}</h2>
      <p className="mt-3">{english ? `${score} of ${scene.steps.length} replies correct on your first try.` : `${score} av ${scene.steps.length} svar rätt på första försöket.`}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3"><button className={primary} onClick={() => open(scene)}><RotateCcw size={17} />{english ? "Try again" : "Öva igen"}</button><button className={secondary} onClick={() => { stop(); setScene(null); }}>{english ? "Another scene" : "Välj ett nytt samtal"}</button></div>
    </div> : phase === "example" ? <>
      <div className="my-5"><ConversationScene scene={scene} /></div>
      <h2 className="mb-4 font-bold">{english ? "Example · listen and follow" : "Exempel · lyssna och följ med"}</h2>
      {scene.id === "cafe" && <DrinkSupport english={english} />}
      {scene.id === "visit" && <TeaSupport english={english} />}
      <div className="space-y-5">{exampleLines(scene).map((line, n) => line.role === "time" ? <TimeBreak key={n} english={english} /> : <SpeakerBubble key={n} role={line.role} portrait={scene.id === "cafe" ? "cafe" : scene.id === "greeting" ? "alex" : scene.id === "clothes" ? "clothes" : scene.id === "visit" ? "visit" : undefined} name={line.role === "you" ? (english ? "You" : "Du") : scene.other}>
        <p className="mb-3 font-bold">{line.text}</p>{listen(line.text)}
      </SpeakerBubble>)}</div>
      <button className={`${primary} mt-6`} onClick={() => { stop(); setPhase("practice"); }}>{english ? "My turn" : "Min tur"}<ArrowRight size={17} /></button>
    </> : step && <>
      <div className="mt-4 flex justify-between text-sm"><span>{english ? "Your turn" : "Din tur"}</span><span>{index + 1} / {scene.steps.length}</span></div>
      <progress className="my-4 h-2 w-full accent-[#17695d]" value={index + (selection !== null ? 1 : 0)} max={scene.steps.length} aria-label={english ? "Completed replies" : "Besvarade repliker"} />
      <ConversationScene scene={scene} />
      {index > 0 && <details className="mt-4 rounded-xl border border-[#bedfd3] p-3"><summary className="cursor-pointer text-sm font-bold">{english ? "Earlier in the conversation" : "Tidigare i samtalet"}</summary><div className="mt-3 space-y-2">{scene.steps.slice(0, index).map((previous, n) => <div key={n} className="rounded-xl bg-[#f6faf8] p-3 text-sm"><p>{scene.other}: {previous.prompt}</p><p className="my-2 font-bold">{english ? "You" : "Du"}: {chosenReplies[n] ?? previous.answer}</p>{listen(chosenReplies[n] ?? previous.answer)}</div>)}</div></details>}
      {step.timeBreakBefore && <TimeBreak english={english} />}
      <div className="my-5"><SpeakerBubble role="other" portrait={scene.id === "cafe" ? "cafe" : scene.id === "greeting" ? "alex" : scene.id === "clothes" ? "clothes" : scene.id === "visit" ? "visit" : undefined} name={scene.other}><p className="mb-3 text-lg font-bold">{prompt}</p>{listen(prompt ?? step.prompt)}</SpeakerBubble></div>
      {scene.id === "cafe" && <DrinkSupport english={english} focus={index === 0 ? "coffee" : index === 1 ? "milk" : "both"} />}
      {scene.id === "visit" && index === 1 && <TeaSupport english={english} />}
      <div className="mb-4 rounded-2xl border border-[#bedfd3] p-4"><p className="text-4xl" aria-hidden="true">{step.cue}</p><p className="mt-3 font-bold">{english ? step.hintEn : step.hint}</p></div>
      <p className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#17695d]">{english ? "Your reply" : "Ditt svar"} ↓</p>
      {isNameStep ? <form onSubmit={(event) => { event.preventDefault(); if (cleanName) choose(step.answer); }} className="rounded-2xl border-2 border-[#bedfd3] bg-[#f6faf8] p-5">
        <label htmlFor="conversation-name" className="mb-3 block font-bold">{english ? "Your name" : "Ditt namn"}</label>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-lg font-bold">Jag heter</span>
          <input id="conversation-name" name="given-name" autoComplete="given-name" type="text" maxLength={60} value={learnerName} disabled={selection !== null} onChange={(event) => setLearnerName(event.target.value)} placeholder={english ? "Your name" : "Ditt namn"} required className="min-h-12 min-w-0 flex-1 rounded-xl border border-[#a8cbbd] bg-white px-4 py-3 text-lg text-[#183f47] focus:outline-2 focus:outline-offset-2 focus:outline-[#17695d] disabled:bg-[#edf6f0]" />
        </div>
        <p className="my-3 text-sm text-[#54727b]">{english ? "Any name is welcome. You are practising how to introduce yourself." : "Alla namn går bra. Du övar på att presentera dig."}</p>
        <button type="submit" className={primary} disabled={!cleanName || selection !== null}>{english ? "Say my name" : "Svara"}<ArrowRight size={17} /></button>
      </form> : <div className="grid gap-3">{(orders[index] ? [step.answer, step.alternative] : [step.alternative, step.answer]).map((text) => <div key={text} className={`flex flex-wrap items-center gap-2 rounded-2xl border-2 p-3 ${selection !== null && (text === step.answer || (acceptsChoice && text === step.alternative)) ? "border-[#70af8f] bg-[#e4f3e9]" : selection === text ? "border-[#dba899] bg-[#fff0e9]" : "border-[#d3e5da]"}`}>
        <button className="min-h-12 min-w-0 flex-1 px-2 text-left font-bold disabled:cursor-default" disabled={selection !== null} onClick={() => choose(text)}>{text}{selection !== null && (text === step.answer || (acceptsChoice && text === step.alternative)) && <Check className="ml-2 inline" size={18} aria-label="Rätt svar" />}</button>{listen(text)}
      </div>)}</div>}
      {selection !== null && <div className="mt-6 space-y-4 rounded-2xl bg-transparent p-0 sm:space-y-0 sm:bg-[#edf6f0] sm:p-5">
        <p role="status" className="font-bold">{selectionCorrect ? (english ? "That fits!" : "Det passar bra!") : (english ? "For this picture, say:" : "Till den här bilden säger vi:")}</p>
        {!selectionCorrect && <p className="mt-2 font-bold">{step.answer}</p>}
        <div className="my-4"><SpeakerBubble role="you" name={english ? "You" : "Du"}><p className="mb-3 font-bold">{selectionCorrect ? selection : step.answer}</p>{listen(selectionCorrect && selection ? selection : step.answer)}</SpeakerBubble></div>
        <SpeakerBubble role="other" portrait={scene.id === "cafe" ? "cafe" : scene.id === "greeting" ? "alex" : scene.id === "clothes" ? "clothes" : scene.id === "visit" ? "visit" : undefined} name={scene.other}><p className="mb-3 font-bold">{selectedReply}</p>{listen(selectedReply)}</SpeakerBubble>
        {!acceptsChoice && !isNameStep && <button className={`${secondary} mt-3`} onClick={toggleSave} aria-pressed={isSaved}><Star size={16} className={isSaved ? "fill-current" : ""} />{isSaved ? "Sparat – ta bort" : "Spara som klurigt ord"}</button>}
        {!acceptsChoice && !isNameStep && isSaved && <p className="mt-3 text-sm">{autoSaved ? "Frasen har sparats automatiskt under Mina kluriga ord." : "Frasen är sparad under Mina kluriga ord."}</p>}
        <button className={`${primary} mt-4 flex`} onClick={next}>{index === scene.steps.length - 1 ? (english ? "Finish" : "Visa resultat") : (scene.steps[index + 1]?.timeBreakBefore ? (english ? "Some time later" : "En stund senare") : (english ? "Continue" : "Fortsätt"))}<ArrowRight size={17} /></button>
      </div>}
      <button className={`${secondary} mt-5`} onClick={() => { stop(); setPhase("example"); }}>{english ? "See the example again" : "Se exemplet igen"}</button>
    </>}
  </section>;
}
