"use client";

import { useState, type PointerEvent } from "react";
import { nearestIndex } from "@/lib/finance/chart";

/** Which point of an SVG chart the pointer is nearest to (null when it is away). `pictureXs` are the points' picture x positions in a picture `width` wide. */
export function useChartHover(pictureXs: number[], width: number) {
  const [active, setActive] = useState<number | null>(null);

  const handleMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setActive(nearestIndex(pictureXs, ((event.clientX - rect.left) / rect.width) * width));
  };
  const handleLeave = () => setActive(null);

  return { active, handleMove, handleLeave };
}
