import type { Position } from "@/app/data/grunder";

export function PositionPicture({ position }: { position: Position }) {
  const ball = (x: number, y: number) => (
    <g>
      <circle
        cx={x}
        cy={y}
        r="22"
        fill="#db846a"
        stroke="#a95543"
        strokeWidth="3"
      />
      <path
        d={`M${x - 19} ${y - 8} Q${x} ${y + 7} ${x + 19} ${y - 8}`}
        fill="none"
        stroke="#f9c8a9"
        strokeWidth="5"
      />
      <circle cx={x - 7} cy={y - 9} r="4" fill="#ffe0bc" />
    </g>
  );
  const box = (x: number, y: number) => (
    <g>
      <rect
        x={x}
        y={y}
        width="92"
        height="70"
        rx="5"
        fill="#d2ae70"
        stroke="#a48249"
        strokeWidth="3"
      />
      <path
        d={`M${x + 3} ${y + 17}h86 M${x + 46} ${y + 18}v51`}
        stroke="#ba9558"
        strokeWidth="3"
      />
      <rect
        x={x + 29}
        y={y + 31}
        width="34"
        height="12"
        rx="4"
        fill="#ae8a50"
      />
    </g>
  );
  const table = ["på", "under", "ovanför"].includes(position);
  return (
    <svg
      viewBox="0 0 400 260"
      role="img"
      aria-label="Lägesbild: en korallfärgad boll och möbler. Välj det lägesord som beskriver bilden."
      className="mx-auto h-auto max-h-72 w-full rounded-[22px] bg-[#edf6f0]"
    >
      <path
        d="M25 222H375"
        stroke="#c2d8c9"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {table ? (
        <>
          <rect x="118" y="144" width="12" height="78" rx="4" fill="#9d8054" />
          <rect x="270" y="144" width="12" height="78" rx="4" fill="#9d8054" />
          <rect
            x="100"
            y="130"
            width="200"
            height="18"
            rx="7"
            fill="#c2a372"
            stroke="#9d8054"
            strokeWidth="3"
          />
          {ball(200, position === "på" ? 106 : position === "under" ? 198 : 65)}
        </>
      ) : position === "mellan" ? (
        <>
          {box(48, 152)}
          {box(260, 152)}
          {ball(200, 200)}
        </>
      ) : position === "i" ? (
        <>
          <path
            d="M142 161L160 133H240L258 161V224H142Z"
            fill="#c4a06a"
            stroke="#a48249"
            strokeWidth="3"
          />
          <ellipse cx="200" cy="160" rx="57" ry="16" fill="#8c704c" />
          {ball(200, 174)}
          <path
            d="M143 171Q200 193 257 171V222H143Z"
            fill="#d2ae70"
            stroke="#a48249"
            strokeWidth="3"
          />
        </>
      ) : position === "bakom" ? (
        <>
          {ball(200, 157)}
          {box(154, 165)}
        </>
      ) : position === "framför" ? (
        <>
          {box(154, 141)}
          {ball(200, 215)}
        </>
      ) : (
        <>
          {box(154, 152)}
          {ball(position === "till vänster om" ? 95 : 305, 200)}
        </>
      )}
    </svg>
  );
}


