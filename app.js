const quotes = [
  // Inspiration
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "inspiration" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "inspiration" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "inspiration" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan", category: "inspiration" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "inspiration" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "inspiration" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "inspiration" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", category: "inspiration" },

  // Wisdom
  { text: "The unexamined life is not worth living.", author: "Socrates", category: "wisdom" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", category: "wisdom" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein", category: "wisdom" },
  { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi", category: "wisdom" },
  { text: "The fool doth think he is wise, but the wise man knows himself to be a fool.", author: "William Shakespeare", category: "wisdom" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "wisdom" },
  { text: "A smooth sea never made a skilled sailor.", author: "Franklin D. Roosevelt", category: "wisdom" },
  { text: "He who knows others is wise; he who knows himself is enlightened.", author: "Lao Tzu", category: "wisdom" },

  // Humor
  { text: "The trouble with having an open mind, of course, is that people will insist on coming along and trying to put things in it.", author: "Terry Pratchett", category: "humor" },
  { text: "I am so clever that sometimes I don't understand a single word of what I am saying.", author: "Oscar Wilde", category: "humor" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein", category: "humor" },
  { text: "If you think you are too small to make a difference, try sleeping with a mosquito.", author: "Dalai Lama", category: "humor" },
  { text: "A day without laughter is a day wasted.", author: "Charlie Chaplin", category: "humor" },
  { text: "The secret of staying young is to live honestly, eat slowly, and lie about your age.", author: "Lucille Ball", category: "humor" },
  { text: "I always wanted to be somebody, but now I realize I should have been more specific.", author: "Lily Tomlin", category: "humor" },
  { text: "Behind every great man is a woman rolling her eyes.", author: "Jim Carrey", category: "humor" },

  // Life
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "life" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller", category: "life" },
  { text: "Not how long, but how well you have lived is the main thing.", author: "Seneca", category: "life" },
  { text: "The purpose of life is to live it, to taste experience to the utmost, to reach out eagerly and without fear for newer and richer experience.", author: "Eleanor Roosevelt", category: "life" },
  { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou", category: "life" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "life" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde", category: "life" },

  // Success
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "success" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "success" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "success" },
  { text: "The secret of success is to do the common thing uncommonly well.", author: "John D. Rockefeller Jr.", category: "success" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", category: "success" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "success" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser", category: "success" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "success" },
];

