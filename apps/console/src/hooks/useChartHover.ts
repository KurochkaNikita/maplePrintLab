"use client";

import { useState, type PointerEvent } from "react";
import { CHART_WIDTH, nearestIndex } from "@/lib/finance/chart";

/** Which point of an SVG chart the pointer is nearest to (null when it is away). `pictureXs` are the points' picture x positions. */
export function useChartHover(pictureXs: number[]) {
  const [active, setActive] = useState<number | null>(null);

  const handleMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setActive(nearestIndex(pictureXs, ((event.clientX - rect.left) / rect.width) * CHART_WIDTH));
  };
  const handleLeave = () => setActive(null);

  return { active, handleMove, handleLeave };
}
