/* =========================================================
   Mohammed Yousuf Al-Hasani – Portfolio
   script.js (vanilla JavaScript, no dependencies)
   ---------------------------------------------------------
   1. Setup & helpers
   2. Page loader
   3. Theme toggle (dark / light)
   4. Mobile menu
   5. Sticky header, active link, back-to-top, parallax
   6. Typing animation
   7. Scroll-reveal animations (+ language circles, GPA)
   8. Ripple effect
   9. Contact form (Formspree)
   10. Profile photo fallback
   ========================================================= */

(function () {
  "use strict";

  /* ===================== 1. SETUP ===================== */
  document.documentElement.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ===================== 2. PAGE LOADER ===================== */
  const loader = $("#loader");
  const hideLoader = () => {
    loader.classList.add("hidden");
    document.body.classList.add("loaded");
    startTyping();
  };
  let loaderDone = false;
  const finishLoader = () => { if (!loaderDone) { loaderDone = true; hideLoader(); } };
  // Let the "MH" draw animation play (~1.6s), but never block longer than 3s.
  window.addEventListener("load", () => setTimeout(finishLoader, reduceMotion ? 0 : 1600));
  setTimeout(finishLoader, 3000);

  /* ===================== 3. THEME TOGGLE ===================== */
  // The site always opens in dark mode (set by data-theme="dark" on <html>).
  // The toggle switches theme for the current visit only and is not remembered.
  const root = document.documentElement;
  try { localStorage.removeItem("theme"); } catch (e) { /* clear choice saved by older versions */ }
  $("#theme-toggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
  });

  /* ===================== 4. MOBILE MENU ===================== */
  const hamburger = $("#hamburger");
  const navMenu = $("#nav-menu");
  const setMenu = (open) => {
    hamburger.classList.toggle("open", open);
    navMenu.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("no-scroll", open);
  };
  hamburger.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
  $$(".nav-link").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ===================== 5. SCROLL EFFECTS ===================== */
  const header = $("#header");
  const backToTop = $("#back-to-top");
  const heroBg = $("#hero-bg");
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-link");
  const desktop = window.matchMedia("(min-width: 1025px)");

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 50);
    backToTop.classList.toggle("show", y > 500);

    // Subtle parallax on the hero background (desktop only)
    if (!reduceMotion && desktop.matches && y < window.innerHeight * 1.2) {
      heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
    } else if (!desktop.matches) {
      heroBg.style.transform = "";
    }

    // Highlight the nav link of the section currently in view
    const mark = y + window.innerHeight * 0.35;
    let current = "";
    sections.forEach((s) => { if (s.offsetTop <= mark) current = s.id; });
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${current}`));
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ===================== 6. TYPING ANIMATION ===================== */
  // 👉 Edit this list to change the rotating titles in the hero.
  const phrases = ["Full-Stack Developer", "SCADA & PLC Engineer", "Industrial Automation Enthusiast"];
  const typedEl = $("#typed-text");
  let typingStarted = false;

  function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    if (reduceMotion) { typedEl.textContent = phrases[0]; return; }

    let phraseIdx = 0, charIdx = 0, deleting = false;
    const tick = () => {
      const word = phrases[phraseIdx];
      typedEl.textContent = word.slice(0, charIdx);
      let delay = deleting ? 45 : 90;

      if (!deleting && charIdx === word.length) { delay = 1800; deleting = true; }
      else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 400; }
      else { charIdx += deleting ? -1 : 1; }

      setTimeout(tick, delay);
    };
    setTimeout(tick, 900);
  }

  /* ===================== 7. SCROLL-REVEAL ===================== */
  // Skill level meters fill via CSS (.in-view); only the language circles need JS.
  const fillSkillBars = (scope) => {
    $$(".circle", scope).forEach((c) => {
      const level = parseInt(c.dataset.level, 10) || 0;
      const circumference = 2 * Math.PI * 52; // r = 52
      $(".progress", c).style.strokeDashoffset = circumference * (1 - level / 100);
    });
  };

  function animateNumber(el, from, to, duration, format) {
    if (!el) return;
    if (reduceMotion) { el.textContent = format(to); return; }
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = format(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const revealEls = $$("[data-anim]");
  const reveal = (el) => {
    el.classList.add("in-view");
    // After the entrance animation ends, switch to normal hover transitions
    const delay = parseFloat(getComputedStyle(el).getPropertyValue("--delay")) || 0;
    setTimeout(() => el.classList.add("anim-done"), 900 + delay * 1000);

    if (el.classList.contains("skill-card")) fillSkillBars(el);
    if (el.classList.contains("edu-card")) {
      const gpa = $("#gpa-counter");
      animateNumber(gpa, 0, parseFloat(gpa.dataset.target), 2000, (v) => v.toFixed(2));
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { reveal(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach(reveal);
  }

  /* ===================== 8. RIPPLE EFFECT ===================== */
  $$(".ripple").forEach((btn) => {
    btn.addEventListener("pointerdown", (e) => {
      if (reduceMotion) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const wave = document.createElement("span");
      wave.className = "ripple-wave";
      wave.style.width = wave.style.height = `${size}px`;
      wave.style.left = `${e.clientX - rect.left - size / 2}px`;
      wave.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(wave);
      wave.addEventListener("animationend", () => wave.remove());
    });
  });

  /* ===================== 9. CONTACT FORM (Formspree) ===================== */
  const form = $("#contact-form");
  const status = $("#form-status");
  const submitBtn = $("#form-submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";

    if (form.action.includes("[MY_FORMSPREE_ID]") || form.action.includes("%5BMY_FORMSPREE_ID%5D")) {
      status.textContent = "The contact form isn't set up yet – please email me at seaomn27@gmail.com.";
      status.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    status.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        status.textContent = "Thank you! Your message has been sent.";
        status.classList.add("success");
      } else {
        throw new Error("Request failed");
      }
    } catch (err) {
      status.textContent = "Oops! Something went wrong. Please try again or email me directly.";
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* ===================== 10. PROFILE PHOTO FALLBACK ===================== */
  const profileImg = $("#profile-img");
  const hidePhoto = () => { profileImg.style.display = "none"; };
  if (profileImg.complete && profileImg.naturalWidth === 0) hidePhoto();
  profileImg.addEventListener("error", hidePhoto);
})();
