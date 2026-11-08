import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Caveat } from "next/font/google";
import { ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Loop } from "@/components/ui/Loop";
import { Reveal } from "@/components/ui/Reveal";
import { Trophy } from "@/components/graphics/Trophies";
import { Countdown } from "@/components/seasons/Countdown";
import { Exhibit } from "@/components/museum/Exhibit";
import { LitRoom } from "@/components/museum/LitRoom";
import { MuseumMap } from "@/components/museum/MuseumMap";
import { Passport } from "@/components/museum/Passport";
import { Stamp } from "@/components/museum/Stamp";
import { Ticket } from "@/components/museum/Ticket";
import { rooms, type Room, type Wing } from "@/content/museum";
import { getRobot } from "@/content/robots";
import { awards } from "@/content/awards";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { zoom } from "@/lib/zoom";

const hand = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = pageMeta({
  title: "Museu da Raposa",
  description: "O acervo da Nine Tails #9219 em salas: fotos de competição e de bastidor, robôs, troféus e objetos de cada temporada, de 2023 até hoje.",
  path: "/museum",
});

/** Ano que fecha o período da sala, para o carimbo. */
const yearOf = (r: Room) => r.period.match(/\d{4}/g)?.at(-1) ?? "";

const pieceCount = rooms.reduce((a, r) => a + r.wings.reduce((b, w) => b + w.pieces.length, 0), 0);

/** Placa de sinalização de ala, como as setas de museu. */
function WingSign({ name }: { name: string }) {
  return (
    <p className="inline-flex items-center gap-2 border-l-4 border-accent bg-surface-2 px-3 py-1.5 text-sm font-bold uppercase tracking-wider">
      {name} <ArrowRight className="size-4 text-accent" />
    </p>
  );
}

function WingWall({ wing, room, start }: { wing: Wing; room: Room; start: number }) {
  const no = (i: number) => `${room.number}.${String(start + i + 1).padStart(2, "0")}`;
  const wide = wing.pieces.map((p, i) => ({ p, i })).filter(({ p }) => p.frame === "tela");
  const rest = wing.pieces.map((p, i) => ({ p, i })).filter(({ p }) => p.frame !== "tela");
  return (
    <div className="mt-14 first:mt-10">
      <WingSign name={wing.name} />
      {wide.map(({ p, i }) => (
        <Reveal key={p.src} className="mt-8">
          <Exhibit piece={p} no={no(i)} seed={start + i} />
        </Reveal>
      ))}
      <div className="mt-8 columns-1 gap-8 sm:columns-2 lg:columns-3 [&>*]:mb-10 [&>*]:break-inside-avoid">
        {rest.map(({ p, i }) => (
          <Exhibit key={p.src} piece={p} no={no(i)} seed={start + i} />
        ))}
        {wing.clip && (
          <figure>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">● Sala de projeção</p>
            <div className="bg-[#0d0a10] p-1.5 shadow-[0_14px_28px_-14px_rgb(0_0_0/0.7)]">
              <Loop src={wing.clip.src} label={wing.clip.label} aspect={wing.clip.aspect} />
            </div>
            <figcaption className="mt-2 text-xs text-muted">{wing.clip.caption}</figcaption>
          </figure>
        )}
      </div>
    </div>
  );
}

