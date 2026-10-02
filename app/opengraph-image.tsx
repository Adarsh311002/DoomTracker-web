import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Doom Tracker — Every scroll has a price. An Android app that prices doomscrolling against your goals.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RAYS = 30;

export default async function Image() {
  const [anton, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Anton-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/SpaceMono-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#101010", position: "relative" }}>
        {/* Sunburst */}
        <svg width="760" height="760" viewBox="0 0 200 200" style={{ position: "absolute", top: -250, right: -230 }}>
          {Array.from({ length: RAYS }, (_, i) => {
            const a = (i / RAYS) * Math.PI * 2;
            const p = a + Math.PI / 2;
            const bx = 100 + Math.cos(a) * 40;
            const by = 100 + Math.sin(a) * 40;
            const tx = 100 + Math.cos(a) * 98;
            const ty = 100 + Math.sin(a) * 98;
            const pts = [
              [bx + Math.cos(p) * 4.2, by + Math.sin(p) * 4.2],
              [tx + Math.cos(p) * 2.3, ty + Math.sin(p) * 2.3],
              [tx - Math.cos(p) * 2.3, ty - Math.sin(p) * 2.3],
              [bx - Math.cos(p) * 4.2, by - Math.sin(p) * 4.2],
            ]
              .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
              .join(" ");
            return <polygon key={i} points={pts} fill="#F5411A" />;
          })}
          <circle cx="100" cy="100" r="44" fill="#F5411A" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: "100%" }}>
          <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 24, letterSpacing: 8, color: "#F4F1E8" }}>
            DOOM TRACKER
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Anton", fontSize: 150, lineHeight: 0.92, color: "#F4F1E8" }}>
              EVERY SCROLL
            </div>
            <div style={{ display: "flex", fontFamily: "Anton", fontSize: 150, lineHeight: 0.92, color: "#F4F1E8" }}>
              HAS A&nbsp;<span style={{ color: "#F5411A" }}>PRICE</span>.
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 22, letterSpacing: 3, color: "#989791" }}>
            ANDROID · SCREEN TIME → OPPORTUNITY COST · V1 IN DEVELOPMENT
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, style: "normal", weight: 400 },
        { name: "Space Mono", data: mono, style: "normal", weight: 700 },
      ],
    },
  );
}
