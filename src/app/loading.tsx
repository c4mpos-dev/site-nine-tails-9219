import { FoxLoader } from "@/components/brand/FoxLoader";

/** Enquanto uma página ainda está sendo montada no servidor. */
export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status">
      <FoxLoader className="size-32" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
