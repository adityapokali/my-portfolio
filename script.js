const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const themeButton = document.querySelector(".theme-toggle");

function setTheme(theme, save = false) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#111713" : "#f5f4f0");

  if (themeButton) {
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
    themeButton.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
    themeButton.querySelector(".theme-label").textContent = isDark ? "Light" : "Dark";
  }

  if (save) {
    try { localStorage.setItem("portfolio-theme", isDark ? "dark" : "light"); } catch {}
  }
}

setTheme(document.documentElement.dataset.theme);
themeButton?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme, true);
});

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}
