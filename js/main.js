/* ============================================================
   Dr. Felipe Benthien — Interações 2.0
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (typeof Lenis !== "undefined" && !reduce) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    window.lenis = lenis;
  }

  /* ---------- Nav scroll state ---------- */
  const nav = $(".nav");
  const onScroll = () => { if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24); };
  window.addEventListener("scroll", onScroll, { passive: true });
  if (lenis) lenis.on("scroll", onScroll);
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", () => document.body.classList.toggle("menu-open"));
    $$(".nav__drawer a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Grifo glitch (destaque "bugado") ---------- */
  const grifos = $$("[data-grifo]");
  // popula data-text (texto sem os caps) para os pseudo-elementos do glitch
  grifos.forEach((g) => { if (!g.getAttribute("data-text")) g.setAttribute("data-text", (g.textContent || "").trim()); });
  const fireGlitch = (g) => {
    g.classList.remove("is-glitch"); void g.offsetWidth; g.classList.add("is-glitch");
  };
  if ("IntersectionObserver" in window && grifos.length && !reduce) {
    const gio = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        fireGlitch(e.target);
        // re-dispara ocasionalmente pra dar o feeling "bugado"
        const iv = setInterval(() => {
          if (Math.random() > 0.5 && document.visibilityState === "visible") fireGlitch(e.target);
        }, 4200 + Math.random() * 2600);
        e.target._glitchIv = iv;
        obs.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    grifos.forEach((g) => gio.observe(g));
  }

  /* ---------- Palavra rotativa no hero ---------- */
  const rotate = $("[data-rotate]");
  if (rotate) {
    const words = ["o sono", "a apneia", "o ronco", "o descanso"];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      rotate.style.opacity = "0";
      rotate.style.transform = "translateY(6px)";
      rotate.style.transition = "opacity .3s, transform .3s";
      setTimeout(() => {
        rotate.textContent = words[i];
        rotate.style.opacity = "1";
        rotate.style.transform = "none";
      }, 300);
    }, 2600);
  }

  /* ---------- Counter animation ---------- */
  $$("[data-count]").forEach((el) => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / 1400, 1), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step); obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    io.observe(el);
  });

  /* ---------- FAQ + Diferenciais accordion ---------- */
  const accordion = (sel) => $$(sel).forEach((item) => {
    const q = $(".faq-item__q, .dif-q", item), a = $(".faq-item__a, .dif-a", item);
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      const siblings = $$(sel);
      siblings.forEach((o) => { o.classList.remove("is-open"); const oa = $(".faq-item__a, .dif-a", o); if (oa) oa.style.maxHeight = null; });
      if (!open) { item.classList.add("is-open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });
  accordion(".faq-item");
  accordion(".dif-item");
  // Abre o primeiro diferencial por padrão
  const firstDif = $(".dif-item.is-open .dif-a");
  if (firstDif) firstDif.style.maxHeight = firstDif.scrollHeight + "px";

  /* ---------- Story slideshow ---------- */
  const story = $("[data-story]");
  if (story) {
    const slides = $$(".story__slide", story), dots = $$(".story__dots span", story);
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove("is-active"); if (dots[idx]) dots[idx].classList.remove("is-active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("is-active"); if (dots[idx]) dots[idx].classList.add("is-active");
    }, 3200);
  }

  /* ---------- Exames por intenção (tabs por clique/hover) ---------- */
  const intentNav = $("[data-intent-nav]");
  if (intentNav) {
    const tabs = $$("[data-intent-tab]");
    const panels = $$("[data-intent-panel]");
    const setActive = (k) => {
      tabs.forEach((t, i) => t.classList.toggle("is-active", i === k));
      panels.forEach((p, i) => p.classList.toggle("is-active", i === k));
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => setActive(i));
      t.addEventListener("mouseenter", () => { if (window.innerWidth > 860) setActive(i); });
    });
  }

  /* ---------- Chat objeções (reveal sequencial com typing) ---------- */
  const chat = $("[data-chat]");
  if (chat) {
    const msgs = $$("[data-msg]", chat);
    let played = false;
    const play = () => {
      if (played) return; played = true;
      let delay = 0;
      msgs.forEach((m) => {
        const typing = m.hasAttribute("data-typing");
        const typingEl = $(".msg-typing", m), bubble = $(".msg-bubble-dra", m);
        if (typing && typingEl && bubble) {
          bubble.style.display = "none";
          setTimeout(() => { m.classList.add("is-in"); }, delay);
          setTimeout(() => { typingEl.style.display = "none"; bubble.style.display = ""; }, delay + 900);
          delay += 1500;
        } else {
          setTimeout(() => m.classList.add("is-in"), delay);
          delay += 700;
        }
      });
    };
    if ("IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) play(); }), { threshold: 0.25 });
      io.observe(chat);
    } else {
      msgs.forEach((m) => { m.classList.add("is-in"); const t = $(".msg-typing", m); if (t) t.style.display = "none"; });
    }
  }

  /* ---------- Progressive blur (bottom) ---------- */
  const pbottom = $(".pblur-bottom");
  if (pbottom) {
    const upd = () => {
      const rest = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      pbottom.style.opacity = String(Math.min(Math.max(rest / 260, 0), 1));
    };
    window.addEventListener("scroll", upd, { passive: true });
    if (lenis) lenis.on("scroll", upd);
    window.addEventListener("resize", upd); window.addEventListener("load", upd); upd();
  }

  /* ---------- Modals ---------- */
  const openModal = (id) => { const m = document.getElementById(id); if (!m) return; m.classList.add("is-open"); document.body.style.overflow = "hidden"; if (lenis) lenis.stop(); };
  const closeModal = (m) => { m.classList.remove("is-open"); document.body.style.overflow = ""; if (lenis) lenis.start(); };
  $$("[data-modal]").forEach((btn) => btn.addEventListener("click", (e) => { e.preventDefault(); openModal(btn.dataset.modal); }));
  $$(".modal").forEach((m) => {
    $(".modal__overlay", m)?.addEventListener("click", () => closeModal(m));
    $(".modal__close", m)?.addEventListener("click", () => closeModal(m));
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".modal.is-open").forEach(closeModal); });

  /* ---------- Quiz ---------- */
  const quiz = $("#quizModal") || $("[data-quiz-inline]");
  if (quiz) {
    const steps = $$(".quiz__step", quiz), bar = $(".quiz__progress-bar", quiz);
    let current = 0, score = 0;
    const total = steps.length - 1;
    const show = (i) => { steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i)); if (bar) bar.style.width = ((i / total) * 100) + "%"; };
    $$(".quiz-ans", quiz).forEach((ans) => ans.addEventListener("click", () => {
      const step = ans.closest(".quiz__step");
      $$(".quiz-ans", step).forEach((a) => a.classList.remove("is-picked"));
      ans.classList.add("is-picked");
      score += parseInt(ans.dataset.value || "0", 10);
      setTimeout(() => {
        current++;
        if (current < steps.length - 1) show(current);
        else { renderResult(); show(steps.length - 1); }
      }, 260);
    }));
    const renderResult = () => {
      const scoreEl = $(".result-score", quiz), titleEl = $(".result-title", quiz), descEl = $(".result-desc", quiz);
      if (bar) bar.style.width = "100%";
      const max = total * 3, pct = Math.round((score / max) * 100);
      if (scoreEl) scoreEl.textContent = pct + "%";
      let title, desc;
      if (score <= 3) { title = "Risco baixo"; desc = "Seus sinais indicam risco baixo para distúrbios do sono. Mesmo assim, uma avaliação preventiva com o Dr. Felipe garante que seu sono continue reparador."; }
      else if (score <= 7) { title = "Risco moderado"; desc = "Você apresenta sinais que merecem atenção. Recomendamos uma consulta e, possivelmente, uma polissonografia para investigar a qualidade do seu sono."; }
      else { title = "Risco elevado"; desc = "Seus sintomas sugerem forte possibilidade de apneia do sono. É importante agendar uma polissonografia e uma consulta com o Dr. Felipe o quanto antes."; }
      if (titleEl) titleEl.textContent = title; if (descEl) descEl.textContent = desc;
    };
    const restart = $(".quiz__restart", quiz);
    if (restart) restart.addEventListener("click", () => { current = 0; score = 0; $$(".quiz-ans", quiz).forEach((a) => a.classList.remove("is-picked")); show(0); });
  }

  /* ---------- Exit intent lead popup ---------- */
  const exitPopup = document.getElementById("leadModal");
  if (exitPopup && !sessionStorage.getItem("fb_lead_seen")) {
    let armed = false;
    setTimeout(() => (armed = true), 6000);
    document.addEventListener("mouseout", (e) => {
      if (!armed) return;
      if (e.clientY <= 0 && !e.relatedTarget) { openModal("leadModal"); sessionStorage.setItem("fb_lead_seen", "1"); armed = false; }
    });
  }

  /* ---------- Smooth anchors ---------- */
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href"); if (id.length < 2) return;
    const target = document.querySelector(id); if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 72;
    if (lenis) lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: "smooth" });
    document.body.classList.remove("menu-open");
  }));

  /* ---------- Year ---------- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
})();