/** O centro da sala: os robôs da temporada em pedestais e os troféus na vitrine. */
function Centerpiece({ room }: { room: Room }) {
  const bots = (room.robots ?? []).map(getRobot).filter((r) => r !== undefined);
  const prizes = (room.awards ?? []).map((id) => awards.find((a) => a.id === id)).filter((a) => a !== undefined);
  if (!bots.length && !prizes.length) return null;
  return (
    <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-8 rounded-lg border border-line bg-bg/60 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Peça central</p>
        <div className={cn("mt-4 grid gap-6", bots.length > 1 && "sm:grid-cols-2")}>
          {bots.map((r) => (
            <div key={r.slug}>
              <div {...zoom(r.photo!, `${r.name} (${r.year})`)} className="zoomable relative aspect-[4/3] overflow-hidden rounded-sm bg-surface-2 shadow-lg">
                <Image src={r.photo!} alt={`Robô ${r.name}`} fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" />
              </div>
              {/* Pedestal */}
              <div className="mx-6 h-3 bg-gradient-to-b from-surface-2 to-line" />
              <Link href={`/robots/${r.slug}`} className="group mt-3 inline-block">
                <span className="heading block text-2xl group-hover:text-accent">{r.name}</span>
                <span className="text-xs text-muted">
                  {r.order} · {r.drivetrain} · ver a ficha →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {prizes.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Vitrine de troféus</p>
          <div className="mt-4 flex flex-wrap items-end justify-center gap-x-4 gap-y-6 border-b-8 border-brand px-2 pb-1 lg:flex-nowrap">
            {prizes.map((a) => (
              <Link key={a.id} href={`/awards#${a.id}`} title={a.title} className="transition-transform hover:-translate-y-1">
                <Trophy art={a.art} className="h-24 w-auto drop-shadow-lg sm:h-32" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RoomSection({ room, i }: { room: Room; i: number }) {
  // Numeração contínua das peças dentro da sala, ala após ala
  const starts = room.wings.map((_, w) => room.wings.slice(0, w).reduce((a, x) => a + x.pieces.length, 0));
  return (
    <LitRoom id={room.id} className={cn("group/room relative scroll-mt-20 overflow-x-clip border-t border-line", i % 2 ? "bg-surface" : "bg-bg")}>
      {/* Parede: painéis verticais bem discretos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_159px,var(--line)_159px_160px)] opacity-40"
      />
      <Container className="relative py-16 sm:py-20">
        <Reveal className="relative grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-12">
          <Stamp
            number={room.number}
            label={room.title}
            year={yearOf(room)}
            className="absolute right-0 top-0 sm:right-4 rotate-[-14deg] scale-150 text-accent opacity-0 transition-[opacity,scale] delay-700 duration-300 ease-out group-data-[lit=true]/room:scale-100 group-data-[lit=true]/room:opacity-70"
          />
          <div className="relative w-fit">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Sala</p>
            {/* O número acende junto com a sala, como um letreiro */}
            <p className="heading text-[6rem] leading-[0.8] text-transparent transition-[filter,-webkit-text-stroke-color] duration-700 [-webkit-text-stroke:2px_var(--line)] group-data-[lit=true]/room:[-webkit-text-stroke-color:var(--accent)] sm:text-[8rem]">
              {room.number}
            </p>
          </div>
          <div className="max-w-2xl">
            <p className="kicker">{room.period}</p>
            <h2 className="heading mt-2 text-4xl sm:text-5xl">{room.title}</h2>
            {/* Texto de parede do curador */}
            <p className="mt-4 border-l-2 border-line pl-4 text-lg leading-relaxed text-muted">{room.intro}</p>
          </div>
        </Reveal>
        <Centerpiece room={room} />
        {room.wings.map((w, k) => (
          <WingWall key={w.name} wing={w} room={room} start={starts[k]} />
        ))}
      </Container>
      {/* Rodapé e piso de madeira */}
      <div aria-hidden className="relative h-1.5 bg-surface-2" />
      <div
        aria-hidden
        className="relative h-8 bg-[repeating-linear-gradient(90deg,#c9a77e_0_96px,#bf9c72_96px_192px)] shadow-[inset_0_10px_14px_-8px_rgb(0_0_0/0.25)]"
      />
    </LitRoom>
  );
}

/** Museu da Raposa: o acervo da equipe em salas, uma por temporada. */
export default function MuseumPage() {
  const stops = [
    { id: "entrada", number: "00", title: "Entrada" },
    ...rooms.map((r) => ({ id: r.id, number: r.number, title: r.title })),
    {
      id: "em-construcao",
      number: String(rooms.length + 1).padStart(2, "0"),
      title: "Em construção",
    },
  ];

  return (
    <div className={cn(hand.variable, "-mb-24 pb-24")}>
      {/* Entrada */}
      <section id="entrada" className="relative isolate overflow-hidden border-b border-line bg-tint">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(158_25_184/0.12)_1px,transparent_1px)] bg-[length:22px_22px]" />
        <Container className="grid gap-14 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <nav aria-label="Trilha" className="mb-6 flex flex-wrap gap-2 text-sm text-muted">
              <Link href="/" className="hover:text-fg">
                Início
              </Link>
              <span aria-hidden>/</span>
              <Link href="/archive" className="hover:text-fg">
                Mais
              </Link>
              <span aria-hidden>/</span>
              <span>Museu</span>
            </nav>
            <p className="kicker">Acervo Nine Tails · 2022 até hoje</p>
            <h1 className="heading mt-3 text-5xl sm:text-7xl">Museu da Raposa</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Fotos de arena e fotos de corredor, troféus e cones na cabeça, abraços, protótipos de papelão e o robô de cada ano. Tudo o que a equipe guardou,
              organizado em salas, uma por temporada.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-muted">
              <li>Aberto 24 horas</li>
              <li>Entrada franca</li>
              <li className="text-accent">É permitido tocar nas fotos</li>
            </ul>
            <a
              href={`#${rooms[0].id}`}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 font-bold text-brand-ink transition-colors hover:bg-brand-strong"
            >
              Entrar na Sala 01 <ArrowRight className="size-4" />
            </a>
          </div>
          <Ticket roomCount={rooms.length + 1} pieceCount={pieceCount} />
        </Container>
      </section>

      {rooms.map((r, i) => (
        <RoomSection key={r.id} room={r} i={i} />
      ))}

      {/* Última sala: ainda vazia */}
      <section
        id="em-construcao"
        className="scroll-mt-20 border-t border-line bg-[repeating-linear-gradient(-45deg,var(--surface)_0_14px,var(--bg)_14px_28px)]"
      >
        <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Sala</p>
            <p className="heading text-[6rem] leading-[0.8] text-transparent [-webkit-text-stroke:2px_var(--line)] sm:text-[8rem]">{stops.at(-1)!.number}</p>
            <p className="kicker mt-4">2027 · Biocore</p>
            <h2 className="heading mt-2 text-4xl sm:text-5xl">Em construção</h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              A próxima sala ainda está vazia. O jogo é revelado no kickoff, e o robô começa a nascer logo depois.
            </p>
            <Countdown className="mt-6" />
          </div>
          <figure className="mx-auto w-full max-w-sm">
            <div className="grid aspect-[4/3] place-items-center rounded-t-sm border-2 border-dashed border-line bg-bg/70 text-center">
              <p className="font-hand px-6 text-3xl text-muted">reservado para o robô de 2027</p>
            </div>
            <div className="h-3 border border-line bg-surface-2" />
            <div className="mx-6 h-16 border-x border-b border-line bg-gradient-to-b from-surface-2 to-surface" />
            <div className="mx-auto -mt-10 w-56 border border-line bg-surface-2 px-3 py-2 text-xs shadow-sm">
              <p className="font-mono text-[10px] text-muted">Nº {stops.at(-1)!.number}.01 · 2027</p>
              <p className="font-bold">Robô #7</p>
              <p className="text-muted">Material e nome a definir.</p>
            </div>
          </figure>
        </Container>
      </section>

      {/* Saída */}
      <section className="border-t border-line">
        <Container className="grid gap-10 py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="kicker">Livro de visitas</p>
            <p className="heading mt-2 text-3xl">Está em alguma dessas fotos?</p>
            <p className="mt-2 max-w-xl text-muted">Tem uma foto ou um objeto que deveria estar no acervo? Mande para a equipe.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${site.email}?subject=Para%20o%20Museu%20da%20Raposa`}
                className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 font-bold text-brand-ink hover:bg-brand-strong"
              >
                <Mail className="size-4" /> Enviar para o acervo
              </a>
              <Link href="/seasons" className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 font-bold hover:border-accent">
                Saída: temporadas <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <Passport
            stops={rooms.map((r) => ({
              id: r.id,
              number: r.number,
              title: r.title,
              year: yearOf(r),
            }))}
          />
        </Container>
      </section>

      <MuseumMap stops={stops} />
    </div>
  );
}
