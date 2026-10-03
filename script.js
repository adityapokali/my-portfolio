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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(
  ".section-heading, .about-content, .skills-intro, .skill-list, .section-topline, .project-card, .contact > .eyebrow, .contact > h2, .contact > .contact-email, .contact > .contact-bottom"
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

const cursorFollower = document.querySelector(".cursor-follower");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (cursorFollower && finePointer && !reducedMotion) {
  document.documentElement.classList.add("has-cursor-follower");

  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    cursorFollower.style.opacity = "1";
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    cursorFollower.style.opacity = "0";
    cursorFollower.classList.remove("is-hovering");
  });

  document.addEventListener("pointerover", (event) => {
    if (event.target instanceof Element && event.target.closest("a, button")) {
      cursorFollower.classList.add("is-hovering");
    }
  });

  document.addEventListener("pointerout", (event) => {
    const leftControl = event.target instanceof Element && event.target.closest("a, button");
    const enteredControl = event.relatedTarget instanceof Element && event.relatedTarget.closest("a, button");
    if (leftControl && !enteredControl) cursorFollower.classList.remove("is-hovering");
  });
}
