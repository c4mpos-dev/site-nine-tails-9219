import Link from "next/link";
import Image from "next/image";
import { nav, navMore, site } from "@/content/site";
import { InstagramIcon, LinkedinIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/Social";

export const socialLinks = [
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.socials.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: site.socials.tiktok, label: "TikTok", Icon: TiktokIcon },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      {/* Fio na cor da equipe, como a faixa da camisa */}
      <div className="h-1 bg-gradient-to-r from-brand via-accent to-brand" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-9 sm:px-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/emblem.webp" alt="" width={64} height={58} className="h-10 w-auto" />
            <p className="heading text-xl">
              Nine Tails <span className="text-accent">#{site.number}</span>
            </p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Equipe de FIRST Robotics Competition da {site.school}.
          </p>
          <div className="mt-4 flex items-center gap-1">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-accent"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
            <a href={`mailto:${site.email}`} className="text-link ml-2 text-sm">
              {site.email}
            </a>
          </div>
        </div>

        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {[...nav, ...navMore, { href: "/sponsor", label: "Apoie a equipe" }, { href: "/credits", label: "Créditos das fotos" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>© Nine Tails #9219. FIRST® e FIRST® Robotics Competition são marcas registradas da FIRST®.</p>
          <p>
            Feito com <span className="text-accent">&lt;3</span> pelos{" "}
            <Link href="/alumni" className="hover:text-fg">
              alumni Cauã Campos e Davi Garutti
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
