"use client";

import { MotionConfig } from "motion/react";
import { PhotoViewer } from "@/components/ui/PhotoViewer";

/** Respeita "reduzir movimento" do sistema em todas as animações do Motion e monta o visualizador de fotos. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <PhotoViewer />
    </MotionConfig>
  );
}
