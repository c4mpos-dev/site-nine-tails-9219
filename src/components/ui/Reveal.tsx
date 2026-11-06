"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number };

/** Deslize curto quando o bloco aparece na tela (uma vez). O conteúdo nunca fica invisível esperando a rolagem. */
export function Reveal({ delay = 0, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ y: 12 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({ stagger = 0.06, children, ...rest }: HTMLMotionProps<"div"> & { stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { y: 10 },
        show: { y: 0, transition: { duration: 0.45, ease: "easeOut" } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
