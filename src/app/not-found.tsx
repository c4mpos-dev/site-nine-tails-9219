import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="grid min-h-[65vh] place-items-center py-16 text-center">
      <div>
        <Image src="/brand/emblem.webp" alt="" width={1400} height={1282} className="mx-auto w-28" />
        <p className="heading mt-8 text-7xl text-accent">404</p>
        <h1 className="heading mt-2 text-3xl">Página não encontrada</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">A raposa procurou, mas essa página não existe.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/">Voltar para o início</Button>
        </div>
      </div>
    </Container>
  );
}