// ── Persistence ──
function loadFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem("quotify_favorites") || "[]")); }
  catch { return new Set(); }
}
function saveFavorites() {
  localStorage.setItem("quotify_favorites", JSON.stringify([...favorites]));
}
function loadTheme() {
  const saved = localStorage.getItem("quotify_theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
function saveTheme(theme) {
  localStorage.setItem("quotify_theme", theme);
}

// ── State ──
let activeCategory = "all";
let searchQuery = "";
let currentQuote = null;
let historyStack = [];
let historyPos = -1;
let favorites = loadFavorites();

// ── DOM refs ──
const quoteText      = document.getElementById("quote-text");
const quoteAuthor    = document.getElementById("quote-author");
const quoteBadge     = document.getElementById("quote-category");
const counter        = document.getElementById("counter");
const totalCount     = document.getElementById("total-count");
const btnNew         = document.getElementById("btn-new");
const btnCopy        = document.getElementById("btn-copy");
const btnTwitter     = document.getElementById("btn-twitter");
const copyLabel      = document.getElementById("copy-label");
const btnFavorite    = document.getElementById("btn-favorite");
const btnBack        = document.getElementById("btn-back");
const btnForward     = document.getElementById("btn-forward");
const btnTheme       = document.getElementById("btn-theme");
const iconMoon       = document.getElementById("icon-moon");
const iconSun        = document.getElementById("icon-sun");
const searchInput    = document.getElementById("search-input");
const btnSearchClear = document.getElementById("btn-search-clear");
const noResults      = document.getElementById("no-results");
const noFavorites    = document.getElementById("no-favorites");
const quoteCard      = document.getElementById("quote-card");
const favCountBadge  = document.getElementById("fav-count-badge");
const categoryBtns   = document.querySelectorAll(".category-btn");

// ── Helpers ──
function getFavKey(q) { return `${q.text}|||${q.author}`; }
function isFavorite(q) { return favorites.has(getFavKey(q)); }

function getFilteredQuotes() {
  let pool;
  if (activeCategory === "favorites") {
    pool = quotes.filter(q => isFavorite(q));
  } else if (activeCategory === "all") {
    pool = [...quotes];
  } else {
    pool = quotes.filter(q => q.category === activeCategory);
  }
  if (searchQuery.trim()) {
    const s = searchQuery.toLowerCase();
    pool = pool.filter(q =>
      q.text.toLowerCase().includes(s) || q.author.toLowerCase().includes(s)
    );
  }
  return pool;
}

function updateCounter() {
  if (historyStack.length === 0) { counter.textContent = ""; return; }
  const pool = getFilteredQuotes();
  if (pool.length === 0) { counter.textContent = ""; return; }
  if (historyStack.length > 1) {
    counter.textContent = `${historyPos + 1} / ${historyStack.length} viewed  ·  ${pool.length} available`;
  } else {
    counter.textContent = `${pool.length} quote${pool.length !== 1 ? "s" : ""} available`;
  }
}

function updateHistoryButtons() {
  btnBack.disabled    = historyPos <= 0;
  btnForward.disabled = historyPos >= historyStack.length - 1;
}

function updateFavoriteButton() {
  if (!currentQuote) return;
  const faved = isFavorite(currentQuote);
  btnFavorite.classList.toggle("active", faved);
  btnFavorite.setAttribute("aria-label", faved ? "Remove from favorites" : "Save to favorites");
}

function updateFavBadge() {
  const count = favorites.size;
  favCountBadge.textContent = count;
  favCountBadge.style.display = count > 0 ? "inline-flex" : "none";
}

function showEmptyState(type) {
  quoteCard.style.display   = "none";
  noResults.style.display   = type === "search"    ? "flex" : "none";
  noFavorites.style.display = type === "favorites" ? "flex" : "none";
  counter.textContent       = "";
}

function hideEmptyState() {
  quoteCard.style.display   = "";
  noResults.style.display   = "none";
  noFavorites.style.display = "none";
}

// ── Render quote on screen ──
function renderQuote(q, animate = true) {
  hideEmptyState();

  if (!animate) {
    quoteText.textContent   = q.text;
    quoteAuthor.textContent = q.author;
    quoteBadge.textContent  = q.category;
    currentQuote = q;
    updateCounter();
    updateFavoriteButton();
    updateHistoryButtons();
    return;
  }

  quoteText.classList.add("fade-out");
  quoteAuthor.style.opacity = "0";
  quoteBadge.style.opacity  = "0";

  setTimeout(() => {
    quoteText.textContent   = q.text;
    quoteAuthor.textContent = q.author;
    quoteBadge.textContent  = q.category;
    currentQuote = q;
    updateCounter();
    updateFavoriteButton();
    updateHistoryButtons();

    quoteText.classList.remove("fade-out");
    quoteText.classList.add("fade-in");
    quoteAuthor.style.opacity = "1";
    quoteBadge.style.opacity  = "1";

    setTimeout(() => quoteText.classList.remove("fade-in"), 300);
  }, 250);
}

// ── Show quote + push to history ──
function showQuote(q, animate = true, addToHistory = true) {
  if (addToHistory) {
    historyStack = historyStack.slice(0, historyPos + 1);
    historyStack.push(q);
    historyPos = historyStack.length - 1;
  }
  renderQuote(q, animate);
}

function nextQuote() {
  const pool = getFilteredQuotes();
  if (pool.length === 0) {
    showEmptyState(activeCategory === "favorites" ? "favorites" : "search");
    return;
  }
  let next;
  do { next = pool[Math.floor(Math.random() * pool.length)]; }
  while (next === currentQuote && pool.length > 1);
  showQuote(next);
}

// ── History navigation ──
function goBack() {
  if (historyPos > 0) {
    historyPos--;
    renderQuote(historyStack[historyPos], true);
  }
}

function goForward() {
  if (historyPos < historyStack.length - 1) {
    historyPos++;
    renderQuote(historyStack[historyPos], true);
  }
}

// ── Copy ──
function copyQuote() {
  if (!currentQuote) return;
  const text = `"${currentQuote.text}" — ${currentQuote.author}`;
  navigator.clipboard.writeText(text).then(() => {
    copyLabel.textContent = "Copied!";
    btnCopy.classList.add("copied");
    setTimeout(() => { copyLabel.textContent = "Copy"; btnCopy.classList.remove("copied"); }, 2000);
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    copyLabel.textContent = "Copied!";
    setTimeout(() => { copyLabel.textContent = "Copy"; }, 2000);
  });
}

// ── Tweet ──
function tweetQuote() {
  if (!currentQuote) return;
  const tweetText = `"${currentQuote.text}" — ${currentQuote.author}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, "_blank", "noopener,noreferrer");
}

// ── Favorites ──
function toggleFavorite() {
  if (!currentQuote) return;
  const key = getFavKey(currentQuote);
  if (favorites.has(key)) favorites.delete(key);
  else favorites.add(key);
  saveFavorites();
  updateFavoriteButton();
  updateFavBadge();

  // If we're browsing favorites and just unfavorited the only quote left, show empty state
  if (activeCategory === "favorites" && getFilteredQuotes().length === 0) {
    showEmptyState("favorites");
  }

  btnFavorite.classList.add("pop");
  setTimeout(() => btnFavorite.classList.remove("pop"), 400);
}

// ── Category filter ──
function setCategory(category) {
  activeCategory = category;
  categoryBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.category === category));

  const pool = getFilteredQuotes();
  if (pool.length === 0) {
    showEmptyState(category === "favorites" ? "favorites" : "search");
    return;
  }
  const next = pool[Math.floor(Math.random() * pool.length)];
  showQuote(next);
}

// ── Search ──
function handleSearch() {
  searchQuery = searchInput.value;
  btnSearchClear.style.display = searchQuery ? "" : "none";

  const pool = getFilteredQuotes();
  if (pool.length === 0) {
    showEmptyState("search");
    return;
  }
  // Keep showing the current quote if it's still in the filtered pool
  if (currentQuote && pool.includes(currentQuote)) {
    hideEmptyState();
    updateCounter();
  } else {
    showQuote(pool[Math.floor(Math.random() * pool.length)]);
  }
}

function clearSearch() {
  searchInput.value = "";
  searchQuery = "";
  btnSearchClear.style.display = "none";
  searchInput.focus();

  const pool = getFilteredQuotes();
  if (pool.length === 0) {
    showEmptyState(activeCategory === "favorites" ? "favorites" : "search");
    return;
  }
  if (currentQuote && pool.includes(currentQuote)) {
    hideEmptyState();
    updateCounter();
  } else {
    showQuote(pool[Math.floor(Math.random() * pool.length)]);
  }
}

// ── Theme ──
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  iconMoon.style.display = theme === "dark" ? "none" : "";
  iconSun.style.display  = theme === "dark" ? ""     : "none";
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  saveTheme(next);
}

// ── Event listeners ──
btnNew.addEventListener("click", nextQuote);
btnCopy.addEventListener("click", copyQuote);
btnTwitter.addEventListener("click", tweetQuote);
btnFavorite.addEventListener("click", toggleFavorite);
btnBack.addEventListener("click", goBack);
btnForward.addEventListener("click", goForward);
btnTheme.addEventListener("click", toggleTheme);
searchInput.addEventListener("input", handleSearch);
btnSearchClear.addEventListener("click", clearSearch);

categoryBtns.forEach(btn => btn.addEventListener("click", () => setCategory(btn.dataset.category)));

document.addEventListener("keydown", e => {
  if (e.target === searchInput) return;
  if (e.code === "Space")      { e.preventDefault(); nextQuote(); }
  if (e.code === "ArrowLeft")  goBack();
  if (e.code === "ArrowRight") goForward();
});

// ── Init ──
(function init() {
  applyTheme(loadTheme());
  totalCount.textContent = quotes.length;
  updateFavBadge();
  const first = quotes[Math.floor(Math.random() * quotes.length)];
  showQuote(first, false);
})();
