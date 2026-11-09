import type { ChartGeometry } from "@/lib/finance/chart";
import { CHART_HEIGHT } from "@/lib/finance/chart";
import { formatCompactMoney } from "@/lib/finance/format";
import type { Locale } from "@/lib/i18n";

export interface LineChartAxesProps {
  geometry: ChartGeometry;
  ticks: { x: number; label: string }[];
  locale: Locale;
}

/** Horizontal grid lines with amounts on the left, and the labels under the x axis. */
export function LineChartAxes({ geometry: g, ticks, locale }: LineChartAxesProps) {
  return (
    <>
      {g.scale.ticks.map((tick) => (
        <g key={tick}>
          <line x1={g.left} x2={g.right} y1={g.py(tick)} y2={g.py(tick)} className="stroke-line" strokeWidth={tick === 0 ? 1.5 : 1} />
          <text x={g.left - 10} y={g.py(tick)} textAnchor="end" dominantBaseline="middle" className="fill-ink text-[14px]">
            {formatCompactMoney(tick, locale)}
          </text>
        </g>
      ))}
      {ticks.map((tick, i) => (
        <text
          key={tick.x}
          x={g.px(tick.x)}
          y={CHART_HEIGHT - 8}
          textAnchor={i === 0 && g.px(tick.x) < g.left + 12 ? "start" : "middle"}
          className="fill-ink text-[14px]"
        >
          {tick.label}
        </text>
      ))}
    </>
  );
}

export default LineChartAxes;
