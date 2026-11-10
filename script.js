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
   7. Scroll-reveal animations (+ skill bars, circles, GPA)
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
  const fillSkillBars = (scope) => {
    $$(".skill-bar", scope).forEach((bar) => {
      const level = parseInt(bar.dataset.level, 10) || 0;
      $(".fill", bar).style.width = `${level}%`;
      animateNumber($(".pct", bar), 0, level, 1400, (v) => `${Math.round(v)}%`);
    });
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
  /* Spam protection (runs in the visitor's browser):
     - hidden "_gotcha" honeypot field (Formspree drops bot submissions)
     - too-fast check: real people need more than 3 seconds to fill the form
     - cooldown: one message per browser every 5 minutes
     - per-email limit: each email address can send at most 2 messages (per browser)
     - fake email check: format, blocked test/disposable domains, and a live
       DNS lookup that the domain can actually receive email (MX record)
     - message must be a real message (length, not just links)
     Note: limits are stored in the visitor's browser, so they stop bots and
     repeat-sending, but a determined person could clear them. Formspree's own
     spam filter is the second line of defence. */
  const form = $("#contact-form");
  const status = $("#form-status");
  const submitBtn = $("#form-submit");

  // 👉 Adjust these limits if you want
  const MIN_FILL_SECONDS = 3;
  const COOLDOWN_MINUTES = 5;
  const MAX_PER_EMAIL = 2;
  const BLOCKED_DOMAINS = [
    "example.com", "example.org", "example.net", "test.com", "test.test", "email.com", "domain.com",
    "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com",
    "tempmail.com", "temp-mail.org", "temp-mail.io", "yopmail.com", "throwawaymail.com", "trashmail.com",
    "getnada.com", "maildrop.cc", "dispostable.com", "fakeinbox.com", "mintemail.com", "mohmal.com",
    "emailondeck.com", "spamgourmet.com", "tempail.com", "burnermail.io", "moakt.com", "tmail.ws"
  ];

  const pageLoadedAt = Date.now();
  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ } },
  };

  const showStatus = (msg, type) => {
    status.className = "form-status" + (type ? " " + type : "");
    status.textContent = msg;
  };

  // Ask a public DNS service whether the email domain can receive mail.
  // Returns true / false, or null if the check couldn't run (then we allow it).
  async function domainAcceptsEmail(domain) {
    const services = [
      { url: `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, headers: { Accept: "application/dns-json" } },
      { url: `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, headers: {} },
    ];
    for (const svc of services) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 3000);
        const res = await fetch(svc.url, { headers: svc.headers, signal: ctrl.signal });
        clearTimeout(timer);
        if (!res.ok) continue;
        const data = await res.json();
        if (data.Status === 3) return false;                                 // domain doesn't exist
        if (data.Status !== 0) continue;
        return Array.isArray(data.Answer) && data.Answer.some((a) => a.type === 15);
      } catch (e) { /* blocked or offline – try the next service */ }
    }
    return null;
  }

  async function validate(name, email, message) {
    if (form.querySelector('[name="_gotcha"]').value) return "Message blocked.";
    if ((Date.now() - pageLoadedAt) / 1000 < MIN_FILL_SECONDS) return "That was quick! Please take a moment and try again.";

    const last = store.get("contact_last_sent", 0);
    const waitMin = Math.ceil((last + COOLDOWN_MINUTES * 60000 - Date.now()) / 60000);
    if (waitMin > 0) return `Please wait ${waitMin} minute${waitMin > 1 ? "s" : ""} before sending another message.`;

    if (name.length < 2 || /https?:\/\/|www\./i.test(name)) return "Please enter your real name.";

    const emailOk = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(email) && !email.includes("..");
    if (!emailOk) return "Please enter a valid email address.";

    const counts = store.get("contact_email_counts", {});
    if ((counts[email] || 0) >= MAX_PER_EMAIL) return "You've already sent the maximum number of messages from this email. I'll get back to you soon!";

    const domain = email.split("@")[1];
    if (BLOCKED_DOMAINS.includes(domain)) return "Please use your real email address (temporary or test emails aren't accepted).";

    if (message.length < 15) return "Please write a slightly longer message.";
    const links = (message.match(/https?:\/\/|www\./gi) || []).length;
    if (links > 2) return "Please include no more than 2 links in your message.";

    showStatus("Checking your email address…");
    if ((await domainAcceptsEmail(domain)) === false) return `The email domain "${domain}" can't receive email. Please check for typos.`;

    return null;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim().toLowerCase();
    const message = form.elements.message.value.trim();

    submitBtn.disabled = true;
    const problem = await validate(name, email, message);
    if (problem) {
      showStatus(problem, "error");
      submitBtn.disabled = false;
      return;
    }

    showStatus("Sending…");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Request failed");

      const counts = store.get("contact_email_counts", {});
      counts[email] = (counts[email] || 0) + 1;
      store.set("contact_email_counts", counts);
      store.set("contact_last_sent", Date.now());

      form.reset();
      showStatus("Thank you! Your message has been sent.", "success");
    } catch (err) {
      showStatus("Oops! Something went wrong. Please try again or email me directly.", "error");
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
