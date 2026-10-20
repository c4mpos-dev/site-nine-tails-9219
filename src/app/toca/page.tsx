import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Kit da marca",
  description: "Emblema, logos e letreiros da Nine Tails #9219 para baixar, e curiosidades da equipe.",
};

const kit = [
  { src: "/brand/emblem.webp", name: "Emblema", note: "A raposa robótica de nove caudas, a versão principal.", w: 1400, h: 1282 },
  { src: "/brand/emblem-pride.webp", name: "Emblema do orgulho", note: "Versão com as cores do arco-íris no nome.", w: 1200, h: 1099 },
  { src: "/brand/logo-horizontal.webp", name: "Logo horizontal", note: "Para cabeçalhos, faixas e camisas.", w: 1200, h: 435 },
  { src: "/brand/wordmark.webp", name: "Letreiro", note: "Só o nome, com as letras gordinhas da raposa.", w: 1200, h: 194 },
  { src: "/brand/wordmark-9219.webp", name: "Letreiro #9219", note: "Nome com o número da equipe.", w: 1000, h: 220 },
];

const secrets = [
  "Na primeira regional, a equipe tinha só três meses de existência e saiu com vaga para o Mundial.",
  "Antes mesmo de competir, a equipe já tinha conversado com a LamBot #3478, do México, em janeiro de 2023.",
  "O The Answer foi projetado e construído em menos de um mês, e ganhou o Engineering Award.",
  "A camisa da equipe tem raios roxos estampados, de cima a baixo.",
  "O material do Nine Learns foi enviado para lendas da FRC como a 254 Cheesy Poofs e a 118 Robonauts.",
  "O Arak conseguia colocar um coral no nível mais alto (L4) ainda no autônomo.",
  "As caudas do logo são de metal rebitado: metade raposa, metade robô.",
];

/** Kit da marca e curiosidades da equipe. */
export default function DenPage() {
  return (
    <section className="relative overflow-hidden">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="kicker">A toca da raposa</p>
            <h1 className="heading mt-3 text-5xl sm:text-7xl">Kit da marca</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              O emblema, os logos e os letreiros da Nine Tails para baixar e usar com carinho em matérias, apresentações e
              materiais de patrocinadores. E, no fim da página, algumas coisas que só quem é da raposa sabe.
            </p>
          </div>
          <Image src="/brand/emblem.webp" alt="" width={1400} height={1282} className="mx-auto w-48 -rotate-6 lg:w-64" />
        </div>

        <h2 className="heading mt-20 text-3xl">Kit da raposa</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kit.map((k) => (
            <li key={k.src} className="flex flex-col rounded-lg border border-line p-4">
              <div className="grid aspect-[4/3] place-items-center rounded-md bg-[repeating-conic-gradient(var(--surface)_0%_25%,var(--surface-2)_0%_50%)] bg-[length:24px_24px] p-6">
                <Image src={k.src} alt={k.name} width={k.w} height={k.h} className="max-h-full w-auto object-contain" />
              </div>
              <p className="heading mt-4 text-xl">{k.name}</p>
              <p className="flex-1 text-sm text-muted">{k.note}</p>
              <a href={k.src} download className="text-link mt-3 inline-flex items-center gap-2 text-sm">
                <Download className="size-4" /> Baixar
              </a>
            </li>
          ))}
        </ul>

        <h2 className="heading mt-20 text-3xl">Coisas que só a raposa sabe</h2>
        <ol className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {secrets.map((s, i) => (
            <li key={s} className="flex gap-4 border-t border-line pt-4">
              <span className="heading text-2xl text-accent">{String(i + 1).padStart(2, "0")}</span>
              <p className="leading-relaxed text-muted">{s}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap gap-6">
          <Link href="/arquivo" className="text-link">
            Mais páginas →
          </Link>
          <Link href="/" className="text-link">
            Voltar ao início
          </Link>
        </div>
      </Container>
    </section>
  );
}
