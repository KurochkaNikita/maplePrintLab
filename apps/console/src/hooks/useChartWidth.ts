"use client";

import { useEffect, useRef, useState } from "react";
import { CHART_WIDTH } from "@/lib/finance/chart";

/**
 * Width to draw a chart at. In a container narrower than `CHART_WIDTH` the picture is drawn at the container's own
 * width, so its text keeps its size instead of shrinking; a wider container scales the picture up.
 */
export function useChartWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(CHART_WIDTH);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const measured = Math.round(entry.contentRect.width);
      // A hidden container reports 0: keep the last real width.
      if (measured > 0) setWidth(Math.min(measured, CHART_WIDTH));
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
