(function () {
  "use strict";

  function initBackToTop() {
    var button = document.getElementById("back-to-top");
    if (!button) return;

    var ticking = false;
    var threshold = 360;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function getScrollTop() {
      return Math.max(
        window.scrollY || 0,
        document.documentElement ? document.documentElement.scrollTop : 0,
        document.body ? document.body.scrollTop : 0
      );
    }

    function updateVisibility() {
      var visible = getScrollTop() > threshold;
      button.classList.toggle("is-visible", visible);
      button.setAttribute("aria-hidden", String(!visible));
      button.tabIndex = visible ? 0 : -1;
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateVisibility);
    }

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
      if (document.activeElement === button) button.blur();
    });

    // Tautan footer menggunakan perilaku gulir yang sama dengan tombol mengambang.
    document.addEventListener("click", function (event) {
      var footerLink = event.target.closest && event.target.closest(".site-footer__back-top");
      if (!footerLink) return;
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateVisibility();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackToTop, { once: true });
  } else {
    initBackToTop();
  }
})();
