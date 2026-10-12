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

// ---------- photos (Drive-hosted sprites) ----------
// Main sprite: 6 cols x 7 rows of 500x667 cells, in order g1 (6), g2 (25), g3 (8)
// AX2025 sprite: 5 cols x 6 rows of 600x600 cells, 30 photos
const SPRITES = {
  main: {
    url: "https://drive.google.com/thumbnail?id=1vcC4MUENKS63T2dSqEfxWweptsRSuYSB&sz=w3000",
    cols: 6, rows: 7,
  },
  ax2025: {
    url: "https://drive.google.com/thumbnail?id=1PlC6St93frG0JATXw9PkanfjYS6UotId&sz=w2500",
    cols: 5, rows: 6,
  },
};
const PHOTO_GROUPS = [
  { title: "2026-08-22 @ Quarter Note Bar", sprite: "main", start: 0, count: 6 },
  { title: "2026-05-29 @ Quarter Note Bar", sprite: "main", start: 6, count: 25 },
  { title: "2025-12-05 @ Quarter Note Bar", sprite: "main", start: 31, count: 8 },
  { title: "2025-07 @ Anime Expo", sprite: "ax2025", start: 0, count: 30 },
];

function spritePos(sp, idx) {
  const col = idx % sp.cols, row = Math.floor(idx / sp.cols);
  const x = (col / (sp.cols - 1)) * 100;
  const y = (row / (sp.rows - 1)) * 100;
  return x.toFixed(2) + "% " + y.toFixed(2) + "%";
}
function makeCell(spriteKey, idx) {
  const sp = SPRITES[spriteKey];
  const d = document.createElement("div");
  d.className = "photo-cell";
  d.style.backgroundImage = 'url("' + sp.url + '")';
  d.style.backgroundSize = (sp.cols * 100) + "% " + (sp.rows * 100) + "%";
  d.style.backgroundPosition = spritePos(sp, idx);
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
    list.push({ sprite: g.sprite, idx, cap: g.title });
    const cell = makeCell(g.sprite, idx);
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
  b.addEventListener("click", () => {
    showTab(b.dataset.goto);
    if (b.dataset.scroll) {
      setTimeout(() => {
        const el = document.getElementById(b.dataset.scroll);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 60);
    }
  })
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
  const sp = SPRITES[item.sprite];
  lbImg.style.backgroundImage = 'url("' + sp.url + '")';
  lbImg.style.backgroundSize = (sp.cols * 100) + "% " + (sp.rows * 100) + "%";
  lbImg.style.backgroundPosition = spritePos(sp, item.idx);
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

/* chibi decorations — subtle, randomized per visit */
(function () {
  const CHIBI = {
    play: "https://drive.google.com/thumbnail?id=19UQ2YQYMEvR4AwICtFhTwugjEPcOGnT5&sz=w640",
    peek: "https://drive.google.com/thumbnail?id=1VlaKIYlCkm82NnNdBFkHHTGaMsdub5RF&sz=w640",
    sit: "https://drive.google.com/thumbnail?id=1WKR3mIoMig_S0Rkowv4k61OnaDfwkvrK&sz=w640",
    group: "https://drive.google.com/thumbnail?id=1E6RwnvU5KbBPMsajTTPFhKQNddN4yOgh&sz=w640",
  };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  function mk(kind, cls) {
    const img = document.createElement("img");
    img.src = CHIBI[kind];
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.className = "chibi " + cls;
    img.loading = "lazy";
    return img;
  }
  // little heads peeking over every footer
  document.querySelectorAll("footer").forEach((f) => {
    const p = mk("peek", "chibi-peek");
    p.style.left = rnd(6, 62).toFixed(1) + "%";
    p.style.animationDelay = rnd(0, 5).toFixed(2) + "s";
    f.appendChild(p);
  });
  // quiet companion: on desktop it perches above the ABOUT US tab (inside the tab button);
  // on mobile it sits top-right of the header
  const aboutTab = document.querySelector('.tab[data-tab="about"]');
  const isDesktop = window.matchMedia("(min-width: 900px)").matches;
  if (isDesktop && aboutTab) {
    aboutTab.appendChild(mk(pick(["play", "sit", "group"]), "chibi-nav"));
  } else {
    const navHost = document.querySelector(".head-inner") || document.querySelector(".site-head");
    if (navHost) navHost.appendChild(mk(pick(["play", "sit", "group"]), "chibi-nav"));
  }
})();
