"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const MODEL = "/models/tank-tails.glb";

/**
 * A jogada, em segundos. Cada canal interpola suave entre as chaves [tempo, valor].
 * - arm: ângulo do braço (graus) · ext: extensão do telescópio (m)
 * - grip: garra (0 aberta, 1 fechada) · drive: 0 = parado atrás, 1 = encostado na haste
 */
const CYCLE = 12;
const TRACKS = {
  arm: [[0, -8], [1.3, -8], [3.0, 50], [6.7, 50], [8.4, -8]],
  ext: [[0, 0], [1.3, 0], [3.0, 0.48], [6.7, 0.48], [8.4, 0]],
  grip: [[0, 0], [0.8, 0], [1.3, 1], [4.5, 1], [4.9, 0]],
  drive: [[0, 0], [3.0, 0], [4.5, 1], [5.2, 1], [6.7, 0]],
} satisfies Record<string, [number, number][]>;
/** O cone: solta na haste, some depois que o robô volta e reaparece no chão, dentro da garra aberta. */
const DROP = 4.6;
const FALL = 0.35;
const VANISH: [number, number] = [8.6, 9.0];
const RESPAWN: [number, number] = [9.2, 9.8];
/** Quanto o robô anda (m) entre pegar o cone e encostar na haste. */
const DRIVE = 0.6;
const FINGER = { open: 0.116, closed: 0.066 };

