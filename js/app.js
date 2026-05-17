const routes = [
  { label: "Home", href: "index.html", key: "home" },
  { label: "About", href: "about.html", key: "about" },
  { label: "Developer", href: "developer.html", key: "developer" },
  { label: "Apps", href: "apps.html", key: "apps" }
];

const dataCache = new Map();

const page = document.body.dataset.page || "home";
const root = document.querySelector("[data-page-root]");

async function loadJson(path) {
  if (dataCache.has(path)) return dataCache.get(path);
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  const data = await response.json();
  dataCache.set(path, data);
  return data;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setShell() {
  const header = document.querySelector("[data-shell-header]");
  const footer = document.querySelector("[data-shell-footer]");

  header.innerHTML = `
    <nav class="nav-wrap" aria-label="Primary navigation">
      <a class="brand-lockup" href="index.html" aria-label="MG Corporations home">
        <span class="brand-mark">MG</span>
        <span>
          <strong>JN Corporations</strong>
          <small>Premium PWA</small>
        </span>
      </a>
      <div class="nav-links">
        ${routes.map((route) => `
          <a class="${route.key === page ? "active" : ""}" href="${route.href}">${route.label}</a>
        `).join("")}
      </div>
    </nav>
  `;

  footer.innerHTML = `
    <div class="footer-inner">
      <span>JN Corporations</span>
      <span>Offline-first static ecosystem</span>
    </div>
  `;
}

function iconFor(index) {
  return ["MG", "UX", "AI", "DB", "OS", "GO"][index % 6];
}

function renderHero(about) {
  const metrics = about.metrics.map((metric) => `
    <article class="metric-card reveal">
      <strong>${escapeHtml(metric.value)}</strong>
      <span>${escapeHtml(metric.label)}</span>
    </article>
  `).join("");

  return `
    <section class="hero-grid">
      <div class="hero-copy reveal">
        <span class="eyebrow">${escapeHtml(about.hero.eyebrow)}</span>
        <h1>${escapeHtml(about.hero.title)}</h1>
        <p>${escapeHtml(about.hero.body)}</p>
        <div class="action-row">
          <a class="button primary" href="apps.html">${escapeHtml(about.hero.primaryAction)}</a>
          <a class="button secondary" href="about.html">${escapeHtml(about.hero.secondaryAction)}</a>
        </div>
      </div>
      <div class="ecosystem-visual reveal" aria-label="JN Corporations ecosystem dashboard preview">
        <div class="visual-topline">
          <span></span><span></span><span></span>
        </div>
        <div class="visual-orbit">
          <div class="core-node">MG</div>
          <div class="node node-a">Ops</div>
          <div class="node node-b">Apps</div>
          <div class="node node-c">Dev</div>
          <div class="node node-d">PWA</div>
        </div>
        <div class="visual-bars">
          <span style="--w: 72%"></span>
          <span style="--w: 54%"></span>
          <span style="--w: 86%"></span>
        </div>
      </div>
    </section>
    <section class="metrics-grid">${metrics}</section>
  `;
}

function renderNavTiles(about) {
  return `
    <section class="section-block">
      <div class="section-heading reveal">
        <span class="eyebrow">Platform map</span>
        <h2>Move through the ecosystem.</h2>
      </div>
      <div class="tile-grid">
        ${about.navigation.map((item, index) => `
          <a class="nav-tile reveal" href="${escapeHtml(item.href)}">
            <span class="tile-icon">${iconFor(index)}</span>
            <strong>${escapeHtml(item.label)}</strong>
            <small>${escapeHtml(item.summary)}</small>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderPrinciples(principles) {
  return `
    <section class="section-block">
      <div class="principle-grid">
        ${principles.map((item) => `
          <article class="soft-card reveal">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderTimeline(timeline) {
  return `
    <section class="section-block">
      <div class="section-heading reveal">
        <span class="eyebrow">Timeline</span>
        <h2>A steady platform evolution.</h2>
      </div>
      <div class="timeline">
        ${timeline.map((item) => `
          <article class="timeline-item reveal">
            <span>${escapeHtml(item.year)}</span>
            <div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.body)}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

async function renderHome() {
  const about = await loadJson("data/about.json");
  root.innerHTML = `
    ${renderHero(about)}
    ${renderNavTiles(about)}
    ${renderPrinciples(about.principles)}
  `;
}

async function renderAbout() {
  const about = await loadJson("data/about.json");
  root.innerHTML = `
    <section class="page-intro reveal">
      <span class="eyebrow">${escapeHtml(about.hero.eyebrow)}</span>
      <h1>${escapeHtml(about.brand.name)}</h1>
      <p>${escapeHtml(about.brand.description)}</p>
    </section>
    ${renderPrinciples(about.principles)}
    ${renderTimeline(about.timeline)}
  `;
}

async function renderDeveloper() {
  const data = await loadJson("data/developer.json");
  root.innerHTML = `
    <section class="developer-layout">
      <article class="profile-card reveal">
        <div class="avatar">${escapeHtml(data.profile.avatarText)}</div>
        <span class="eyebrow">${escapeHtml(data.profile.role)}</span>
        <h1>${escapeHtml(data.profile.name)}</h1>
        <p>${escapeHtml(data.profile.bio)}</p>
        <small>${escapeHtml(data.profile.location)}</small>
      </article>
      <div class="developer-stack">
        <article class="soft-card reveal">
          <h2>Skills</h2>
          <div class="chip-grid">
            ${data.skills.map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join("")}
          </div>
        </article>
        <article class="soft-card reveal">
          <h2>Links</h2>
          <div class="link-list">
            ${data.links.map((link) => `
              <a href="${escapeHtml(link.href)}" target="${link.href.startsWith("http") ? "_blank" : "_self"}" rel="noreferrer">
                <span>${escapeHtml(link.label)}</span>
                <small>${escapeHtml(link.type)}</small>
              </a>
            `).join("")}
          </div>
        </article>
      </div>
    </section>
    <section class="highlight-grid">
      ${data.highlights.map((item) => `
        <article class="soft-card reveal">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
        </article>
      `).join("")}
    </section>
  `;
}

async function renderApps() {
  const data = await loadJson("data/apps.json");
  root.innerHTML = `
    <section class="page-intro reveal">
      <span class="eyebrow">${escapeHtml(data.intro.eyebrow)}</span>
      <h1>${escapeHtml(data.intro.title)}</h1>
      <p>${escapeHtml(data.intro.body)}</p>
    </section>
    <section class="apps-grid" aria-label="JN Corporations apps">
      ${data.apps.map((app, index) => `
        <article class="app-card reveal">
          <div class="app-icon">${iconFor(index)}</div>
          <span class="tag">${escapeHtml(app.category)}</span>
          <h2>${escapeHtml(app.name)}</h2>
          <p>${escapeHtml(app.description)}</p>
          <a class="button compact" href="${escapeHtml(app.href)}">Open</a>
        </article>
      `).join("")}
    </section>
  `;
  root.querySelectorAll(".app-card").forEach((card, index) => {
  const app = data.apps[index];

  card.addEventListener("click", () => {
    const url = fixUrl(app.href);

    if (app.external) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  });
});
}

function revealOnScroll() {
  const targets = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach((target) => observer.observe(target));
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function enableSoftNavigation() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

    event.preventDefault();
    document.body.classList.add("page-leaving");
    window.setTimeout(() => {
      window.location.href = url.href;
    }, 160);
  });
}

async function init() {
  setShell();
  const renderers = { home: renderHome, about: renderAbout, developer: renderDeveloper, apps: renderApps };
  try {
    await (renderers[page] || renderHome)();
    revealOnScroll();
    enableSoftNavigation();
    registerServiceWorker();
  } catch (error) {
    root.innerHTML = `
      <section class="page-intro error-state">
        <h1>Content is resting offline.</h1>
        <p>Refresh once the local files are available and JN Corporations will load again.</p>
      </section>
    `;
  }
}

init();
function fixUrl(url) {
  if (!url) return "#";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return "https://" + url;
}
card.addEventListener("click", () => {
  const url = fixUrl(app.href);

  if (app.external === true) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = url;
  }
});