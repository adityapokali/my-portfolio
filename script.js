const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const themeButton = document.querySelector(".theme-toggle");

function setTheme(theme, save = false) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#090d18" : "#f4f7fc");

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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(
  ".section-heading, .about-content, .about-card, .skills-intro, .skill-list, .section-topline, .project-card, .contact > .eyebrow, .contact > h2, .contact > .contact-email, .contact > .contact-bottom"
);

if (!reducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("has-scroll-animations");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealTargets.forEach((target, index) => {
    target.classList.add("scroll-reveal");
    target.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    revealObserver.observe(target);
  });
}

const cursorMascot = document.querySelector(".cursor-mascot");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (cursorMascot && finePointer && !reducedMotion) {
  document.documentElement.classList.add("has-cursor-mascot");
  let x = -80;
  let y = -80;
  let targetX = x;
  let targetY = y;
  let mascotFrame = 0;

  function floatMascot() {
    x += (targetX - x) * .16;
    y += (targetY - y) * .16;
    cursorMascot.style.setProperty("--mascot-x", `${x}px`);
    cursorMascot.style.setProperty("--mascot-y", `${y}px`);
    mascotFrame = requestAnimationFrame(floatMascot);
  }

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorMascot.classList.add("is-visible");
    if (!mascotFrame) mascotFrame = requestAnimationFrame(floatMascot);
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    cursorMascot.classList.remove("is-visible", "is-excited");
    cancelAnimationFrame(mascotFrame);
    mascotFrame = 0;
  });

  document.addEventListener("pointerover", (event) => {
    if (event.target instanceof Element && event.target.closest("a, button")) {
      cursorMascot.classList.add("is-excited");
    }
  });

  document.addEventListener("pointerout", (event) => {
    const leftControl = event.target instanceof Element && event.target.closest("a, button");
    const enteredControl = event.relatedTarget instanceof Element && event.relatedTarget.closest("a, button");
    if (leftControl && !enteredControl) cursorMascot.classList.remove("is-excited");
  });
}
