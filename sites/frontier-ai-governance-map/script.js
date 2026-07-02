// Frontier AI Governance Map - render + interactivity
const GEOS = ["US", "China", "UK", "EU", "International"];
const LAYERS = ["Legal", "Institutional", "Corporate", "Voluntary"];
const byId = {};
GOVERNANCE_NODES.forEach(n => byId[n.id] = n);

let selectedId = null;
let showAllEdges = false;
const activeLayers = new Set(LAYERS);
let powerFilter = "all"; // "all" | "highmed"

const board = document.getElementById("board");
const svg = document.getElementById("edges");
const detail = document.getElementById("detail");

function buildBoard() {
  board.innerHTML = "";
  GEOS.forEach(geo => {
    const col = document.createElement("div");
    col.className = "geo-col geo-" + geo;
    const head = document.createElement("div");
    head.className = "geo-head";
    head.textContent = geo;
    col.appendChild(head);

    LAYERS.forEach(layer => {
      const nodes = GOVERNANCE_NODES.filter(n => n.geography === geo && n.layer === layer);
      if (!nodes.length) return;
      const band = document.createElement("div");
      band.className = "layer-band";
      band.dataset.layer = layer;
      const lbl = document.createElement("div");
      lbl.className = "layer-label";
      lbl.textContent = layer;
      band.appendChild(lbl);
      nodes.forEach(n => band.appendChild(makeCard(n)));
      col.appendChild(band);
    });
    board.appendChild(col);
  });
  applyFilters();
}

function makeCard(n) {
  const el = document.createElement("div");
  el.className = `card pw-${n.power} st-${n.status}`;
  el.id = "card-" + n.id;
  el.dataset.id = n.id;
  el.dataset.layer = n.layer;
  el.dataset.power = n.power;
  el.innerHTML =
    `<div class="card-name"><span class="pwr-dot pw-${n.power}"></span>${n.name}</div>` +
    `<div class="card-actor">${n.actor}</div>`;
  el.addEventListener("click", e => { e.stopPropagation(); selectNode(n.id); });
  return el;
}

function selectNode(id) {
  selectedId = (selectedId === id) ? null : id;
  refreshSelection();
}

function refreshSelection() {
  document.querySelectorAll(".card").forEach(c =>
    c.classList.remove("selected", "dep-target", "tension-target"));
  board.classList.toggle("has-selection", !!selectedId && !showAllEdges);

  if (selectedId) {
    const n = byId[selectedId];
    const sel = document.getElementById("card-" + selectedId);
    if (sel) sel.classList.add("selected");
    (n.depends_on || []).forEach(t => {
      const c = document.getElementById("card-" + t);
      if (c) c.classList.add("dep-target");
    });
    (n.tension_with || []).forEach(t => {
      const c = document.getElementById("card-" + t);
      if (c) c.classList.add("tension-target");
    });
    openDetail(n);
  } else {
    closeDetail();
  }
  drawEdges();
}

function openDetail(n) {
  const depList = (n.depends_on || []).map(t => byId[t] ? byId[t].name : t);
  const tenList = (n.tension_with || []).map(t => byId[t] ? byId[t].name : t);
  const powerWord = { high: "High", medium: "Medium", low: "Low", none: "None" }[n.power];
  detail.querySelector(".inner").innerHTML =
    `<h2>${n.name}</h2>` +
    `<div class="meta">${n.geography} &middot; ${n.layer} &middot; Run by ${n.actor} &middot; ` +
    `Real power: <strong>${powerWord}</strong> &middot; Status: ${n.status}</div>` +
    `<div class="did">${n.did}</div>` +
    (n.note ? `<div class="note">Caveat: ${n.note}</div>` : "") +
    `<div class="links">` +
      `<div class="col"><strong class="dep-row">Depends on / derives from</strong>` +
        (depList.length ? depList.map(x => `<div class="dep-row">&rarr; ${x}</div>`).join("")
                        : `<span class="empty">nothing logged</span>`) +
      `</div>` +
      `<div class="col"><strong class="ten-row">In tension with</strong>` +
        (tenList.length ? tenList.map(x => `<div class="ten-row">&times; ${x}</div>`).join("")
                        : `<span class="empty">nothing logged</span>`) +
      `</div>` +
    `</div>`;
  detail.classList.add("open");
}
function closeDetail() { detail.classList.remove("open"); }

