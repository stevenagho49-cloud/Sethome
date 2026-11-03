# SET Home website

Next.js site in the "Move-in Day" design. Products, prices and photos come **live from Kai's Shopify shop** (toytake2.co.uk) and refresh every 10 minutes. Anything Kai sells disappears from SET Home automatically.

## What's in it

| Page | What it does |
| --- | --- |
| `/` Home | Hero with postcode checker, 3 starter packs, how it works, newest stock with filters, wanted list, WhatsApp community, reviews slots |
| `/packs/student-room`, `/packs/flat-starter`, `/packs/family-home` | Pack page: photos, items with Swap, live price, "price if bought new", reserve button |
| `/shop` | All stock from Kai's shop, filterable. Tapping an item opens WhatsApp with the item name |
| `/reserve` | Order summary, details, referral code, £50 deposit (card if Stripe is set up, otherwise confirmed by WhatsApp) |
| `/confirmed` | Order reference and next steps |

Pack prices are worked out from Kai's real prices: items added up, minus the pack discount, plus your delivery fee.

## Put it online with Vercel (about 15 minutes)

1. **GitHub:** create a free account at github.com → New repository → name it `sethome-site` → "uploading an existing file" → drag in everything from this folder → Commit.
2. **Vercel:** sign up at vercel.com with your GitHub account → Add New → Project → import `sethome-site` → Deploy.
3. **Settings:** in Vercel go to Project → Settings → Environment Variables and add the ones below. Then Deployments → Redeploy.
4. **Domain:** Project → Settings → Domains → add `sethome.uk` and follow the DNS steps shown.

## Settings (environment variables)

| Name | Example | What it does |
| --- | --- | --- |
| `SHOP_URL` | `https://toytake2.co.uk` | Kai's shop |
| `WHATSAPP_NUMBER` | `447123456789` | Your WhatsApp, international format, no + |
| `CONTACT_EMAIL` | `hello@sethome.uk` | Shown in the footer |
| `COMMUNITY_INVITE_URL` | `https://chat.whatsapp.com/…` | "New in Birmingham" group link |
| `SITE_URL` | `https://sethome.uk` | Your web address |
| `MARKUP_PERCENT` | `0` | Added to Kai's prices. 0 = same price as his shop (your profit is his 20% trade discount) |
| `PACK_DISCOUNT_PERCENT` | `5` | Discount on packs |
| `DELIVERY_FEE` | `0` | £ added to each pack for delivery and set-up |
| `DEPOSIT` | `50` | Deposit in £ |
| `STRIPE_SECRET_KEY` | `sk_live_…` | Optional. Turns on card payment for deposits |
| `LEADS_WEBHOOK_URL` | Google Script URL | Optional. Sends every wanted-list sign-up and reservation to a Google Sheet |

Until `LEADS_WEBHOOK_URL` is set, wanted-list customers are asked to send their list to you on WhatsApp, and reservations show up in Vercel → Logs.

## Send sign-ups and orders to a Google Sheet

1. Create a Google Sheet. Extensions → Apps Script. Paste:

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActive().getSheetByName(d.kind) || SpreadsheetApp.getActive().insertSheet(d.kind);
  if (sheet.getLastRow() === 0) sheet.appendRow(Object.keys(d));
  const head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(head.map((k) => d[k] ?? ''));
  return ContentService.createTextOutput('ok');
}
```

2. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy. Copy the URL into `LEADS_WEBHOOK_URL`.

## Editing

- **Packs:** `lib/packs.ts`. Each item is matched by words in Kai's product names (e.g. `/dining chair/`).
- **Delivery areas:** `lib/areas.ts` (postcode district → area name).
- **Words and sections:** `app/page.tsx` and the other files in `app/`.
- **Colours and fonts:** top of `app/globals.css`.

## Good to know

- If Kai's shop can't be reached, the site shows a built-in backup list (names and prices, no photos) and tries again 10 minutes later.
- Kai can tag products in Shopify with `customer return`, `clearance`, `second hand` or `new`, and the site shows that label.
- In-store sales only disappear from SET Home if Kai records them in Shopify (Shopify POS does this automatically).
- Run locally: `npm install`, then `npm run dev`, and open http://localhost:3000.
