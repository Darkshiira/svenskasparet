"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeToVoices(onChange: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window))
    return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", onChange);
  return () =>
    window.speechSynthesis.removeEventListener("voiceschanged", onChange);
}
function voiceSnapshot() {
  if (typeof window === "undefined") return "";
  if (!("speechSynthesis" in window)) return "unsupported";
  return window.speechSynthesis
    .getVoices()
    .filter((v) => /^sv(?:[-_]|$)/i.test(v.lang))
    .map((v) => v.voiceURI)
    .join("|");
}
const serverVoiceSnapshot = () => "";
export function useSwedishSpeech() {
  const voices = useSyncExternalStore(
    subscribeToVoices,
    voiceSnapshot,
    serverVoiceSnapshot,
  );
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const mounted = useRef(false);
  const generation = useRef(0);
  const cancel = useCallback(() => {
    generation.current += 1;
    if (utterance.current) {
      utterance.current.onend = null;
      utterance.current.onerror = null;
      utterance.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
  }, []);
  useEffect(() => {
    mounted.current = true;
    const onPageHide = () => cancel();
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("exercise:leave", onPageHide);
    window.addEventListener("popstate", onPageHide);
    return () => {
      mounted.current = false;
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("exercise:leave", onPageHide);
      window.removeEventListener("popstate", onPageHide);
      cancel();
    };
  }, [cancel]);
  const stop = useCallback(() => {
    cancel();
    setPlaying(false);
    setError("");
  }, [cancel]);
  function speak(text: string, slow: boolean, onComplete: () => void) {
    cancel();
    setPlaying(false);
    setError("");
    if (!("speechSynthesis" in window)) {
      setError(
        "Din webbläsare stöder inte uppläsning. Prova en annan webbläsare.",
      );
      return;
    }
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => /^sv(?:[-_]|$)/i.test(v.lang));
    if (!voice) {
      setError(
        "Ingen svensk röst är tillgänglig ännu. Vänta en stund och försök igen. Om det inte hjälper, prova en annan webbläsare eller installera en svensk röst på enheten.",
      );
      return;
    }
    const token = generation.current;
    const message = new SpeechSynthesisUtterance(text);
    message.lang = "sv-SE";
    message.voice = voice;
    message.rate = slow ? 0.65 : 0.85;
    message.onend = () => {
      if (!mounted.current || token !== generation.current) return;
      utterance.current = null;
      setPlaying(false);
      onComplete();
    };
    message.onerror = () => {
      if (!mounted.current || token !== generation.current) return;
      utterance.current = null;
      setPlaying(false);
      setError(
        "Ljudet kunde inte spelas upp. Kontrollera ljudet på enheten och försök igen.",
      );
    };
    utterance.current = message;
    setPlaying(true);
    try {
      window.speechSynthesis.speak(message);
    } catch {
      message.onerror?.(new Event("error") as SpeechSynthesisErrorEvent);
    }
  }
  return {
    speak,
    stop,
    playing,
    error,
    hasSwedishVoice: !!voices && voices !== "unsupported",
  };
}

