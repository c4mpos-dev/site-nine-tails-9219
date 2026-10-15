import Link from "next/link";
import { nav, site } from "@/content/site";
import { FoxSecret } from "@/components/archive/FoxSecret";
import { InstagramIcon, LinkedinIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/Social";

export const socialLinks = [
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.socials.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: site.socials.tiktok, label: "TikTok", Icon: TiktokIcon },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      {/* Fio na cor da equipe, como a faixa da camisa */}
      <div className="h-1 bg-gradient-to-r from-brand via-accent to-brand" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <FoxSecret />
            <p className="heading text-2xl">
              Nine Tails <span className="text-accent">#{site.number}</span>
            </p>
          </div>
          <p className="mt-4 max-w-sm leading-relaxed text-muted">
            Equipe de FIRST Robotics Competition da {site.school}. Desde 2022, evoluindo uma temporada de cada vez.
          </p>
          <div className="mt-5 flex gap-2">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="kicker">Navegue</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[...nav, { href: "/patrocine", label: "Apoie a equipe" }, { href: "/arquivo", label: "Arquivo" }, { href: "/creditos", label: "Créditos das fotos" }].map(
              (item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <p className="kicker">Contato</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {site.school}
            <br />
            {site.city}, {site.state}
          </p>
          <a href={`mailto:${site.email}`} className="text-link mt-3 inline-block text-sm">
            {site.email}
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          © Nine Tails #9219. FIRST® e FIRST® Robotics Competition são marcas registradas da FIRST®.{" "}
          <span className="opacity-70">Psiu: a raposa tem nove caudas.</span>
        </p>
      </div>
    </footer>
  );
}
