/**
 * The orange sunburst from the app's onboarding intro: a solid disc with
 * tapered rays. Pure SVG — decorative only.
 */
export function Sunburst({
  className = "",
  rays = 30,
  color = "var(--color-cost)",
}: {
  className?: string;
  rays?: number;
  color?: string;
}) {
  const cx = 100;
  const cy = 100;
  const inner = 40;
  const outer = 98;
  const halfBase = 4.2;

  const paths = Array.from({ length: rays }, (_, i) => {
    const angle = (i / rays) * Math.PI * 2;
    const perp = angle + Math.PI / 2;
    const bx = cx + Math.cos(angle) * inner;
    const by = cy + Math.sin(angle) * inner;
    const tipX = cx + Math.cos(angle) * outer;
    const tipY = cy + Math.sin(angle) * outer;
    const tipHalf = halfBase * 0.55;
    const p = (n: number) => n.toFixed(2);
    return `M${p(bx + Math.cos(perp) * halfBase)} ${p(by + Math.sin(perp) * halfBase)}L${p(tipX + Math.cos(perp) * tipHalf)} ${p(tipY + Math.sin(perp) * tipHalf)}L${p(tipX - Math.cos(perp) * tipHalf)} ${p(tipY - Math.sin(perp) * tipHalf)}L${p(bx - Math.cos(perp) * halfBase)} ${p(by - Math.sin(perp) * halfBase)}Z`;
  }).join("");

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      <path d={paths} fill={color} />
      <circle cx={cx} cy={cy} r={44} fill={color} />
    </svg>
  );
}
