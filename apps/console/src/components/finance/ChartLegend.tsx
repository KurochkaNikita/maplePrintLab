export interface ChartLegendProps {
  income: string;
  spent: string;
  /** Left out when the chart has no profit line. */
  profit?: string;
}

/** Legend of the earned/spent chart. Each series also differs by line style (solid, dashed, dotted), not by colour alone. */
export function ChartLegend({ income, spent, profit }: ChartLegendProps) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal">
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="h-1 w-8 rounded-full bg-teal" />
        {income}
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="h-1 w-8 bg-[repeating-linear-gradient(90deg,#C2410C_0,#C2410C_6px,transparent_6px,transparent_10px)]" />
        {spent}
      </li>
      {profit && (
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-1 w-8 bg-[repeating-linear-gradient(90deg,#15803D_0,#15803D_2px,transparent_2px,transparent_6px)]" />
          {profit}
        </li>
      )}
    </ul>
  );
}

export default ChartLegend;
