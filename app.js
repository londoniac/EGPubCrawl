/*
 * The Pint & Index — behaviour
 * Plain ES, no build step, no framework.
 * Reads PUBS / CRAWL / QUIZ / VERDICTS / DEFAULT_WEIGHTS / MIN_WAGE_HOURLY / LAST_UPDATED
 * from data.js.
 */

(function () {
  "use strict";

  const $  = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  const fmtGBP = n => (n == null ? null : "£" + n.toFixed(2));
  const pubById = id => PUBS.find(p => p.id === id);

  /* ===================================================================
   * 1. Kings of the Pint — Madri leaderboard
   * ================================================================= */
  function renderLeaderboard() {
    const list = $("#leaderboard");
    const ranked = PUBS
      .slice()
      .sort((a, b) => {
        const ap = a.prices.madri, bp = b.prices.madri;
        if (ap == null && bp == null) return 0;
        if (ap == null) return 1;
        if (bp == null) return -1;
        return ap - bp;
      });

    list.innerHTML = ranked.map((p, i) => {
      const rank = p.prices.madri == null ? "—" : i + 1;
      const rankClass = p.prices.madri == null ? "rank-none" : `rank-${i + 1}`;
      const crown = i === 0 && p.prices.madri != null ? '<span class="crown" aria-hidden="true">♛</span>' : "";
      const price = p.prices.madri == null
        ? '<span class="price none">no Madri</span>'
        : `<span class="price">${fmtGBP(p.prices.madri)}</span>`;
      return `
        <li class="${rankClass}" data-pub="${p.id}" tabindex="0" role="button" aria-label="${p.name}, ${p.prices.madri == null ? 'no Madri' : 'Madri ' + fmtGBP(p.prices.madri)}">
          <span class="rank">${crown}${rank}</span>
          <span class="pub">${p.name}<small>${p.type}</small></span>
          ${price}
        </li>`;
    }).join("");

    list.addEventListener("click", e => {
      const li = e.target.closest("li[data-pub]");
      if (li) openModal(li.dataset.pub);
    });
    list.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const li = e.target.closest("li[data-pub]");
      if (!li) return;
      e.preventDefault();
      openModal(li.dataset.pub);
    });
  }

  /* ===================================================================
   * 2. Dad Index — weighted composite score
   * ================================================================= */
  const weights = Object.assign({}, DEFAULT_WEIGHTS);
  const WEIGHT_LABELS = {
    price:    "Price",
    guinness: "Guinness",
    garden:   "Beer garden",
    footie:   "Footie on the telly",
    dog:      "Dog-friendly"
  };
  const WEIGHT_ORDER = ["price", "guinness", "garden", "footie", "dog"];

  function computeDadScore(pub) {
    const sum = WEIGHT_ORDER.reduce((acc, k) => acc + weights[k], 0) || 1;
    let total = 0;
    WEIGHT_ORDER.forEach(k => { total += (pub.scores[k] * weights[k]) / sum; });
    return total;
  }

  function renderWeightRows() {
    const host = $("#weight-rows");
    host.innerHTML = WEIGHT_ORDER.map(k => `
      <div class="weight-row">
        <label for="w-${k}">${WEIGHT_LABELS[k]}</label>
        <input type="range" id="w-${k}" min="0" max="60" step="1" value="${weights[k]}" />
        <span class="wval" id="wv-${k}">${weights[k]}%</span>
      </div>
    `).join("");

    WEIGHT_ORDER.forEach(k => {
      $(`#w-${k}`).addEventListener("input", e => {
        weights[k] = parseInt(e.target.value, 10);
        $(`#wv-${k}`).textContent = weights[k] + "%";
        updateWeightSum();
        renderDadIndex();
      });
    });
  }

  function updateWeightSum() {
    const sum = WEIGHT_ORDER.reduce((a, k) => a + weights[k], 0);
    const el = $("#weight-sum");
    el.textContent = "Total weight: " + sum + "%" + (sum === 100 ? "" : " — scores are renormalised");
    el.classList.toggle("warn", sum !== 100);
  }

  function renderDadIndex() {
    const list = $("#dadindex-table");
    const scored = PUBS.map(p => ({ pub: p, score: computeDadScore(p) }))
      .sort((a, b) => b.score - a.score);

    list.innerHTML = scored.map((s, i) => `
      <li class="dadrow" data-pub="${s.pub.id}">
        <span class="r-rank">${i + 1}</span>
        <span class="r-name">${s.pub.name}<br><small style="font-family:var(--mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--brass-deep); font-weight:400;">${s.pub.type}</small></span>
        <span class="r-score">${s.score.toFixed(1)}</span>
        <button class="r-toggle" type="button" aria-expanded="false">Show sub-scores ▾</button>
        <div class="subscores" aria-hidden="true">
          ${WEIGHT_ORDER.map(k => `
            <div class="subscore">
              <div class="s-label">${WEIGHT_LABELS[k]}</div>
              <div class="s-val">${s.pub.scores[k]}</div>
            </div>`).join("")}
        </div>
      </li>
    `).join("");

    if (!list._bound) {
      list.addEventListener("click", e => {
        const tog = e.target.closest(".r-toggle");
        if (tog) {
          const row = tog.closest(".dadrow");
          const open = row.classList.toggle("open");
          tog.setAttribute("aria-expanded", open ? "true" : "false");
          tog.textContent = open ? "Hide sub-scores ▴" : "Show sub-scores ▾";
          return;
        }
        const row = e.target.closest(".dadrow");
        if (row) openModal(row.dataset.pub);
      });
      list._bound = true;
    }
  }

  /* ===================================================================
   * 3. Pint Tax Calculator
   * ================================================================= */
  function renderTaxCalculator() {
    const selA = $("#tax-a");
    const selB = $("#tax-b");
    const opts = PUBS
      .filter(p => p.prices.madri != null)
      .map(p => `<option value="${p.id}">${p.name}</option>`)
      .join("");
    selA.innerHTML = opts;
    selB.innerHTML = opts;

    // Default to max shock value: Old Dunnings Mill vs Ounce & Ivy.
    selA.value = "dunnings-mill";
    selB.value = "ounce-ivy";

    const pints = $("#tax-pints");
    const pintsVal = $("#tax-pints-val");

    function update() {
      const a = pubById(selA.value);
      const b = pubById(selB.value);
      const n = parseInt(pints.value, 10);
      pintsVal.textContent = n;
      const diff = (a.prices.madri - b.prices.madri) * n * 52;
      const head = $("#tax-headline");
      const amt = $("#tax-amount");

      if (a.id === b.id) {
        head.innerHTML = `If you drink ${n} pints a week at <strong>${a.name}</strong> instead of somewhere else, you&rsquo;re paying exactly the same.`;
        amt.textContent = "£0";
        return;
      }
      if (diff === 0) {
        head.innerHTML = `The Madri price is identical at <strong>${a.name}</strong> and <strong>${b.name}</strong>. A rare tie.`;
        amt.textContent = "£0";
        return;
      }
      const abs = Math.abs(diff);
      const cheaperAtA = diff < 0;
      head.innerHTML = cheaperAtA
        ? `Drinking ${n} pints a week at <strong>${a.name}</strong> instead of <strong>${b.name}</strong> saves you`
        : `Drinking ${n} pints a week at <strong>${a.name}</strong> instead of <strong>${b.name}</strong> costs you an extra`;
      amt.textContent = "£" + abs.toFixed(0) + " / yr";
    }

    selA.addEventListener("change", update);
    selB.addEventListener("change", update);
    pints.addEventListener("input", update);
    update();
  }

  /* ===================================================================
   * 4. Minutes of work per pint — horizontal bars
   * ================================================================= */
  function renderWageChart() {
    const host = $("#wage-chart");
    const rows = PUBS.map(p => {
      const prices = [p.prices.carling, p.prices.houseLager, p.prices.madri, p.prices.stella, p.prices.ipa, p.prices.guinness].filter(x => x != null);
      const cheapest = Math.min.apply(null, prices);
      const minutes = (cheapest / MIN_WAGE_HOURLY) * 60;
      return { pub: p, minutes, cheapest };
    }).sort((a, b) => b.minutes - a.minutes);

    const max = Math.max.apply(null, rows.map(r => r.minutes));

    host.innerHTML = rows.map(r => {
      const pct = Math.max(8, (r.minutes / max) * 100);
      return `
        <div class="bar">
          <div class="label-line">
            <span class="pub-name">${r.pub.name}</span>
            <span class="mins">${r.minutes.toFixed(1)} min &middot; ${fmtGBP(r.cheapest)}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        </div>`;
    }).join("") + `<div class="foot">At £${MIN_WAGE_HOURLY.toFixed(2)}/hr. Edit <code>MIN_WAGE_HOURLY</code> in data.js when the wage rises.</div>`;
  }

  /* ===================================================================
   * 5. Which pub are you? — quiz
   * ================================================================= */
  function renderQuiz() {
    const host = $("#quiz-wrap");
    const qHtml = QUIZ.map((q, qi) => `
      <div class="quiz-question" data-q="${qi}">
        <h3>${qi + 1}. ${q.question}</h3>
        <div class="quiz-answers" role="radiogroup" aria-label="${q.question.replace(/"/g, '&quot;')}">
          ${q.answers.map((a, ai) => `
            <button class="quiz-answer" type="button" role="radio" aria-checked="false" data-q="${qi}" data-a="${ai}">${a.label}</button>
          `).join("")}
        </div>
      </div>
    `).join("");

    host.innerHTML = qHtml + `
      <div class="quiz-result" id="quiz-result" aria-live="polite">
        <p class="eyebrow">Your verdict</p>
        <h3 class="pub-name" id="quiz-pub"></h3>
        <p class="verdict" id="quiz-verdict"></p>
        <button class="btn" id="quiz-share" type="button">Copy result</button>
        <span id="quiz-share-confirm" style="display:none; margin-left:10px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--brass-deep);">Copied.</span>
      </div>
    `;

    const picks = new Array(QUIZ.length).fill(null);

    host.addEventListener("click", e => {
      const btn = e.target.closest(".quiz-answer");
      if (!btn) return;
      const qi = parseInt(btn.dataset.q, 10);
      const ai = parseInt(btn.dataset.a, 10);
      picks[qi] = ai;

      // Clear siblings, mark this one.
      $$(`.quiz-answer[data-q="${qi}"]`, host).forEach(b => {
        b.classList.remove("selected");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("selected");
      btn.setAttribute("aria-checked", "true");

      if (picks.every(p => p !== null)) scoreAndReveal(picks);
    });

    $("#quiz-share").addEventListener("click", () => {
      const name = $("#quiz-pub").textContent;
      const verd = $("#quiz-verdict").textContent;
      const line = `${verd}\n— The Pint & Index, East Grinstead`;
      copy(line, "quiz-share-confirm");
    });
  }

  function scoreAndReveal(picks) {
    const totals = {};
    picks.forEach((ai, qi) => {
      const pts = QUIZ[qi].answers[ai].points;
      Object.keys(pts).forEach(id => {
        totals[id] = (totals[id] || 0) + pts[id];
      });
    });
    let winnerId = null, winnerScore = -Infinity;
    PUBS.forEach(p => {
      const s = totals[p.id] || 0;
      if (s > winnerScore) { winnerScore = s; winnerId = p.id; }
    });
    const winner = pubById(winnerId);
    $("#quiz-pub").textContent = winner.name;
    $("#quiz-verdict").textContent = VERDICTS[winnerId];
    $("#quiz-result").classList.add("show");
  }

  /* ===================================================================
   * 6. Full Ledger — cards
   * ================================================================= */
  function renderLedger() {
    const host = $("#ledger-grid");
    host.innerHTML = PUBS.map(p => {
      const priceCell = (lbl, v) => `
        <div class="lc-price">
          <div class="lp-lbl">${lbl}</div>
          <div class="lp-val${v == null ? ' none' : ''}">${v == null ? '—' : fmtGBP(v)}</div>
        </div>`;
      return `
        <button class="ledger-card" type="button" data-pub="${p.id}" aria-label="Open ${p.name} dossier">
          <div class="lc-head">
            <div class="lc-name">${p.name}</div>
            <span class="chip">${p.type}</span>
          </div>
          <div class="lc-addr">${p.address.replace(/, East Grinstead/, "")}</div>
          <div class="lc-prices">
            ${priceCell("Carling", p.prices.carling)}
            ${priceCell("Guinness", p.prices.guinness)}
            ${priceCell("Madri", p.prices.madri)}
            ${priceCell("IPA", p.prices.ipa)}
          </div>
        </button>`;
    }).join("");

    host.addEventListener("click", e => {
      const c = e.target.closest("[data-pub]");
      if (c) openModal(c.dataset.pub);
    });
  }

  /* ===================================================================
   * 7. Optimised Crawl — timeline
   * ================================================================= */
  function renderCrawl() {
    const host = $("#timeline");
    host.innerHTML = CRAWL.map(stop => {
      const p = pubById(stop.id);
      const cls = stop.lunch ? " lunch" : stop.finish ? " finish" : "";
      const icon = stop.lunch ? "🍔" : stop.finish ? "🏁" : stop.order;
      return `
        <li>
          <span class="bullet${cls}">${icon}</span>
          <div>
            <div class="stop-time">${stop.time}</div>
            <div class="stop-name">${p.name}</div>
            <div class="stop-note">${stop.note}</div>
          </div>
        </li>`;
    }).join("");
  }

  /* ===================================================================
   * 8. Map — Leaflet, gracefully degrading
   * ================================================================= */
  function renderMap() {
    if (typeof L === "undefined") {
      // Leaflet script didn't load (offline or blocked).
      $("#map").style.display = "none";
      $("#map-offline").style.display = "block";
      return;
    }
    try {
      const coords = PUBS.map(p => [p.lat, p.lng]);
      const bounds = L.latLngBounds(coords);

      const map = L.map("map", { scrollWheelZoom: false }).fitBounds(bounds, { padding: [24, 24] });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Handle tile failures gracefully.
      let tileErrors = 0;
      map.on("tileerror", () => {
        if (++tileErrors > 4) {
          $("#map").style.display = "none";
          $("#map-offline").style.display = "block";
          $("#map-offline").textContent = "Map tiles couldn't be reached. The pubs are all still there.";
        }
      });

      const crawlOrder = CRAWL.map(s => s.id);
      const polyline = [];
      crawlOrder.forEach(id => {
        const p = pubById(id);
        polyline.push([p.lat, p.lng]);
      });
      L.polyline(polyline, { color: "#a01e1e", weight: 3, dashArray: "6,6", opacity: 0.8 }).addTo(map);

      CRAWL.forEach(stop => {
        const p = pubById(stop.id);
        const icon = L.divIcon({
          className: "leaflet-marker-label",
          html: String(stop.order),
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        const priceLine = p.prices.madri == null
          ? '<div class="mp-price">No Madri</div>'
          : `<div class="mp-price">Madri ${fmtGBP(p.prices.madri)}</div>`;
        const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
        const popup = `
          <div class="map-popup">
            <h4>${p.name}</h4>
            <div class="mp-type">Stop ${stop.order} &middot; ${p.type}</div>
            ${priceLine}
            <div class="mp-links">
              <a href="tel:${p.phone.replace(/\s/g, '')}">Call</a>
              <a href="${gmaps}" target="_blank" rel="noopener">Directions</a>
            </div>
          </div>`;
        L.marker([p.lat, p.lng], { icon }).addTo(map).bindPopup(popup);
      });

      // Recompute on late layout
      setTimeout(() => map.invalidateSize(), 200);
    } catch (err) {
      console.warn("Map failed:", err);
      $("#map").style.display = "none";
      $("#map-offline").style.display = "block";
    }
  }

  /* ===================================================================
   * 9. Hall of Fame / Shame
   * ================================================================= */
  function renderHall() {
    const withMadri = PUBS.filter(p => p.prices.madri != null);
    const cheapest = withMadri.reduce((a, b) => a.prices.madri < b.prices.madri ? a : b);
    const priciest = withMadri.reduce((a, b) => a.prices.madri > b.prices.madri ? a : b);
    const darkHorse = withMadri
      .map(p => ({ p, ratio: computeDadScore(p) / p.prices.madri }))
      .reduce((a, b) => a.ratio > b.ratio ? a : b).p;

    $("#hall").innerHTML = `
      <div class="hall-card">
        <div class="hc-trophy" aria-hidden="true">👑</div>
        <div class="hc-title">The Crown Jewel</div>
        <div class="hc-pub">${cheapest.name}</div>
        <div class="hc-number">${fmtGBP(cheapest.prices.madri)}</div>
        <div class="hc-note">Cheapest Madri in town.</div>
      </div>
      <div class="hall-card">
        <div class="hc-trophy" aria-hidden="true">💸</div>
        <div class="hc-title">The Rip-Off Merchant</div>
        <div class="hc-pub">${priciest.name}</div>
        <div class="hc-number">${fmtGBP(priciest.prices.madri)}</div>
        <div class="hc-note">Priciest Madri. They&rsquo;re not ashamed.</div>
      </div>
      <div class="hall-card">
        <div class="hc-trophy" aria-hidden="true">🐴</div>
        <div class="hc-title">The Dark Horse</div>
        <div class="hc-pub">${darkHorse.name}</div>
        <div class="hc-number">${computeDadScore(darkHorse).toFixed(1)} / 10</div>
        <div class="hc-note">Best Dad Index per £ of Madri.</div>
      </div>
    `;
  }

  /* ===================================================================
   * 10. CTA — copy leaderboard summary
   * ================================================================= */
  function bindCTA() {
    $("#copy-summary").addEventListener("click", () => {
      const ranked = PUBS
        .filter(p => p.prices.madri != null)
        .slice()
        .sort((a, b) => a.prices.madri - b.prices.madri);
      const lines = [
        "THE PINT & INDEX — East Grinstead Madri league (placeholder prices):",
        ""
      ].concat(ranked.map((p, i) => `${i + 1}. ${p.name} — £${p.prices.madri.toFixed(2)}`));
      lines.push("");
      lines.push("Which did we get wrong? Argue in the comments.");
      copy(lines.join("\n"), "copy-confirm");
    });
  }

  /* ===================================================================
   * 11. Modal — pub dossier
   * ================================================================= */
  let lastFocus = null;

  function openModal(pubId) {
    const p = pubById(pubId);
    if (!p) return;
    lastFocus = document.activeElement;

    $("#modal-title").textContent = p.name;
    $("#modal-type").textContent = p.type;
    $("#modal-desc").textContent = p.description;
    $("#modal-addr").textContent = p.address;
    const phoneLink = $("#modal-phone");
    phoneLink.textContent = p.phone;
    phoneLink.href = "tel:" + p.phone.replace(/\s/g, "");

    const prices = [
      ["Carling",     p.prices.carling],
      ["Guinness",    p.prices.guinness],
      ["Madri",       p.prices.madri],
      ["Stella",      p.prices.stella],
      ["House IPA",   p.prices.ipa],
      ["House lager", p.prices.houseLager]
    ];
    $("#modal-prices").innerHTML = prices.map(([lbl, v]) => `
      <div class="m-price">
        <div class="lp-lbl">${lbl}</div>
        <div class="lp-val${v == null ? ' none' : ''}">${v == null ? 'n/a' : fmtGBP(v)}</div>
      </div>`).join("");

    $("#modal-directions").href = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

    const m = $("#modal");
    m.classList.add("show");
    m.setAttribute("aria-hidden", "false");
    $("#modal-close").focus();
  }

  function closeModal() {
    const m = $("#modal");
    m.classList.remove("show");
    m.setAttribute("aria-hidden", "true");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function bindModal() {
    $("#modal-close").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", e => {
      if (e.target.id === "modal") closeModal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && $("#modal").classList.contains("show")) closeModal();
    });
  }

  /* ===================================================================
   * 12. Copy helper
   * ================================================================= */
  function copy(text, confirmElId) {
    const done = () => {
      const el = document.getElementById(confirmElId);
      if (!el) return;
      el.style.display = "inline";
      clearTimeout(el._t);
      el._t = setTimeout(() => { el.style.display = "none"; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
  }

  /* ===================================================================
   * 13. Scroll reveals
   * ================================================================= */
  function bindReveals() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
    $$(".reveal").forEach(el => io.observe(el));
  }

  /* ===================================================================
   * 14. Noscript fallback (populated anyway — JS ignored if disabled)
   * ================================================================= */
  function renderNoscript() {
    const host = document.getElementById("noscript-pubs");
    if (!host) return;
    host.innerHTML = PUBS.map(p =>
      `<li><strong>${p.name}</strong> — ${p.type} — Madri ${p.prices.madri == null ? 'n/a' : fmtGBP(p.prices.madri)} — ${p.phone}</li>`
    ).join("");
  }

  /* ===================================================================
   * Boot
   * ================================================================= */
  function init() {
    document.getElementById("last-updated").textContent = LAST_UPDATED;

    renderLeaderboard();
    renderWeightRows();
    updateWeightSum();
    renderDadIndex();
    renderTaxCalculator();
    renderWageChart();
    renderQuiz();
    renderLedger();
    renderCrawl();
    renderHall();
    bindCTA();
    bindModal();
    bindReveals();
    renderNoscript();

    // Reset weights
    document.getElementById("weights-reset").addEventListener("click", () => {
      Object.assign(weights, DEFAULT_WEIGHTS);
      WEIGHT_ORDER.forEach(k => {
        document.getElementById("w-" + k).value = weights[k];
        document.getElementById("wv-" + k).textContent = weights[k] + "%";
      });
      updateWeightSum();
      renderDadIndex();
    });

    // Map last — Leaflet loads deferred, so wait for load event.
    if (document.readyState === "complete") {
      renderMap();
    } else {
      window.addEventListener("load", renderMap);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
