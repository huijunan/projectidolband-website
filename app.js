/* Project Idol Band — tab switching, video grid, photo gallery + lightbox */

const VIDEOS = [
  { id: "oH-skaOO_Wg", cat: "live",  title: "[live band cover] 「描く未来」 by MyGO!!!!!" },
  { id: "lrKJHt4T5g0", cat: "live",  title: "[live band cover] 勘ぐれい Hunch Gray by Zutomayo" },
  { id: "1n9TvuueSqw", cat: "live",  title: "[live band cover] 「残機」 by ZUTOMAYO" },
  { id: "DwTESsZ4Rmw", cat: "live",  title: "[Live Band Cover] [Ave Mujica] 素晴らしき世界 でも どこにもない場所 @AnimeExpo2025 Day2 Beer Garden" },
  { id: "Xq81BX9lHBI", cat: "live",  title: "[Live Band Cover] Idol アイドル @AnimeExpo2025 Day2 Beer Garden" },
  { id: "UFsbAHfR65c", cat: "live",  title: "[Live Band Cover] ちゅ、多様性。@AnimeExpo2025 Day2 Beer Garden" },
  { id: "_wsCxizW3To", cat: "live",  title: "[Live Band Cover] 『AI♡SCREAM!』 @AnimeExpo2025 Day2 Beer Garden" },
  { id: "QPAZcxgV2Nw", cat: "live",  title: "[Live Band Cover] [Ave Mujica] Georgette Me, Georgette You @AnimeExpo2025 Day2 Beer Garden" },
  { id: "UY_VGF6Wt1g", cat: "studio", title: "[Project Idol Band Cover] Idol (アイドル) - Yoasobi" },
  { id: "1vfqegLW9Lw", cat: "studio", title: "[Project Idol Band Cover] Karate - Babymetal" },
];
const CAT_LABEL = { live: "Live Performance", studio: "Studio Recording" };

// ---------- photos (single Drive-hosted sprite) ----------
// Sprite: 6 cols x 7 rows of 500x667 cells, in order g1 (6), g2 (25), g3 (8)
const SPRITE_URL = "https://drive.google.com/thumbnail?id=1vcC4MUENKS63T2dSqEfxWweptsRSuYSB&sz=w3000";
const SPRITE_COLS = 6, SPRITE_ROWS = 7;
const PHOTO_GROUPS = [
  { title: "2026-08-22 @ Quarter Note Bar", start: 0, count: 6 },
  { title: "2026-05-29 @ Quarter Note Bar", start: 6, count: 25 },
  { title: "2025-12-05 @ Quarter Note Bar", start: 31, count: 8 },
];

function spritePos(idx) {
  const col = idx % SPRITE_COLS, row = Math.floor(idx / SPRITE_COLS);
  const x = (col / (SPRITE_COLS - 1)) * 100;
  const y = (row / (SPRITE_ROWS - 1)) * 100;
  return x.toFixed(2) + "% " + y.toFixed(2) + "%";
}
function makeCell(idx) {
  const d = document.createElement("div");
  d.className = "photo-cell";
  d.style.backgroundImage = 'url("' + SPRITE_URL + '")';
  d.style.backgroundPosition = spritePos(idx);
  return d;
}

const groupsEl = document.getElementById("photo-groups");
const lightboxState = { list: [], index: 0 };

PHOTO_GROUPS.forEach((g) => {
  const wrap = document.createElement("div");
  wrap.className = "photo-group";
  const h = document.createElement("h3");
  h.textContent = g.title;
  const pg = document.createElement("div");
  pg.className = "photo-grid";
  const list = [];
  for (let i = 0; i < g.count; i++) {
    const idx = g.start + i;
    list.push({ idx, cap: g.title });
    const cell = makeCell(idx);
    cell.setAttribute("role", "img");
    cell.setAttribute("aria-label", g.title + " — photo " + (i + 1));
    cell.addEventListener("click", () => openLightbox(list, i));
    pg.appendChild(cell);
  }
  wrap.appendChild(h);
  wrap.appendChild(pg);
  groupsEl.appendChild(wrap);
});

/* ---------- tabs ---------- */
const tabs = document.querySelectorAll(".tab");
const panels = {
  home: document.getElementById("tab-home"),
  videos: document.getElementById("tab-videos"),
  photos: document.getElementById("tab-photos"),
  about: document.getElementById("tab-about"),
};
function showTab(name) {
  tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  Object.entries(panels).forEach(([k, el]) => el.classList.toggle("active", k === name));
  window.scrollTo({ top: 0 });
}
tabs.forEach((t) => t.addEventListener("click", () => showTab(t.dataset.tab)));
document.querySelectorAll("[data-goto]").forEach((b) =>
  b.addEventListener("click", () => showTab(b.dataset.goto))
);
document.querySelector(".brand").addEventListener("click", (e) => {
  e.preventDefault();
  showTab("home");
});

/* ---------- videos ---------- */
const grid = document.getElementById("video-grid");
VIDEOS.forEach((v) => {
  const card = document.createElement("div");
  card.className = "video-card";
  card.dataset.cat = v.cat;
  card.innerHTML =
    '<div class="video-frame">' +
    '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id + '?rel=0" ' +
    'title="' + v.title.replace(/"/g, "&quot;") + '" loading="lazy" ' +
    'allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>' +
    '<div class="video-meta"><span class="video-cat">' + CAT_LABEL[v.cat] + "</span>" +
    '<p class="video-title">' + v.title + "</p></div>";
  grid.appendChild(card);
});
document.querySelectorAll(".filter").forEach((f) =>
  f.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((x) => x.classList.remove("active"));
    f.classList.add("active");
    const want = f.dataset.filter;
    document.querySelectorAll(".video-card").forEach((c) => {
      c.classList.toggle("hidden", want !== "all" && c.dataset.cat !== want);
    });
  })
);

/* ---------- photos ---------- */
/* ---------- lightbox ---------- */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-cap");

function openLightbox(list, i) {
  lightboxState.list = list;
  lightboxState.index = i;
  renderLb();
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}
function renderLb() {
  const item = lightboxState.list[lightboxState.index];
  lbImg.style.backgroundImage = 'url("' + SPRITE_URL + '")';
  lbImg.style.backgroundPosition = spritePos(item.idx);
  lbCap.textContent = item.cap + " (" + (lightboxState.index + 1) + "/" + lightboxState.list.length + ")";
}
function closeLightbox() {
  lb.hidden = true;
  document.body.style.overflow = "";
}
function stepLb(d) {
  const n = lightboxState.list.length;
  lightboxState.index = (lightboxState.index + d + n) % n;
  renderLb();
}
document.querySelector(".lb-close").addEventListener("click", closeLightbox);
document.querySelector(".lb-prev").addEventListener("click", (e) => { e.stopPropagation(); stepLb(-1); });
document.querySelector(".lb-next").addEventListener("click", (e) => { e.stopPropagation(); stepLb(1); });
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLb(-1);
  if (e.key === "ArrowRight") stepLb(1);
});
