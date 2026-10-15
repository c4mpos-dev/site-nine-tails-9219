import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
};

export function Button({ href, children, variant = "solid", className }: Props) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const cls = cn(
    "group inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition-colors",
    variant === "solid" && "bg-brand text-brand-ink hover:bg-brand-strong",
    variant === "outline" && "border border-current hover:border-accent hover:text-accent",
    className,
  );
  const inner = (
    <>
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
