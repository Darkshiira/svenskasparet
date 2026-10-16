import type { Place, Position } from "@/app/data/grunder";

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

function Person({
  x,
  shirt,
  skin = "#d8a47e",
}: {
  x: number;
  shirt: string;
  skin?: string;
}) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M-27 220V175Q-27 150 0 150Q27 150 27 175V220" fill={shirt} />
      <circle cy="124" r="25" fill={skin} />
      <path
        d="M-25 120Q-26 90 0 96Q27 93 25 121L13 110Q-6 119-25 120"
        fill="#564e42"
      />
      <circle cx="-8" cy="124" r="2" fill="#403b35" />
      <circle cx="8" cy="124" r="2" fill="#403b35" />
      <path
        d="M-7 136Q0 142 7 136"
        fill="none"
        stroke="#805747"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}
export function SituationPicture({ place }: { place: Place }) {
  const label = {
    park: "Två personer möts i en park",
    shop: "En kund och personal i en affär",
    restaurant: "En gäst och en servitör på en restaurang",
    home: "Två vänner hemma vid en kopp te",
    bus: "En resenär vid en buss",
  }[place];
  return (
    <svg
      viewBox="0 0 400 250"
      role="img"
      aria-label={label}
      className="h-auto max-h-64 w-full rounded-[22px] bg-[#edf6f0]"
    >
      <circle cx="335" cy="48" r="23" fill="#f4dfa4" />
      <path d="M20 222H380" stroke="#c3d9cd" strokeWidth="3" />
      {place === "park" && (
        <>
          <rect x="40" y="105" width="12" height="115" rx="5" fill="#b39770" />
          <path d="M10 137L46 50L83 137ZM15 105L46 25L78 105Z" fill="#79a78b" />
          <path d="M300 210Q330 172 367 208" fill="#a8c7a7" />
        </>
      )}
      {place === "shop" && (
        <>
          <rect x="25" y="40" width="350" height="23" rx="5" fill="#6f9a85" />
          <path d="M25 63H375L365 87H35Z" fill="#d3b57d" />
          <path
            d="M60 65V84M110 65V84M160 65V84M210 65V84M260 65V84M310 65V84"
            stroke="#f4ead1"
            strokeWidth="18"
          />
        </>
      )}
      {place === "restaurant" && (
        <>
          <rect x="30" y="30" width="80" height="80" rx="24" fill="#d0e5db" />
          <path d="M45 85H95M70 45V95" stroke="#8ab49f" strokeWidth="4" />
        </>
      )}
      {place === "home" && (
        <>
          <rect x="28" y="30" width="75" height="80" rx="9" fill="#c8e0d8" />
          <path d="M65 30V110M28 70H103" stroke="#fff8e9" strokeWidth="6" />
          <path d="M320 220V145" stroke="#a68e61" strokeWidth="6" />
          <path d="M290 150L320 95L350 150Z" fill="#e8cd91" />
        </>
      )}
      {place === "bus" && (
        <>
          <rect x="34" y="45" width="330" height="154" rx="26" fill="#d3b775" />
          <rect x="47" y="60" width="245" height="70" rx="12" fill="#c0dbdb" />
          <path
            d="M105 61V130M169 61V130M231 61V130"
            stroke="#f2e7c9"
            strokeWidth="5"
          />
          <rect x="304" y="61" width="45" height="134" rx="8" fill="#6a9790" />
          <circle cx="100" cy="201" r="20" fill="#4e6660" />
          <circle cx="290" cy="201" r="20" fill="#4e6660" />
        </>
      )}
      <Person x={place === "bus" ? 285 : 130} shirt="#5c9781" />
      {place !== "bus" && <Person x={270} shirt="#d49a70" skin="#a97150" />}
      {(place === "shop" || place === "restaurant" || place === "home") && (
        <>
          <rect x="165" y="188" width="178" height="13" rx="5" fill="#c5a374" />
          <path d="M178 201V222M330 201V222" stroke="#a0855d" strokeWidth="8" />
          {place === "shop" ? (
            <>
              <circle cx="203" cy="175" r="12" fill="#ce7863" />
              <path d="M204 165L207 158" stroke="#5b8969" strokeWidth="3" />
            </>
          ) : (
            <>
              <path d="M200 165H226V183H200Z" fill="#fff8e9" />
              <path
                d="M226 167Q244 174 226 180"
                fill="none"
                stroke="#fff8e9"
                strokeWidth="5"
              />
              <path
                d="M209 155Q203 149 210 143"
                fill="none"
                stroke="#94b2a0"
                strokeWidth="2"
              />
            </>
          )}
        </>
      )}
    </svg>
  );
}

