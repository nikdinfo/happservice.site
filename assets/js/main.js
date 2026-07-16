// Happ Guide — интерактивность (итерация 2).
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Тема: light / dark, с учётом системных настроек ---------- */
  var STORAGE_KEY = "happ-theme";
  var themeToggle = document.querySelector(".theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  var savedTheme = localStorage.getItem(STORAGE_KEY);
  var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  /* ---------- Бургер-меню ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".main-nav");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) closeNav();
    });
  }

  /* ---------- Фильтр каталога по типу устройства ---------- */
  var filterBar = document.querySelector("[data-catalog-filter]");
  if (filterBar) {
    var buttons = filterBar.querySelectorAll("button[data-filter]");
    var cards = document.querySelectorAll("[data-device-type]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        var filter = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var show = filter === "all" || card.getAttribute("data-device-type") === filter;
          card.hidden = !show;
        });
      });
    });
  }

  /* ---------- Копирование ссылок / ключей ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = "Скопировано";
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
        }, 1500);
      });
    });
  });

  /* ---------- Header: лёгкая тень при прокрутке ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 4 ? "var(--shadow-sm)" : "none";
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Квиз подбора тарифа ---------- */
  document.querySelectorAll("[data-plan-quiz]").forEach(function (quiz) {
    var buttons = quiz.querySelectorAll("button[data-recommend]");
    var resultEl = quiz.querySelector("[data-quiz-result]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");

        var targetId = btn.getAttribute("data-recommend");
        var targetCard = document.getElementById(targetId);

        document.querySelectorAll(".plan-card").forEach(function (card) {
          card.classList.remove("is-recommended");
        });

        if (targetCard) {
          targetCard.classList.add("is-recommended");
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (resultEl) {
          resultEl.innerHTML = btn.getAttribute("data-result") || "";
        }
      });
    });
  });

  /* ---------- Только один FAQ-элемент открыт в секции одновременно ---------- */
  document.querySelectorAll(".section").forEach(function (section) {
    var items = section.querySelectorAll(".faq-item");
    if (items.length < 2) return;
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  });
})();
