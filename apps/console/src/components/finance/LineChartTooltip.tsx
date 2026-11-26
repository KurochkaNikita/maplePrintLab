import { CHART_WIDTH } from "@/lib/finance/chart";
import { formatMoney } from "@/lib/finance/format";
import type { Locale } from "@/lib/i18n";
import type { LineChartSeries } from "./LineChart";

export interface LineChartTooltipProps {
  /** Picture x of the hovered point. */
  x: number;
  /** Width of the picture in its own units. */
  width: number;
  title: string;
  series: LineChartSeries[];
  /** Index of the hovered point. */
  index: number;
  locale: Locale;
}

/** The card next to the hovered point: its date and the value of every series. Hidden from screen readers; the data table has the numbers. */
export function LineChartTooltip({ x, width, title, series, index, locale }: LineChartTooltipProps) {
  const share = x / width;
  // In a narrow chart there is no room on either side: the card slides along with the point and never leaves the chart.
  const shift = width < CHART_WIDTH ? `${-share * 100}%` : share > 0.6 ? "calc(-100% - 12px)" : "12px";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-lg border border-line bg-white p-3 text-sm shadow-md"
      style={{ left: `${share * 100}%`, transform: `translateX(${shift})` }}
    >
      <p className="font-medium text-charcoal">{title}</p>
      <ul className="mt-1 space-y-0.5">
        {series.map((s) => (
          <li key={s.id} className="flex justify-between gap-4 text-ink">
            <span>{s.label}</span>
            <span className="font-medium tabular-nums text-charcoal">{formatMoney(s.values[index], locale)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LineChartTooltip;
