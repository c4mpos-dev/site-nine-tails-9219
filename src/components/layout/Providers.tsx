"use client";

import { MotionConfig } from "motion/react";
import { PhotoViewer } from "@/components/ui/PhotoViewer";
import { RouteTransition } from "@/components/layout/RouteTransition";

/** Respeita "reduzir movimento" do sistema em todas as animações do Motion e monta o visualizador de fotos e a cortina de troca de página. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <PhotoViewer />
      <RouteTransition />
    </MotionConfig>
  );
}
