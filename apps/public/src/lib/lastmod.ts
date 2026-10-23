import { execFileSync } from "node:child_process";

/** Commit-message marker of the move into apps/web, ignored when dating a page. */
const RELOCATION_MARKER = "[relocation: keep lastmod]";

/**
 * Date of the latest git commit touching any of `paths` (repo-relative), or
 * `undefined` when git history isn't available (e.g. a shallow clone or no
 * `.git` on the host). Callers omit `lastModified` then — a missing date is
 * better than a build-time one that claims everything just changed.
 */
export function lastModified(...paths: string[]): Date | undefined {
  try {
    // The app lives in apps/web but its files were moved there from the repo root: also look at
    // the old root-level location (`:(top)`), and skip the commit that did the move itself.
    const specs = [...paths, ...paths.map((p) => `:(top)${p}`)];
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--invert-grep", "--fixed-strings", `--grep=${RELOCATION_MARKER}`, "--", ...specs], {
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
