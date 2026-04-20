# The Pint & Index

A ruthlessly investigated survey of ale, lager and liquid refreshment in East Grinstead, West Sussex. A single-page, static website aimed at the East Grinstead Dads Facebook group — a Madri price league, a weighted "Dad Index", a pint-tax calculator, a personality quiz, a recommended crawl and a Leaflet map.

**All prices are placeholder data.** The real numbers arrive after the real crawl.

## Stack

- `index.html` — semantic markup, all twelve sections
- `styles.css` — parchment / wood / brass / crimson aesthetic, mobile first
- `data.js` — every pub, every price, every sub-score, the crawl order and quiz
- `app.js` — league tables, calculators, quiz, modal, map
- `og-image.svg` — social share card

No build step, no framework, no npm. Open `index.html` in a browser and it runs. Leaflet is loaded from CDN and degrades gracefully if you are offline.

## How to update prices after the real crawl

1. Open `data.js`.
2. In the `PUBS` array, find the pub you drank at.
3. Edit the `prices` object. Keys are `carling`, `guinness`, `madri`, `stella`, `ipa`, `houseLager`. Use numbers (`4.65`, not `"£4.65"`). Use `null` if the pub doesn't serve that drink.
4. Update `LAST_UPDATED` at the top of the file.
5. Commit and push. GitHub Pages rebuilds in about a minute.

```js
// Example — updating the Ship Inn:
{
  id: "ship-inn",
  name: "The Ship Inn",
  ...
  prices: {
    carling: 5.25,     // <-- changed
    guinness: 6.10,    // <-- changed
    madri: 5.75,
    stella: 5.50,
    ipa: 5.40,
    houseLager: 5.25
  }
}
```

## How to add or remove a pub

**Add:** append a new object to the `PUBS` array in `data.js`, following the same shape as the others. Every field is required (`id`, `name`, `type`, `address`, `phone`, `lat`, `lng`, `description`, `prices`, `scores`). Give it a unique `id` (slug form, e.g. `"red-lion"`). If you want it in the optimised crawl, add an entry to the `CRAWL` array with the right `order` and `time`.

**Remove:** delete the pub's object from `PUBS` — and, if it appears, from `CRAWL`, `QUIZ` answer `points`, and `VERDICTS`. The rest of the site rerenders from the data.

## How to edit the Dad Index

Each pub has a `scores` object — five integers 0–10 for price, guinness quality, beer garden, footie on the telly and dog-friendliness. Edit those numbers in `data.js` and the league table rerenders. Default weights live in `DEFAULT_WEIGHTS`; visitors can override with the on-page sliders.

## How to edit the minimum wage figure

Change `MIN_WAGE_HOURLY` at the top of `data.js`. The "minutes of work per pint" chart recomputes on next load.

## How to deploy to GitHub Pages

1. Push the repo to GitHub (these files sit at the repo root).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch".
4. Pick **Branch: main** and **Folder: / (root)**. Save.
5. Wait about a minute. Your site is at `https://<user>.github.io/EGPubCrawl/`.

If you change the repo name later, update the Open Graph `og:image` path if needed — it's a relative path so it should follow the rename.

## Local preview

Just double-click `index.html`, or if you prefer a local server:

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

## Credit

Compiled in the name of public service by your local dads. Typography: Playfair Display, Cormorant Garamond, JetBrains Mono (all Open Font Licence). Map: OpenStreetMap via Leaflet.

Pull requests welcome — especially price corrections, because you are definitely going to spot one.

## Licence

MIT. See `LICENSE`.
