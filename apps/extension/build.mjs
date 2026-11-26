// Bundles the entry points into dist/ and copies the popup files and the manifest. No network, no minification (easy to audit).
import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

await build({
  entryPoints: { background: "src/background.ts", content: "src/content/fill.ts", popup: "src/popup/popup.ts" },
  outdir: "dist",
  bundle: true,
  format: "iife",
  target: "chrome120",
  logLevel: "info",
});

await cp("icons", "dist/icons", { recursive: true });
await cp("src/popup/popup.html", "dist/popup.html");
await cp("src/popup/popup.css", "dist/popup.css");

// The public key pins the extension ID (see README). Without it Chrome assigns an ID from the folder path.
const manifest = JSON.parse(await readFile("manifest.json", "utf8"));
if (process.env.MARKETPLACE_EXTENSION_KEY) manifest.key = process.env.MARKETPLACE_EXTENSION_KEY;
else console.warn("MARKETPLACE_EXTENSION_KEY is not set: the extension ID will not be stable.");
await writeFile("dist/manifest.json", JSON.stringify(manifest, null, 2));
