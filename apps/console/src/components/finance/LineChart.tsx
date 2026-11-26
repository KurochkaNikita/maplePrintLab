"use client";

import { useChartHover } from "@/hooks/useChartHover";
import { useChartWidth } from "@/hooks/useChartWidth";
import { CHART_HEIGHT, chartGeometry } from "@/lib/finance/chart";
import { formatCompactMoney } from "@/lib/finance/format";
import type { Locale } from "@/lib/i18n";
import LineChartAxes from "./LineChartAxes";
import LineChartLines from "./LineChartLines";
import LineChartTooltip from "./LineChartTooltip";

export interface LineChartSeries {
  id: string;
  label: string;
  values: number[];
  tone: "income" | "spent" | "profit";
}

export interface LineChartProps {
  /** Position of every point on the x axis, strictly increasing (a day number, a bucket index). */
  xs: number[];
  /** Text above the values in the hover card, one per point. */
  titles: string[];
  /** Labels under the axis. */
  ticks: { x: number; label: string }[];
  series: LineChartSeries[];
  locale: Locale;
  /** Accessible name of the picture. */
  label: string;
}

/** Smooth lines over a shared x axis with a hover card. The numbers are also in a table next to the chart. */
export function LineChart({ xs, titles, ticks, series, locale, label }: LineChartProps) {
  const { ref, width } = useChartWidth();
  const geometry = chartGeometry(
    xs,
    series.flatMap((s) => s.values),
    (value) => formatCompactMoney(value, locale),
    width,
  );
  const { active, handleMove, handleLeave } = useChartHover(xs.map(geometry.px), width);
  const marked = active ?? xs.length - 1;

  return (
    <div ref={ref} className="relative">
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
        className="h-auto w-full touch-pan-y"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <LineChartAxes geometry={geometry} ticks={ticks} locale={locale} />
        {active !== null && (
          <line x1={geometry.px(xs[active])} x2={geometry.px(xs[active])} y1={geometry.top} y2={geometry.bottom} className="stroke-ink/40" strokeWidth={1} />
        )}
        <LineChartLines geometry={geometry} xs={xs} series={series} marked={marked} />
      </svg>
      {active !== null && (
        <LineChartTooltip x={geometry.px(xs[active])} width={width} title={titles[active]} series={series} index={active} locale={locale} />
      )}
    </div>
  );
}

export default LineChart;
