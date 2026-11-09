import type { LineChartSeries } from "./LineChart";

/** Line style per series: the three differ by colour and by stroke, so colour is never the only cue. */
export const LINE_TONES: Record<LineChartSeries["tone"], { stroke: string; dash?: string; dot: string }> = {
  income: { stroke: "stroke-teal", dot: "fill-teal" },
  spent: { stroke: "stroke-amber-deep", dash: "8 6", dot: "fill-amber-deep" },
  profit: { stroke: "stroke-[#15803D]", dash: "1 6", dot: "fill-[#15803D]" },
};