// ---- edge drawing ----
function centerOf(id) {
  const c = document.getElementById("card-" + id);
  if (!c || c.classList.contains("hidden")) return null;
  const wrap = document.getElementById("boardWrap").getBoundingClientRect();
  const r = c.getBoundingClientRect();
  return { x: r.left - wrap.left + r.width / 2, y: r.top - wrap.top + r.height / 2 };
}

function line(a, b, color, dashed) {
  const wrap = document.getElementById("boardWrap").getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${wrap.width} ${wrap.height}`);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const midY = (a.y + b.y) / 2;
  path.setAttribute("d", `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", "1.6");
  path.setAttribute("opacity", showAllEdges ? "0.28" : "0.9");
  if (dashed) path.setAttribute("stroke-dasharray", "4 3");
  svg.appendChild(path);
}

function drawEdges() {
  svg.innerHTML = "";
  const drawFor = (n) => {
    const from = centerOf(n.id);
    if (!from) return;
    (n.depends_on || []).forEach(t => {
      const to = centerOf(t);
      if (to) line(from, to, getCss("--dep"), false);
    });
    (n.tension_with || []).forEach(t => {
      const to = centerOf(t);
      if (to) line(from, to, getCss("--tension"), true);
    });
  };
  if (showAllEdges) {
    GOVERNANCE_NODES.forEach(drawFor);
  } else if (selectedId) {
    drawFor(byId[selectedId]);
  }
}

function getCss(v) {
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
}

// ---- filters ----
function applyFilters() {
  document.querySelectorAll(".card").forEach(c => {
    const n = byId[c.dataset.id];
    let show = activeLayers.has(n.layer);
    if (powerFilter === "highmed" && !(n.power === "high" || n.power === "medium")) show = false;
    c.classList.toggle("hidden", !show);
  });
  document.querySelectorAll(".layer-band").forEach(b => {
    const anyVisible = [...b.querySelectorAll(".card")].some(c => !c.classList.contains("hidden"));
    b.style.display = anyVisible ? "" : "none";
  });
  drawEdges();
}

// ---- gaps ----
function buildGaps() {
  const grid = document.getElementById("gapGrid");
  grid.innerHTML = GOVERNANCE_GAPS.map(g =>
    `<div class="gap-card">
       <div class="g-name">${g.name}</div>
       <div class="g-did">${g.did}</div>
       <div class="g-src">${g.source}</div>
     </div>`).join("");
}

// ---- wiring ----
document.getElementById("boardWrap").addEventListener("click", () => { selectedId = null; refreshSelection(); });

document.querySelectorAll("[data-layer-toggle]").forEach(cb => {
  cb.addEventListener("change", () => {
    const L = cb.dataset.layerToggle;
    cb.checked ? activeLayers.add(L) : activeLayers.delete(L);
    applyFilters();
  });
});

document.getElementById("powerToggle").addEventListener("change", e => {
  powerFilter = e.target.checked ? "highmed" : "all";
  applyFilters();
});

document.getElementById("edgesToggle").addEventListener("click", () => {
  showAllEdges = !showAllEdges;
  document.getElementById("edgesToggle").textContent =
    showAllEdges ? "Hide all dependencies" : "Show all dependencies";
  if (showAllEdges) { selectedId = null; }
  refreshSelection();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  selectedId = null; showAllEdges = false;
  document.getElementById("edgesToggle").textContent = "Show all dependencies";
  refreshSelection();
});

window.addEventListener("resize", drawEdges);
window.addEventListener("scroll", drawEdges, true);

buildBoard();
buildGaps();
