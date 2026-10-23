import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FoxLoader } from "@/components/brand/FoxLoader";

export const metadata: Metadata = { title: "Página não encontrada" };

const ways = [
  { href: "/seasons", label: "Temporadas", note: "Cada jogo, cada robô, cada evento" },
  { href: "/robots", label: "Robôs", note: "Do Tank Tails ao robô da REBUILT" },
  { href: "/awards", label: "Conquistas", note: "A estante de troféus" },
  { href: "/museum", label: "Museu da Raposa", note: "O acervo, sala por sala" },
];

/** Pegada de raposa: almofada e quatro dedos, andando para a direita. */
function Paw({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden>
      <g fill="currentColor" transform="rotate(90 20 20)">
        <path d="M20 21c5 0 9 4 9 8.5 0 3-2.5 4.5-5 4.5-1.6 0-2.6-.8-4-.8s-2.4.8-4 .8c-2.5 0-5-1.5-5-4.5 0-4.5 4-8.5 9-8.5Z" />
        <ellipse cx="9" cy="17" rx="3.2" ry="4.2" transform="rotate(-20 9 17)" />
        <ellipse cx="15.5" cy="10.5" rx="3.2" ry="4.4" transform="rotate(-6 15.5 10.5)" />
        <ellipse cx="24.5" cy="10.5" rx="3.2" ry="4.4" transform="rotate(6 24.5 10.5)" />
        <ellipse cx="31" cy="17" rx="3.2" ry="4.2" transform="rotate(20 31 17)" />
      </g>
    </svg>
  );
}

/** 404 como uma partida que não aconteceu: o zero são as nove caudas, e a raposa sai farejando pela tela. */
export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Linhas do campo ao fundo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(var(--fg)_1px,transparent_1px),linear-gradient(90deg,var(--fg)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <Container className="flex min-h-[75vh] flex-col items-center justify-center py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">Partida Q404 · fora de campo</p>

        <div
          role="img"
          aria-label="404"
          className="heading mt-6 flex items-center justify-center gap-1 text-[6rem] leading-none text-accent sm:gap-3 sm:text-[11rem]"
        >
          <span aria-hidden>4</span>
          <FoxLoader className="size-[6rem] sm:size-[11rem]" />
          <span aria-hidden>4</span>
        </div>

        <h1 className="heading mt-6 text-4xl sm:text-5xl">Essa página saiu do campo</h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
          A raposa farejou o site inteiro e não achou nada neste endereço. O link pode estar errado, ou a página mudou de lugar.
        </p>
        <div className="mt-8">
          <Button href="/">Voltar para o início</Button>
        </div>

        <nav aria-label="Sugestões" className="mt-14 w-full max-w-3xl">
          <p className="kicker">Ou siga outra trilha</p>
          <ul className="mt-4 grid gap-3 text-left sm:grid-cols-2">
            {ways.map((w) => (
              <li key={w.href}>
                <Link
                  href={w.href}
                  className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-5 py-4 transition-colors hover:border-accent"
                >
                  <span>
                    <span className="heading block text-xl">{w.label}</span>
                    <span className="text-sm text-muted">{w.note}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-muted transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      {/* A trilha de pegadas, saindo pela direita */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-8 flex gap-5 overflow-hidden px-4 text-accent/60 sm:gap-7">
        {Array.from({ length: 36 }, (_, i) => (
          <Paw
            key={i}
            className={`paw-step size-5 shrink-0 sm:size-6 ${i % 2 ? "translate-y-2.5" : "-translate-y-2.5"}`}
            style={{ animationDelay: `${i * 0.11}s` }}
          />
        ))}
      </div>
    </section>
  );
}
