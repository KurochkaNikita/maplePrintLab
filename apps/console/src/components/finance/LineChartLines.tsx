import type { ChartGeometry } from "@/lib/finance/chart";
import { smoothPath } from "@/lib/finance/chart";
import { LINE_TONES } from "./lineTones";
import type { LineChartSeries } from "./LineChart";

export interface LineChartLinesProps {
  geometry: ChartGeometry;
  xs: number[];
  series: LineChartSeries[];
  /** Point marked on every line: the hovered one, or the last. */
  marked: number;
}

/** The smooth lines, a soft fill under the income line, and a dot on every line at the marked point. */
export function LineChartLines({ geometry: g, xs, series, marked }: LineChartLinesProps) {
  const pathOf = (s: LineChartSeries) => smoothPath(xs.map((x, i) => ({ x: g.px(x), y: g.py(s.values[i]) })));
  const income = series.find((s) => s.tone === "income");

  return (
    <>
      {income && xs.length > 1 && <path d={`${pathOf(income)}L${g.px(xs[xs.length - 1])},${g.zero}L${g.px(xs[0])},${g.zero}Z`} className="fill-teal/10" />}

      {series.map((s) => (
        <path
          key={s.id}
          d={pathOf(s)}
          fill="none"
          className={LINE_TONES[s.tone].stroke}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={LINE_TONES[s.tone].dash}
        />
      ))}

      {series.map((s) => (
        <circle key={s.id} cx={g.px(xs[marked])} cy={g.py(s.values[marked])} r={5} strokeWidth={2} className={`stroke-white ${LINE_TONES[s.tone].dot}`} />
      ))}
    </>
  );
}

export default LineChartLines;
