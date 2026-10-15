import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Term } from "@/components/ui/Term";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { RobotBlueprint } from "@/components/robots/RobotBlueprint";
import { BeforeAfter } from "@/components/robots/BeforeAfter";
import { getRobot, robots } from "@/content/robots";
import { getSeason } from "@/content/seasons";
import { seasonPhotos } from "@/content/credits";

const driveTerm = (d: string) => (/swerve/i.test(d) ? "swerve" : /omni/i.test(d) ? "omni" : "tank");

export function generateStaticParams() {
  return robots.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/robos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const robot = getRobot(slug);
  if (!robot) return {};
  return { title: `${robot.name} (${robot.year})`, description: robot.description };
}

export default async function RobotPage({ params }: PageProps<"/robos/[slug]">) {
  const { slug } = await params;
  const robot = getRobot(slug);
  if (!robot) notFound();
  const season = getSeason(robot.seasonSlug);
  const cover = season?.photos[0] ? seasonPhotos[season.photos[0]] : undefined;
  const idx = robots.indexOf(robot);
  const prev = robots[idx - 1];
  const next = robots[idx + 1];

  const specs = [
    ["Temporada", `${robot.year} · ${season?.game ?? ""}`],
    ["Tração", robot.drivetrain],
    ["Geração", robot.order],
    ["Competiu em", robot.events.join(", ")],
  ];

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/robos", label: "Robôs" },
          { href: `/robos/${robot.slug}`, label: robot.name },
        ]}
        kicker={`${robot.order} · ${season?.game} ${robot.year}`}
        title={robot.name}
        lead={robot.tagline}
        image={
          robot.photo
            ? { src: robot.photo, alt: `Robô ${robot.name}`, position: "50% 60%" }
            : cover
              ? { src: cover.src, alt: cover.caption, credit: `${cover.author}, ${cover.license}` }
              : undefined
        }
      />

      <Container className="grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          {robot.beforeAfter ? (
            <BeforeAfter {...robot.beforeAfter} />
          ) : (
          <>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-2">
            {robot.photo ? (
              <Image src={robot.photo} alt={`Robô ${robot.name}`} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
            ) : (
              <RobotBlueprint drivetrain={robot.drivetrain} className="absolute inset-0 m-auto h-[80%] w-[80%] text-brand" />
            )}
          </div>
          {!robot.photo && <p className="mt-2 text-sm text-muted">Planta ilustrativa da base. A foto do robô entra em breve.</p>}
          </>
          )}
        </div>

        <div>
          <dl className="divide-y divide-line border-y border-line text-sm">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-bold">
                  {k === "Tração" ? <Term id={driveTerm(robot.drivetrain)}>{v}</Term> : v}
                </dd>
              </div>
            ))}
          </dl>
          {robot.awards && (
            <ul className="mt-5 space-y-1.5">
              {robot.awards.map((a) => (
                <li key={a} className="flex items-center gap-2 font-bold text-accent">
                  <span className="size-2 rotate-45 bg-accent" /> {a}
                </li>
              ))}
            </ul>
          )}
          <div className="prose-nt mt-6">
            <p>{robot.description}</p>
            <h2>Destaques</h2>
            <ul className="space-y-2">
              {robot.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {season && (
            <Link href={`/temporadas/${season.slug}`} className="text-link mt-8 inline-block">
              Ler sobre a temporada {season.year} →
            </Link>
          )}
        </div>
      </Container>

      <Container className="flex flex-wrap justify-between gap-4 border-t border-line pt-8">
        {prev ? (
          <Link href={`/robos/${prev.slug}`} className="group">
            <span className="text-xs text-muted">← Anterior</span>
            <span className="heading block text-2xl group-hover:text-accent">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/robos/${next.slug}`} className="group text-right">
            <span className="text-xs text-muted">Próximo →</span>
            <span className="heading block text-2xl group-hover:text-accent">{next.name}</span>
          </Link>
        )}
      </Container>
    </>
  );
}
