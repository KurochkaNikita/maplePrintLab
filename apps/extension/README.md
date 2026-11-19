# Marketplace filler (Chrome extension)

Fills the Facebook Marketplace "create item" form from a product in the admin console. **A person always presses Next / Publish**; the extension never does. It is not published in the Chrome Web Store and sends no data to any server (it only downloads the photos from the URLs in the listing).

## Build and install

```bash
MARKETPLACE_EXTENSION_KEY="<public key>" yarn build:extension
```

1. Open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, choose `apps/extension/dist`.
2. Copy the extension ID and set `NEXT_PUBLIC_MARKETPLACE_EXTENSION_ID` in the console project (and `.env.local` for dev).
3. In the admin, open a published product and click **To Marketplace**.

### Fixed extension ID

Without a `key` in the manifest, Chrome derives the ID from the folder path. To pin it: create a key pair once (`openssl genrsa -out key.pem 2048`, keep `key.pem` private and out of git), then
`openssl rsa -in key.pem -pubout -outform DER | openssl base64 -A` gives the value for `MARKETPLACE_EXTENSION_KEY`. The build writes it into `dist/manifest.json` as `key`.

## How it works

Admin → `chrome.runtime.sendMessage(EXTENSION_ID, …)` → `src/background.ts` checks the sender (`https://admin.mapleprintlab.store` or `http://localhost`) and the listing `version`, stores it in `chrome.storage.session` and opens the form. `src/content/fill.ts` waits for the form, **removes the listing from storage first** (a refresh never fills twice), fills the fields and shows a status card.

The listing type lives in `src/listing.ts` and is imported by the console.

## When Facebook changes the form

All lookups are in `src/content/fields.ts` (by `aria-label` and label text, never by class). The Facebook UI language must be **English (US)**. A field that cannot be found is marked "Do it yourself" in the card instead of breaking the rest.

## Notes

- `externally_connectable` ignores ports, so `http://localhost/*` covers every dev port.
- Photos are converted to JPEG through a canvas. If Facebook rejects them, switch `toJpegFile` in `src/content/photos.ts` to PNG.
- Do not post dozens of listings in minutes.

## Chrome Web Store (Unlisted)

The extension is distributed as an **Unlisted** item: not searchable, installable only from its direct link, with automatic updates.

1. `yarn workspace @maple-print-lab/extension package` builds **without** `MARKETPLACE_EXTENSION_KEY` (the store assigns its own ID and rejects a manifest `key`) and writes `apps/extension/marketplace-filler.zip`.
2. In the [Developer Dashboard](https://chrome.google.com/webstore/devconsole) (one-time $5 fee): New item → upload the zip.
3. Store listing: description, a 128 px icon (`icons/128.png`), at least one 1280×800 screenshot, category Productivity. **Visibility: Unlisted.**
4. Privacy tab:
   - Single purpose: "Fills the Facebook Marketplace listing form with a product chosen in the Maple Print Lab admin. The user publishes the listing."
   - `storage`: temporarily holds the product between the admin page and the Facebook tab (`chrome.storage.session`, deleted after filling).
   - Host permissions (`*.public.blob.vercel-storage.com`, the shop domain): download product photos to attach to the form.
   - Content script on `facebook.com/marketplace/create/*`: fills the form fields.
   - Data usage: collects nothing, sells nothing, sends nothing to any server. Privacy policy URL: `https://mapleprintlab.store/en/privacy/` (a dedicated policy page; the store rejects a homepage or owner site as the policy link).
5. After approval, copy the item's ID from the dashboard into `NEXT_PUBLIC_MARKETPLACE_EXTENSION_ID` (console, Vercel and `.env.local`) and show the install link in the admin.
6. Updates: raise `version` in `manifest.json`, run `package`, upload the new zip. Installed copies update themselves.
