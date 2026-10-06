import { execFileSync } from "node:child_process";

/**
 * Date of the latest git commit touching any of `paths` (repo-relative), or
 * `undefined` when git history isn't available (e.g. a shallow clone or no
 * `.git` on the host). Callers omit `lastModified` then — a missing date is
 * better than a build-time one that claims everything just changed.
 */
export function lastModified(...paths: string[]): Date | undefined {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const date = new Date(out);
    return out && !Number.isNaN(date.getTime()) ? date : undefined;
  } catch {
    return undefined;
  }
}

/** Latest of several optional dates. */
export function latest(...dates: (Date | undefined)[]): Date | undefined {
  const real = dates.filter((d): d is Date => d !== undefined);
  return real.length ? new Date(Math.max(...real.map((d) => d.getTime()))) : undefined;
}
