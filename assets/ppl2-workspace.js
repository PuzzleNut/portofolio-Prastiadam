(function () {
  "use strict";
  var root = document.getElementById("page-semester-2");
  if (!root || root.__ppl2WorkspaceReady) return;
  root.__ppl2WorkspaceReady = true;

  var portfolioTabs = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-tab]"));
  var portfolioPanels = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-portfolio-panel]"));
  var sectionTabs = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-section]"));
  var sectionPanels = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-content]"));

  function activatePortfolio(name, focus) {
    portfolioTabs.forEach(function (tab) {
      var active = tab.getAttribute("data-ppl2-tab") === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    portfolioPanels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-ppl2-portfolio-panel") !== name;
    });
  }

  function activateSection(name, focus) {
    sectionTabs.forEach(function (tab) {
      var active = tab.getAttribute("data-ppl2-section") === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) {
        tab.focus();
        if (tab.scrollIntoView) tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    });
    sectionPanels.forEach(function (panel) {
      var active = panel.getAttribute("data-ppl2-content") === name;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    root.querySelectorAll("[data-ppl2-planning-only]").forEach(function (element) {
      element.hidden = name !== "planning";
    });
    root.querySelectorAll("[data-ppl2-material-only]").forEach(function (element) {
      element.hidden = name !== "material";
    });
    root.querySelectorAll("[data-ppl2-media-only]").forEach(function (element) {
      element.hidden = name !== "media";
    });
    root.querySelectorAll("[data-ppl2-video-only]").forEach(function (element) {
      element.hidden = name !== "video";
    });
    root.querySelectorAll("[data-ppl2-nonteaching-only]").forEach(function (element) {
      element.hidden = name !== "nonteaching";
    });
    root.querySelectorAll("[data-ppl2-assessment-only]").forEach(function (element) {
      element.hidden = name !== "assessment";
    });
    var planningWorkspace = root.querySelector(".ppl2-workspace--planning");
    if (planningWorkspace) planningWorkspace.classList.toggle("is-other-section", !["planning", "material", "media", "video", "nonteaching", "assessment"].includes(name));
  }

  portfolioTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activatePortfolio(tab.getAttribute("data-ppl2-tab"), false);
    });
    tab.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      var next = (index + (event.key === "ArrowRight" ? 1 : -1) + portfolioTabs.length) % portfolioTabs.length;
      activatePortfolio(portfolioTabs[next].getAttribute("data-ppl2-tab"), true);
    });
  });

  sectionTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activateSection(tab.getAttribute("data-ppl2-section"), false);
    });
    tab.addEventListener("keydown", function (event) {
      if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      var next = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % sectionTabs.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + sectionTabs.length) % sectionTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = sectionTabs.length - 1;
      activateSection(sectionTabs[next].getAttribute("data-ppl2-section"), true);
    });
  });


  // PDF preview: isi atribut data-pdf-src pada .ppl2-preview-card dengan path PDF.
  // Contoh: documents/ppl2/eportfolio1/01-rancangan-pembelajaran.pdf
  document.querySelectorAll(".ppl2-preview-card[data-pdf-src]").forEach(function (card) {
    var src = (card.getAttribute("data-pdf-src") || "").trim();
    if (!src) return;
    var title = card.getAttribute("data-pdf-title") || "Dokumen PPL 2";
    var frame = document.createElement("iframe");
    frame.className = "ppl2-pdf-viewer";
    frame.src = src + (src.indexOf("#") === -1 ? "#view=FitH" : "");
    frame.title = "Pratinjau PDF: " + title;
    frame.loading = "lazy";
    frame.setAttribute("allow", "fullscreen");
    var actions = document.createElement("div");
    actions.className = "ppl2-pdf-actions";
    var link = document.createElement("a");
    link.className = "ppl2-pdf-open";
    link.href = src;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = '<i class="fas fa-external-link-alt" aria-hidden="true"></i> Buka PDF di tab baru';
    actions.appendChild(link);
    var placeholder = card.querySelector(".ppl2-empty-preview");
    if (placeholder) placeholder.insertAdjacentElement("beforebegin", frame);
    else card.appendChild(frame);
    card.appendChild(actions);
    card.classList.add("has-pdf");
  });

  document.querySelectorAll(".ppl2-video-preview[data-video-src]").forEach((card) => {
    const source = (card.getAttribute("data-video-src") || "").trim();
    if (!source) return;
    const placeholder = card.querySelector(".ppl2-video-placeholder");
    if (!placeholder) return;
    const frame = document.createElement("iframe");
    frame.className = "ppl2-video-frame";
    frame.title = card.getAttribute("data-video-title") || "Video praktik mengajar";
    frame.loading = "lazy";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    // YouTube requires an HTTP Referer for embedded playback (Error 153).
    // Set the policy before assigning src so it applies to the first request.
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    frame.src = source;
    placeholder.replaceWith(frame);
    const link = document.createElement("a");
    link.className = "ppl2-video-link";
    link.href = card.getAttribute("data-video-watch-url") || source;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = '<i class="fab fa-youtube" aria-hidden="true"></i> Buka video di YouTube';
    card.appendChild(link);
  });



  function closePpl2Dropdown(id) {
    var dropdown = document.getElementById(id);
    if (!dropdown) return;
    dropdown.classList.remove("show");
    var button = dropdown.querySelector(".dropbtn");
    if (button) button.setAttribute("aria-expanded", "false");
  }

  function markPpl2NavActive(key) {
    var nav = document.getElementById("nav-links-sem2");
    if (!nav) return;
    var portfolio1Active = key === "portfolio-1" || String(key).indexOf("section-") === 0;
    var portfolio1Link = nav.querySelector("#nav-ppl2-portfolio1");
    if (portfolio1Link) {
      portfolio1Link.classList.toggle("active", portfolio1Active);
      if (portfolio1Active) portfolio1Link.setAttribute("aria-current", "page");
      else portfolio1Link.removeAttribute("aria-current");
    }
    nav.querySelectorAll(".dropdown-content a").forEach(function (link) {
      var active = link.getAttribute("data-ppl2-nav-key") === key;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    nav.querySelectorAll(".dropdown").forEach(function (dropdown) {
      var hasActive = !!dropdown.querySelector('.dropdown-content a[aria-current="page"]');
      var button = dropdown.querySelector(".dropbtn");
      if (button) button.classList.toggle("active", hasActive);
    });
  }

  function scrollPpl2ToTop() {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  window.openPpl2Portfolio1 = function () {
    if (typeof window.showPage === "function") window.showPage("semester-2");
    activatePortfolio("portfolio-1", false);
    activateSection("planning", false);
    markPpl2NavActive("portfolio-1");
    closePpl2Dropdown("dropdown-ppl2-portfolio2");
    if (typeof window.closeMobileMenu === "function") window.closeMobileMenu();
    scrollPpl2ToTop();
  };

  window.openPpl2Section = function (name) {
    var valid = ["planning", "material", "media", "video", "nonteaching", "assessment"];
    if (valid.indexOf(name) === -1) return;
    if (typeof window.showPage === "function") window.showPage("semester-2");
    activatePortfolio("portfolio-1", false);
    activateSection(name, false);
    markPpl2NavActive("section-" + name);
    closePpl2Dropdown("dropdown-ppl2-portfolio2");
    if (typeof window.closeMobileMenu === "function") window.closeMobileMenu();
    scrollPpl2ToTop();
  };

  window.openPpl2Cycle = function (number) {
    var cycle = String(number);
    if (["2", "3", "4"].indexOf(cycle) === -1) return;
    if (typeof window.showPage === "function") window.showPage("ppl2-cycle-" + cycle);
    markPpl2NavActive("cycle-" + cycle);
    closePpl2Dropdown("dropdown-ppl2-portfolio2");
    if (typeof window.closeMobileMenu === "function") window.closeMobileMenu();
    scrollPpl2ToTop();
  };

  window.openPpl2Portfolio = function (name) {
    if (name === "portfolio-1") window.openPpl2Portfolio1();
    else if (name === "portfolio-2") window.openPpl2Cycle(2);
  };

  activatePortfolio("portfolio-1", false);
  activateSection("planning", false);

  // PPL 2 keeps its contextual navbar on the overview and on each dedicated cycle page.
  // The selected menu item follows the active component or cycle page.
  var originalShowPage = window.showPage;
  if (typeof originalShowPage === "function") {
    window.showPage = function (pageName) {
      originalShowPage(pageName);
      if (pageName === "semester-2") markPpl2NavActive("section-planning");
      else if (/^ppl2-cycle-[234]$/.test(pageName)) markPpl2NavActive("cycle-" + pageName.slice(-1));
    };
  }
  markPpl2NavActive("portfolio-1");

  // Five analysis tabs are available inside each dedicated Siklus 2, 3, and 4 page.
  document.querySelectorAll(".ppl2-cycle-page").forEach(function (page) {
    var tabs = Array.prototype.slice.call(page.querySelectorAll("[data-ppl2-cycle-section]"));
    var panels = Array.prototype.slice.call(page.querySelectorAll("[data-ppl2-cycle-panel]"));
    if (!tabs.length || !panels.length) return;

    function activateCycleSection(key, focus) {
      tabs.forEach(function (tab) {
        var active = tab.getAttribute("data-ppl2-cycle-section") === key;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
        if (active && focus) tab.focus();
      });
      panels.forEach(function (panel) {
        var active = panel.getAttribute("data-ppl2-cycle-panel") === key;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateCycleSection(tab.getAttribute("data-ppl2-cycle-section"), false);
      });
      tab.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        var next = index;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        activateCycleSection(tabs[next].getAttribute("data-ppl2-cycle-section"), true);
      });
    });

    activateCycleSection("rpp", false);
  });
})();
