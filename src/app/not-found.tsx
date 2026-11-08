import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Field404 } from "@/components/brand/Field404";

export const metadata: Metadata = { title: "Página não encontrada", robots: { index: false } };

const ways = [
  { href: "/seasons", label: "Temporadas", note: "Cada jogo, cada robô, cada evento" },
  { href: "/robots", label: "Robôs", note: "Do Tank Tails ao robô da REBUILT" },
  { href: "/awards", label: "Conquistas", note: "A estante de troféus" },
  { href: "/museum", label: "Museu da Raposa", note: "O acervo, sala por sala" },
];

/** 404 como uma partida que não aconteceu: os números viram peças de jogo e o visitante pode pilotar o robô. */
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

        <div className="mt-6 w-full max-w-4xl">
          <Field404 />
        </div>

        <h1 className="heading mt-6 text-4xl sm:text-5xl">Essa página saiu do campo</h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
          O robô procurou na quadra inteira e não achou nada neste endereço. O link pode estar errado, ou a página mudou de lugar.
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
                  className="card group flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-5 py-4"
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

    </section>
  );
}
