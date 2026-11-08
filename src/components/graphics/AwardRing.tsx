"use client";

import Image from "next/image";
import Link from "next/link";
import { useAnimationFrame, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { Award } from "@/content/awards";
import { cn } from "@/lib/cn";

const TAU = Math.PI * 2;
/** Leva um ângulo para o intervalo de -π a π (o caminho mais curto até ele). */
const wrap = (a: number) => a - TAU * Math.round(a / TAU);

/**
 * Os prêmios como medalhas num anel que gira em 3D: a da frente fica grande e nítida,
 * as de trás encolhem e desfocam. Gira sozinho, devagar e sem parar (mais devagar ainda com o mouse em cima);
 * arrasta com o mouse ou o dedo,
 * e clicar numa medalha traz ela para a frente (clicar na da frente abre a história).
 */
export function AwardRing({ awards, className }: { awards: Award[]; className?: string }) {
  const n = awards.length;
  const step = TAU / n;
  const reduce = useReducedMotion();
  const [front, setFront] = useState(0);

  const box = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const s = useRef({ angle: 0, target: 0 as number | null, speed: 0, wait: 0, hover: false, front: 0, moved: false, drag: null as null | { x: number; a: number } });

  /** Raio do anel: acompanha a largura da área, até 300px. */
  const radius = () => Math.min((box.current?.offsetWidth ?? 800) * 0.27, 300);

  const goTo = (i: number) => {
    const st = s.current;
    st.target = st.angle + wrap(i * step - st.angle);
  };

  useAnimationFrame((_, delta) => {
    const st = s.current;
    const dt = Math.min(delta, 50) / 1000;
    if (!st.drag) {
      if (st.target !== null) {
        st.angle += (st.target - st.angle) * (reduce ? 1 : Math.min(1, dt * 6));
        // chegou na medalha escolhida: ela fica um pouco na frente antes de voltar a girar
        if (Math.abs(st.target - st.angle) < 0.0005) {
          st.angle = st.target;
          st.target = null;
          st.wait = 3;
          st.speed = 0;
        }
      } else if (!reduce && (st.wait -= dt) <= 0) {
        // uma volta a cada ~35 s; com o mouse em cima, quase parando, para dar tempo de ler
        st.speed += ((st.hover ? 0.05 : 0.18) - st.speed) * Math.min(1, dt * 2);
        st.angle += st.speed * dt;
      }
    }

    const r = radius();
    items.current.forEach((el, i) => {
      if (!el) return;
      const a = i * step - st.angle;
      const z = Math.cos(a); // 1 na frente, -1 atrás
      const k = (z + 1) / 2;
      el.style.transform = `translate(-50%, -50%) translate(${Math.sin(a) * r}px, ${(1 - k) * -26}px) scale(${0.55 + 0.45 * k})`;
      el.style.filter = `blur(${((1 - k) * 7).toFixed(2)}px)`;
      el.style.opacity = String(0.45 + 0.55 * k);
      el.style.zIndex = String(Math.round(k * 100));
    });

    const f = ((Math.round(st.angle / step) % n) + n) % n;
    if (f !== st.front) setFront((st.front = f));
  });

  const onDown = (e: React.PointerEvent) => {
    s.current.drag = { x: e.clientX, a: s.current.angle };
    s.current.moved = false;
    s.current.target = null;
  };
  const onMove = (e: React.PointerEvent) => {
    const d = s.current.drag;
    if (!d) return;
    const dx = e.clientX - d.x;
    // só vira arraste depois de uns pixels; antes disso ainda é um clique na medalha
    if (!s.current.moved && Math.abs(dx) > 5) {
      s.current.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (s.current.moved) s.current.angle = d.a - dx / radius();
  };
  const onUp = () => {
    if (!s.current.drag) return;
    s.current.drag = null;
    s.current.target = Math.round(s.current.angle / step) * step;
  };

  const a = awards[front];

  return (
    <div className={className}>
      <div
        ref={box}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={(e) => e.pointerType === "mouse" && (s.current.hover = true)}
        onPointerLeave={() => (s.current.hover = false)}
        className="relative h-64 cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-80"
      >
        {awards.map((aw, i) => (
          <button
            key={aw.id}
            ref={(el) => {
              items.current[i] = el;
            }}
            type="button"
            aria-label={i === front ? `${aw.title}: ver a história` : `Mostrar ${aw.title}`}
            onClick={() => {
              // arrastou: o clique que vem junto com o soltar não conta
              if (s.current.moved) return void (s.current.moved = false);
              if (i === front) document.getElementById(aw.id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
              else goTo(i);
            }}
            className="absolute left-1/2 top-1/2 size-40 overflow-hidden rounded-full bg-surface-2 shadow-[0_22px_34px_-16px_rgb(74_0_97/0.55)] ring-[6px] ring-white will-change-transform sm:size-56"
          >
            <Image
              src={aw.photo!}
              alt=""
              fill
              sizes="(min-width:640px) 224px, 160px"
              quality={90}
              draggable={false}
              className="pointer-events-none object-cover"
              style={{ objectPosition: aw.photoPosition }}
            />
            <span className="absolute inset-0 rounded-full ring-2 ring-inset ring-accent/60" />
          </button>
        ))}
      </div>

      {/* A medalha da frente */}
      <div aria-live="polite" className="mt-4 text-center">
        <p className="kicker">
          {String(front + 1).padStart(2, "0")} · {a.date}
        </p>
        <Link href={`#${a.id}`} className="heading mt-2 block text-3xl transition-colors hover:text-accent sm:text-4xl">
          {a.title}
        </Link>
        <p className="mt-1 text-sm text-muted">{a.event}</p>
      </div>
      <div className="mt-5 flex justify-center gap-2">
        {awards.map((aw, i) => (
          <button
            key={aw.id}
            type="button"
            aria-label={aw.title}
            aria-current={i === front}
            onClick={() => goTo(i)}
            className={cn("h-2 rounded-full transition-all", i === front ? "w-6 bg-accent" : "w-2 bg-line hover:bg-accent/50")}
          />
        ))}
      </div>
    </div>
  );
}