const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
function track(keys: [number, number][], t: number) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t < t1) return v0 + (v1 - v0) * ease((t - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
}

/**
 * O Tank Tails em 3D, repetindo uma jogada da Charged Up: pega o cone do chão, levanta o braço,
 * anda até a haste e pontua. O three.js só é baixado quando o bloco aparece na tela.
 * Com "reduzir movimento", fica parado na pose de pontuação.
 */
export function TankTails3D({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let dispose = () => {};
    let cancelled = false;

    const start = async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (cancelled) return;

      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = window.matchMedia("(pointer: fine)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      el.appendChild(renderer.domElement);
      renderer.domElement.setAttribute("aria-hidden", "true");

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      // Luz principal + contraluz roxa da equipe
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(2, 3, 2);
      const rim = new THREE.DirectionalLight(0x9e19b8, 5);
      rim.position.set(-2, 1.5, -2.5);
      scene.add(key, rim, new THREE.HemisphereLight(0xffffff, 0x241532, 0.6));

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableDamping = true;
      controls.minPolarAngle = Math.PI * 0.25;
      controls.maxPolarAngle = Math.PI * 0.5;
      controls.autoRotate = !still;
      controls.autoRotateSpeed = 1;
      // No celular o arraste ficaria brigando com a rolagem: lá ele só gira sozinho.
      controls.enabled = finePointer;
      if (!finePointer) renderer.domElement.style.touchAction = "pan-y";

      const gltf = await new GLTFLoader().loadAsync(MODEL);
      if (cancelled) {
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }
      const world = gltf.scene; // robô + haste
      scene.add(world);
      const get = (n: string) => world.getObjectByName(n);
      const robot = get("TankTails_9219");
      const arm = get("arm");
      const st2 = get("arm_stage2");
      const st3 = get("arm_stage3");
      const claw = get("claw");
      const cone = get("game_piece_cone");
      const pole = get("scoring_pole");
      const fingers = ["claw_finger_R", "claw_finger_L"].map(get).filter((f) => !!f);
      const wheels: import("three").Object3D[] = [];
      world.traverse((o) => /^wheel_[RL](back|mid|front)$/.test(o.name) && wheels.push(o));
      const animated = !!(robot && arm && st2 && st3 && claw && cone && pole);

      // Pose original do arquivo (pontuando), usada como referência e como pose parada
      const base = {
        arm: arm?.rotation.z ?? 0,
        claw: claw?.rotation.z ?? 0,
        cone: cone ? { p: cone.position.clone(), q: cone.quaternion.clone(), s: cone.scale.clone() } : null,
        wheel: wheels.map((w) => w.rotation.z),
      };
      const wheelR = wheels[0] ? new THREE.Box3().setFromObject(wheels[0]).getSize(new THREE.Vector3()).y / 2 : 0.05;

      const pose = (t: number) => {
        const a = THREE.MathUtils.degToRad(track(TRACKS.arm, t));
        const ext = track(TRACKS.ext, t);
        const grip = track(TRACKS.grip, t);
        arm!.rotation.z = a;
        claw!.rotation.z = base.claw - (a - base.arm); // garra sempre nivelada
        st2!.position.x = ext / 2;
        st3!.position.x = ext / 2;
        fingers.forEach((f) => (f.position.z = Math.sign(f.position.z) * (FINGER.open + (FINGER.closed - FINGER.open) * grip)));
        const x = -DRIVE * (1 - track(TRACKS.drive, t));
        robot!.position.x = x;
        wheels.forEach((w, i) => (w.rotation.z = base.wheel[i] - x / wheelR)); // tração de tanque rodando
      };

      // Onde o cone fica quando a garra solta, e quanto ele cai até encaixar na haste
      let dropAt = new THREE.Vector3();
      let fall = 0;
      if (animated) {
        pose(DROP);
        world.updateMatrixWorld(true);
        dropAt = world.worldToLocal(cone!.getWorldPosition(new THREE.Vector3()));
        const coneBottom = new THREE.Box3().setFromObject(cone!).min.y;
        const poleTop = new THREE.Box3().setFromObject(pole!).max.y;
        fall = Math.max(0, coneBottom - poleTop + FALL * 0.5);
      }

      const placeCone = (t: number) => {
        const held = t < DROP || t >= RESPAWN[0];
        if (held && cone!.parent !== claw) {
          claw!.add(cone!);
          cone!.position.copy(base.cone!.p);
          cone!.quaternion.copy(base.cone!.q);
        }
        if (!held && cone!.parent !== world) world.add(cone!);
        if (held) {
          cone!.scale.setScalar(t >= RESPAWN[0] ? Math.max(0.001, clamp01((t - RESPAWN[0]) / (RESPAWN[1] - RESPAWN[0]))) : 1);
        } else {
          const k = clamp01((t - DROP) / 0.35);
          cone!.position.set(dropAt.x, dropAt.y - fall * k * k, dropAt.z);
          cone!.quaternion.identity();
          cone!.scale.setScalar(Math.max(0.001, 1 - clamp01((t - VANISH[0]) / (VANISH[1] - VANISH[0]))));
        }
      };

      // Enquadra o caminho todo (robô atrás e encostado na haste) e põe no chão
      const box = new THREE.Box3().setFromObject(world);
      if (animated) {
        pose(0);
        world.updateMatrixWorld(true);
        box.union(new THREE.Box3().setFromObject(world));
        robot!.position.x = 0;
      }
      const center = box.getCenter(new THREE.Vector3());
      world.position.set(-center.x, -box.min.y, -center.z);
      const size = box.getSize(new THREE.Vector3());
      const radius = Math.max(size.x, size.y, size.z);
      controls.target.set(0, size.y * 0.42, 0);
      camera.position.set(radius * 1.3, size.y * 0.7, radius * 1.75);
      controls.update();

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      // Só anima enquanto está visível
      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(el);

      const clock = new THREE.Clock();
      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        if (animated && !still) {
          const t = clock.getElapsedTime() % CYCLE;
          pose(t);
          placeCone(t);
        }
        controls.update();
        renderer.render(scene, camera);
      };
      if (animated && !still) {
        pose(0);
        placeCone(0);
      } else if (animated) {
        // Parado: encostado na haste, com o cone na garra
        pose(4.4);
        placeCone(4.4);
      }
      loop();
      setReady(true);

      dispose = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        controls.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Carrega o three.js só quando o bloco chega perto da tela
    const lazy = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        lazy.disconnect();
        start().catch(() => {});
      },
      { rootMargin: "200px" },
    );
    lazy.observe(el);

    return () => {
      cancelled = true;
      lazy.disconnect();
      dispose();
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Brilho roxo no chão */}
      <div aria-hidden className="absolute inset-x-[12%] bottom-[6%] h-[18%] rounded-[50%] bg-brand/35 blur-2xl" />
      <div
        ref={host}
        role="img"
        aria-label="Modelo 3D do Tank Tails, o primeiro robô da Nine Tails, pegando um cone e pontuando na haste"
        className={cn("relative size-full transition-opacity duration-700 [&>canvas]:size-full", ready ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
