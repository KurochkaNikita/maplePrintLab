// Overwrites out/index.html with a plain meta-refresh redirect to the default
// locale, so "/" works on a static host without JS. Runs after `next build`.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const defaultLocale = "en";
const target = `/${defaultLocale}/`;
const outFile = fileURLToPath(new URL("../out/index.html", import.meta.url));

const html = `<!DOCTYPE html>
<html lang="${defaultLocale}">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
</head>
<body>
<p>Redirecting to <a href="${target}">${target}</a>…</p>
</body>
</html>
`;

writeFileSync(outFile, html);
console.log(`root-redirect: out/index.html -> ${target}`);
