// Filtre butonlarının bulunduğu kapsayıcı elementi seçiyoruz
const filterWrap = document.getElementById("filters");

const tiles = Array.from(document.querySelectorAll(".tile"));

function setActiveChip(btn) {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
}

// Seçilen etikete göre foto kartlarını göster/gizle
function applyFilter(tag) {
  tiles.forEach(tile => {
    const tags = (tile.dataset.tags || "").split(",").map(t => t.trim());

    const show = tag === "all" || tags.includes(tag);

    tile.style.display = show ? "" : "none";
  });
}

// Filtre alanı varsa (null değilse) click event'i ekle
if (filterWrap) {
  filterWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return; // Chip değilse işlem yapma

    const tag = btn.dataset.filter;

    setActiveChip(btn);

    applyFilter(tag);
  });
}

// Slideshow / Modal Kısmı

const modal = document.getElementById("modal");

const modalImg = document.getElementById("modalImg");

const modalCaption = document.getElementById("modalCaption");

const closeModal = document.getElementById("closeModal");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

// Filtre sonrası görünür kalan tile'ları geri döndürür
function visibleTiles() {
  return tiles.filter(t => t.style.display !== "none");
}

// Verilen index'teki görseli modalda açar
function openAt(index) {
  const list = visibleTiles();
  if (!list.length) return; 

  currentIndex = Math.max(0, Math.min(index, list.length - 1));

  const tile = list[currentIndex];

  const img = tile.querySelector("img");
  const title = tile.querySelector("h3")?.textContent || "";
  const desc = tile.querySelector("p")?.textContent || "";

  modalImg.src = img.src;
  modalImg.alt = img.alt || title;

  // Modal caption (başlık — açıklama) şeklinde yazdır
  modalCaption.textContent = `${title}${desc ? " — " + desc : ""}`;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeIt() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// Sonraki görsele geç
function next() {
  const list = visibleTiles();
  if (!list.length) return;
  openAt((currentIndex + 1) % list.length); // sona gelince başa döner
}

// Önceki görsele geç
function prev() {
  const list = visibleTiles();
  if (!list.length) return;
  openAt((currentIndex - 1 + list.length) % list.length); // başa gelince sona döner
}

// Her tile'a tıklanınca modal açılması için event ekle
tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const list = visibleTiles();
    const idx = list.indexOf(tile);

    openAt(idx >= 0 ? idx : 0);
  });
});

closeModal?.addEventListener("click", closeIt);
nextBtn?.addEventListener("click", next);
prevBtn?.addEventListener("click", prev);

// Modal arka planına (overlay) tıklanınca kapat
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeIt();
});

// Klavye kontrolleri: ESC kapat, sağ/sol ok ile gezin
document.addEventListener("keydown", (e) => {
  if (!modal?.classList.contains("open")) return; // Modal açık değilse dinleme

  if (e.key === "Escape") closeIt();
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});
