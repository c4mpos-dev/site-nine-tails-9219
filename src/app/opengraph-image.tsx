import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const alt = "Nine Tails #9219 — Equipe de FIRST Robotics Competition de Resende, RJ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = await readFile(join(process.cwd(), "src/app/icon.png"), "base64");

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 90px",
          background: "#22082d",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 26, letterSpacing: 8, color: "#f39bea", textTransform: "uppercase" }}>
            FIRST Robotics Competition
          </div>
          <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1, marginTop: 20 }}>NINE TAILS</div>
          <div style={{ fontSize: 80, fontWeight: 900, color: "#e11dcc", lineHeight: 1 }}>#9219</div>
          <div style={{ fontSize: 30, color: "#cdd6dc", marginTop: 30 }}>
            Resende · RJ · Rookie Inspiration no Mundial de Houston 2023
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img> */}
        <img alt="" src={`data:image/png;base64,${logo}`} width={420} height={420} style={{ objectFit: "contain" }} />
      </div>
    ),
    size,
  );
}
