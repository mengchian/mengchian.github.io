const REPO_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1H4.5a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"></path></svg>`;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function loadData() {
  // 加上 cache: "no-store",避免瀏覽器把 JSON 快取住,改了內容卻看不到更新
  const [profileRes, projectsRes] = await Promise.all([
    fetch("data/profile.json", { cache: "no-store" }),
    fetch("data/projects.json", { cache: "no-store" }),
  ]);
  const profile = await profileRes.json();
  const projects = await projectsRes.json();
  return { profile, projects };
}

function renderHero(profile) {
  document.getElementById("hero-name").textContent = profile.name;
  document.getElementById("hero-title-en").textContent = profile.titleEn || "";
  document.getElementById("hero-tagline").textContent = profile.tagline || "";

  const meta = document.getElementById("hero-meta");
  const items = [];
  if (profile.location) items.push(`<span>📍 ${escapeHtml(profile.location)}</span>`);
  if (profile.email) items.push(`<span><a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></span>`);
  if (profile.github) items.push(`<span><a href="${escapeHtml(profile.github)}" target="_blank" rel="noopener">GitHub</a></span>`);
  if (profile.linkedin) items.push(`<span><a href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></span>`);
  meta.innerHTML = items.join("");

  document.title = `${profile.name} · ${profile.title || ""}`;
}

function typeWhoami(profile, onDone) {
  const target = document.getElementById("whoami-output");
  const text = `${profile.name} — ${profile.title || ""}`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    target.textContent = text;
    onDone();
    return;
  }

  let i = 0;
  target.textContent = "";
  const interval = setInterval(() => {
    target.textContent = text.slice(0, i + 1);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      onDone();
    }
  }, 35);
}

function renderAbout(profile) {
  document.getElementById("about-content").textContent = profile.about || "";
}

function renderSkills(profile) {
  const wrap = document.getElementById("skills-list");
  wrap.innerHTML = (profile.skills || [])
    .map((s) => `<span class="skill-pill">${escapeHtml(s)}</span>`)
    .join("");
}

function renderExperience(profile) {
  const wrap = document.getElementById("gitlog");
  wrap.innerHTML = (profile.experience || [])
    .map(
      (e) => `
      <div class="commit">
        <div class="commit-meta">
          <span class="hash">#${escapeHtml(e.hash || "0000000")}</span>
          <span>${escapeHtml(e.date || "")}</span>
        </div>
        <p class="commit-title">${escapeHtml(e.title || "")}</p>
        <p class="commit-company">${escapeHtml(e.company || "")}</p>
        <p class="commit-desc">${escapeHtml(e.description || "")}</p>
      </div>`
    )
    .join("");
}

function renderProjects(projects) {
  const wrap = document.getElementById("projects-grid");
  wrap.innerHTML = projects
    .map((p) => {
      const tags = (p.tags || [])
        .map((t) => `<span class="repo-tag">${escapeHtml(t)}</span>`)
        .join("");
      const lang = p.language
        ? `<div class="repo-lang"><span class="lang-dot" style="background:${escapeHtml(p.languageColor || "#8B949E")}"></span>${escapeHtml(p.language)}</div>`
        : "";
      const badge = p.featured ? `<span class="featured-badge">★ 精選</span>` : "";
      const image = p.image
        ? `<img class="repo-thumb" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" />`
        : "";
      const inner = `
        ${image}
        <div class="repo-name">${REPO_ICON}${escapeHtml(p.name)} ${badge}</div>
        <p class="repo-desc">${escapeHtml(p.description || "")}</p>
        <div class="repo-tags">${tags}</div>
        ${lang}
      `;
      return p.link
        ? `<a class="repo-card" href="${escapeHtml(p.link)}" target="_blank" rel="noopener">${inner}</a>`
        : `<div class="repo-card">${inner}</div>`;
    })
    .join("");
}

function renderCertificates(profile) {
  const section = document.getElementById("certificates");
  const list = profile.certificates || [];
  if (!list.length) {
    section.style.display = "none";
    return;
  }
  const wrap = document.getElementById("certificates-grid");
  wrap.innerHTML = list
    .map(
      (c) => `
      <figure class="cert-card">
        <img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.name || "")}" loading="lazy" />
        <figcaption>
          <p class="cert-name">${escapeHtml(c.name || "")}</p>
          ${c.issuer ? `<p class="cert-issuer">${escapeHtml(c.issuer)}</p>` : ""}
        </figcaption>
      </figure>`
    )
    .join("");
}

function renderContact(profile) {
  const list = document.getElementById("contact-list");
  const items = [];
  if (profile.email) items.push(`<li>📧 <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></li>`);
  if (profile.github) items.push(`<li>🐙 <a href="${escapeHtml(profile.github)}" target="_blank" rel="noopener">${escapeHtml(profile.github)}</a></li>`);
  if (profile.linkedin) items.push(`<li>💼 <a href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noopener">${escapeHtml(profile.linkedin)}</a></li>`);
  list.innerHTML = items.join("");
}

(async function init() {
  try {
    const { profile, projects } = await loadData();
    renderHero(profile);
    renderAbout(profile);
    renderSkills(profile);
    renderExperience(profile);
    renderProjects(projects);
    renderCertificates(profile);
    renderContact(profile);
    typeWhoami(profile, () => {
      document.getElementById("terminal-output").classList.add("show");
    });
  } catch (err) {
    console.error("載入資料失敗", err);
    document.body.innerHTML =
      '<p style="color:#fff;font-family:monospace;padding:40px;">資料載入失敗,請確認 data/profile.json 與 data/projects.json 是否存在且格式正確。</p>';
  }
})();
