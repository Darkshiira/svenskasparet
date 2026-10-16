"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** public/audio/grunder/apple.mp3 is served at /audio/grunder/apple.mp3. */
export function getGrunderAudioPath(id: string | undefined): string | null {
  return id ? `/audio/grunder/${encodeURIComponent(id)}.mp3` : null;
}

export function useGrunderAudio() {
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const generation = useRef(0);
  const mounted = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const cancel = useCallback(() => {
    generation.current += 1;
    const player = playerRef.current;
    playerRef.current = null;
    if (!player) return;
    player.onended = null;
    player.onerror = null;
    player.pause();
    player.removeAttribute("src");
    player.load();
  }, []);

  const stop = useCallback(() => {
    cancel();
    setPlaying(false);
    setError("");
  }, [cancel]);

  useEffect(() => {
    mounted.current = true;
    function leave() { stop(); }
    window.addEventListener("exercise:leave", leave);
    window.addEventListener("popstate", leave);
    window.addEventListener("pagehide", leave);
    return () => {
      mounted.current = false;
      window.removeEventListener("exercise:leave", leave);
      window.removeEventListener("popstate", leave);
      window.removeEventListener("pagehide", leave);
      cancel();
    };
  }, [cancel, stop]);

  function play(src: string | null, slow: boolean, onComplete: () => void) {
    cancel();
    setError("");
    setPlaying(false);
    if (!src) {
      setError("Ljudfilen till den här frågan saknas. Välj en annan fråga och försök igen.");
      return;
    }
    const token = generation.current;
    const isCurrent = () => mounted.current && generation.current === token;
    function fail(message: string) {
      if (!isCurrent()) return;
      cancel();
      setPlaying(false);
      setError(message);
    }
    try {
      const player = new Audio(src);
      playerRef.current = player;
      player.preload = "auto";
      player.playbackRate = slow ? 0.75 : 1;
      player.preservesPitch = true;
      player.onended = () => {
        if (!isCurrent()) return;
        // Release the finished element before revealing the answer choices.
        cancel();
        setPlaying(false);
        onComplete();
      };
      player.onerror = () => fail(
        "Ljudet kunde inte laddas. Kontrollera anslutningen och försök igen.",
      );
      setPlaying(true);
      // Keep play() inside the click handler for browsers that require a gesture.
      void Promise.resolve(player.play()).catch((reason: unknown) => {
        const blocked = typeof reason === "object" && reason !== null &&
          "name" in reason && reason.name === "NotAllowedError";
        fail(blocked
          ? "Webbläsaren kunde inte starta ljudet. Tryck på Lyssna på ordet igen."
          : "Ljudet kunde inte spelas upp. Försök igen eller välj en annan fråga.");
      });
    } catch {
      fail("Ljudet kunde inte startas. Försök igen.");
    }
  }

  return { play, stop, playing, error };
}
