import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { TimelineRail } from "@/components/archive/TimelineRail";
import { chapters, type Chapter } from "@/content/pioneers";
import { cn } from "@/lib/cn";
import { zoom } from "@/lib/zoom";

export const metadata: Metadata = {
  title: "Os pioneiros",
  description:
    "A primeira temporada da Nine Tails #9219 (CHARGED UP, 2023), contada por quem estava lá: da seletiva ao Mundial de Houston.",
};

function Shot({ src, caption, position, className, sizes }: Chapter["photos"][number] & { className?: string; sizes: string }) {
  return (
    <figure {...zoom(src, caption)} className={cn("zoomable relative overflow-hidden rounded-lg bg-surface-2", className)}>
      <Image
        quality={90}
        src={src}
        alt={caption}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: position }}
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-3 pb-2 pt-8 text-xs text-white [text-shadow:0_1px_10px_rgb(0_0_0/0.45)]">
        {caption}
      </figcaption>
    </figure>
  );
}

function Photos({ chapter }: { chapter: Chapter }) {
  const p = chapter.photos;
  switch (chapter.layout) {
    case "wide":
      return <Shot {...p[0]} className="aspect-[16/9]" sizes="(min-width:1024px) 60vw, 90vw" />;
    case "pair":
      return (
        <div className="grid grid-cols-2 gap-3">
          {p.map((ph) => (
            <Shot key={ph.src} {...ph} className="aspect-[4/5]" sizes="(min-width:1024px) 30vw, 45vw" />
          ))}
        </div>
      );
    case "tall":
      return (
        <div className="grid grid-cols-3 gap-3">
          {p.map((ph) => (
            <Shot key={ph.src} {...ph} className="aspect-[9/16]" sizes="(min-width:1024px) 20vw, 30vw" />
          ))}
        </div>
      );
    default:
      return (
        <div className="grid grid-cols-2 gap-3">
          <Shot {...p[0]} className="col-span-2 aspect-[16/9]" sizes="(min-width:1024px) 60vw, 90vw" />
          {p.slice(1).map((ph) => (
            <Shot key={ph.src} {...ph} className="aspect-[4/3]" sizes="(min-width:1024px) 30vw, 45vw" />
          ))}
        </div>
      );
  }
}

/** O diário da primeira temporada. */
export default function PioneersPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/archive", label: "Mais" },
          { href: "/pioneers", label: "Os pioneiros" },
        ]}
        kicker="Charged Up · 2023"
        title="Os pioneiros"
        lead="Antes de qualquer troféu, era um grupo de estudantes que nunca tinha montado um robô de FRC. Este é o diário da primeira temporada, contado com as fotos de quem estava lá."
        image={{ src: "/team/2023-houston-space-center.webp", alt: "Pioneiros da Nine Tails no Space Center Houston", position: "50% 40%" }}
      />

      <Container className="py-16">
        <TimelineRail>
          <ol className="space-y-24">
            {chapters.map((c, i) => (
              <li key={c.title} className="relative grid gap-8 pl-10 sm:pl-14 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 grid size-4 place-items-center rounded-full border-2 border-accent bg-bg sm:size-6"
                >
                  <span className="size-1.5 rounded-full bg-accent sm:size-2" />
                </span>
                <Reveal className="lg:sticky lg:top-28 lg:self-start">
                  <p className="kicker">
                    Capítulo {String(i + 1).padStart(2, "0")} · {c.when}
                  </p>
                  <h2 className="heading mt-3 text-4xl sm:text-5xl">{c.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted">{c.text}</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <Photos chapter={c} />
                </Reveal>
              </li>
            ))}
          </ol>
        </TimelineRail>
      </Container>

      <Container className="flex flex-wrap justify-between gap-4 pb-16">
        <Link href="/seasons/2023-charged-up" className="text-link">
          ← A temporada Charged Up em números
        </Link>
        <Link href="/archive" className="text-link">
          Mais páginas →
        </Link>
      </Container>
    </>
  );
}
