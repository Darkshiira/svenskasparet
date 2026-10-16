"use client";

import { useState } from "react";
import { CheckCircle2, Volume2, XCircle } from "lucide-react";
import { positions, situations, vocabulary } from "@/app/data/grunder";
import type { TrickyWord } from "@/app/lib/trickyWords";
import {
  useGrunderAudio,
  getGrunderAudioPath,
} from "@/app/hooks/useGrunderAudio";
import {
  PositionPicture,
  SituationPicture,
} from "@/app/components/grunder/GrunderPictures";

type Props = {
  item: TrickyWord;
  options: string[];
  answered: boolean;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
};

export function GrunderTrickyPractice({
  item,
  options,
  answered,
  selectedAnswer,
  onAnswer,
}: Props) {
  const [heard, setHeard] = useState(false);
  const audio = useGrunderAudio();
  const audioWord =
    vocabulary.find((word) => word.id === item.grunderId) ??
    vocabulary.find((word) => word.word === item.answer);
  const audioPath = getGrunderAudioPath(audioWord?.id);
  const position =
    item.mode === "positions"
      ? positions.find((q) => q.id === item.grunderId)
      : undefined;
  const situation =
    item.mode === "situations"
      ? situations.find((q) => q.id === item.grunderId)
      : undefined;
  const isListening = item.mode === "listen";
  const pictureChoices = options.map((option) => ({
    option,
    picture: vocabulary.find((word) => word.word === option),
  }));
  const canShowPictures =
    isListening &&
    pictureChoices.every((choice) => choice.picture !== undefined);
  function submit(value: string) {
    if (answered || (isListening && !heard)) return;
    audio.stop();
    onAnswer(value);
  }
  const audioButton =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#bedfd3] bg-white px-5 py-3 text-sm font-bold text-[#276b5b] disabled:opacity-50";
  return (
    <div className="mt-5 space-y-4">
      {situation && <SituationPicture place={situation.place} />}
      {position && <PositionPicture position={position.position} />}
      {item.mode === "positions" && !position && (
        <p role="status" className="rounded-xl bg-[#fff8ed] p-4 text-sm">
          Bilden till den här sparade frågan saknas. Ta bort frågan och träna
          Lägesord igen.
        </p>
      )}
      {isListening && (
        <>
          <p className="text-sm leading-6 text-[#496c72]">
            Lyssna färdigt och välj bilden som passar. Du kan lyssna flera
            gånger.
          </p>
          <div className="flex flex-wrap justify-center gap-3 rounded-2xl bg-[#edf6f0] p-5">
            <button
              type="button"
              disabled={audio.playing}
              className={audioButton}
              onClick={() => audio.play(audioPath, false, () => setHeard(true))}
            >
              <Volume2 size={20} />
              {audio.playing ? "Spelar …" : "Lyssna på ordet"}
            </button>
            <button
              type="button"
              disabled={audio.playing}
              className={audioButton}
              onClick={() => audio.play(audioPath, true, () => setHeard(true))}
            >
              Lyssna långsamt
            </button>
          </div>
          {audio.error && (
            <p
              role="alert"
              className="rounded-xl bg-[#fff0e9] p-4 text-sm leading-6"
            >
              {audio.error}
            </p>
          )}
        </>
      )}
      <div className="grid grid-cols-2 gap-3">
        {pictureChoices.map(({ option, picture }, index) => {
          const chosen = selectedAnswer === option;
          const correct = option === item.answer;
          const unavailable = item.mode === "positions" && !position;
          const style =
            answered && correct
              ? "border-[#58a995] bg-[#e5f5ec] text-[#17665d]"
              : answered && chosen
                ? "border-[#e7a18d] bg-[#fff0e9] text-[#a94732]"
                : "border-[#d7e5e3] bg-white enabled:hover:border-[#58a995]";
          return (
            <button
              key={option}
              type="button"
              disabled={answered || unavailable || (isListening && !heard)}
              onClick={() => submit(option)}
              aria-label={
                canShowPictures ? `Bild ${index + 1}: ${option}` : option
              }
              className={`relative flex min-h-16 flex-col items-center justify-center gap-3 rounded-2xl border-2 px-4 py-4 text-base font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17665d] ${isListening ? "min-h-36" : ""} ${!heard && isListening ? "opacity-65" : ""} ${style}`}
            >
              {canShowPictures && picture ? (
                <>
                  <picture.Icon
                    aria-hidden="true"
                    size={64}
                    strokeWidth={1.6}
                    color={picture.color}
                  />
                  <span className="text-xs text-[#648083]">
                    Bild {index + 1}
                  </span>
                  {answered && <span>{option}</span>}
                </>
              ) : (
                option
              )}
              {answered && correct && (
                <CheckCircle2 aria-label="Rätt svar" size={20} />
              )}
              {answered && chosen && !correct && (
                <XCircle aria-label="Ditt svar" size={20} />
              )}
            </button>
          );
        })}
      </div>
      {isListening && !heard && (
        <p
          role="status"
          className="text-center text-xs leading-6 text-[#648083]"
        >
          Lyssna på ordet innan du väljer en bild.
        </p>
      )}
    </div>
  );
}
