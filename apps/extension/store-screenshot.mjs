// Usage: node apps/extension/store-screenshot.mjs input.png output.png
// Fits any screenshot into 1280×800 on white, 24-bit PNG without alpha (Chrome Web Store requirement).
import sharp from "sharp"; // hoisted to the repo root by yarn (it is a dependency of the console)
const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node store-screenshot.mjs input.png output.png");
await sharp(input)
  .resize(1280, 800, { fit: "contain", background: "#ffffff" })
  .flatten({ background: "#ffffff" })
  .removeAlpha()
  .png()
  .toFile(output);
console.log("saved", output);
