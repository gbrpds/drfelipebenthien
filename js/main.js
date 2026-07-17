/* ============================================================
   Dr. Felipe Benthien — Interações
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* ---------- Nav: scroll state ---------- */
  const nav = $(".nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
    $$(".nav__drawer a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open"))
    );
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Counter animation ---------- */
  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          const dur = 1400;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1);
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach((item) => {
    const q = $(".faq-item__q", item);
    const a = $(".faq-item__a", item);
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      $$(".faq-item").forEach((other) => {
        other.classList.remove("is-open");
        const oa = $(".faq-item__a", other);
        if (oa) oa.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("is-open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Modals ---------- */
  const openModal = (id) => {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  const closeModal = (m) => {
    m.classList.remove("is-open");
    document.body.style.overflow = "";
  };
  $$("[data-modal]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(btn.dataset.modal);
    })
  );
  $$(".modal").forEach((m) => {
    $(".modal__overlay", m)?.addEventListener("click", () => closeModal(m));
    $(".modal__close", m)?.addEventListener("click", () => closeModal(m));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $$(".modal.is-open").forEach(closeModal);
  });

  /* ---------- Quiz do Sono ---------- */
  const quiz = $("#quizModal");
  if (quiz) {
    const steps = $$(".quiz__step", quiz);
    const bar = $(".quiz__progress-bar", quiz);
    let current = 0;
    let score = 0;
    const total = steps.length - 1; // last is result

    const show = (i) => {
      steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
      if (bar) bar.style.width = ((i / total) * 100) + "%";
    };

    $$(".quiz-ans", quiz).forEach((ans) => {
      ans.addEventListener("click", () => {
        const step = ans.closest(".quiz__step");
        $$(".quiz-ans", step).forEach((a) => a.classList.remove("is-picked"));
        ans.classList.add("is-picked");
        score += parseInt(ans.dataset.value || "0", 10);
        setTimeout(() => {
          current++;
          if (current < steps.length - 1) {
            show(current);
          } else {
            renderResult();
            show(steps.length - 1);
          }
        }, 260);
      });
    });

    const renderResult = () => {
      const scoreEl = $(".result-score", quiz);
      const titleEl = $(".result-title", quiz);
      const descEl = $(".result-desc", quiz);
      if (bar) bar.style.width = "100%";
      let title, desc;
      const max = total * 3;
      const pct = Math.round((score / max) * 100);
      if (scoreEl) scoreEl.textContent = pct + "%";
      if (score <= 3) {
        title = "Risco baixo";
        desc = "Seus sinais indicam risco baixo para distúrbios do sono. Mesmo assim, uma avaliação preventiva com o Dr. Felipe garante que seu sono continue reparador.";
      } else if (score <= 7) {
        title = "Risco moderado";
        desc = "Você apresenta sinais que merecem atenção. Recomendamos uma consulta pneumológica e, possivelmente, uma polissonografia para investigar a qualidade do seu sono.";
      } else {
        title = "Risco elevado";
        desc = "Seus sintomas sugerem forte possibilidade de apneia do sono. É importante agendar uma polissonografia e uma consulta com o Dr. Felipe o quanto antes.";
      }
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
    };

    const restart = $(".quiz__restart", quiz);
    if (restart) {
      restart.addEventListener("click", () => {
        current = 0; score = 0;
        $$(".quiz-ans", quiz).forEach((a) => a.classList.remove("is-picked"));
        show(0);
      });
    }
  }

  /* ---------- Exit intent lead popup (once per session) ---------- */
  const exitPopup = document.getElementById("leadModal");
  if (exitPopup && !sessionStorage.getItem("fb_lead_seen")) {
    let armed = false;
    setTimeout(() => (armed = true), 6000);
    document.addEventListener("mouseout", (e) => {
      if (!armed) return;
      if (e.clientY <= 0 && !e.relatedTarget) {
        openModal("leadModal");
        sessionStorage.setItem("fb_lead_seen", "1");
        armed = false;
      }
    });
  }

  /* ---------- Smooth anchor offset for fixed nav ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
      document.body.classList.remove("menu-open");
    });
  });

  /* ---------- Year in footer ---------- */
  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
