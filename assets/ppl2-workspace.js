(function () {
  "use strict";
  var root = document.getElementById("page-semester-2");
  if (!root || root.__ppl2WorkspaceReady) return;
  root.__ppl2WorkspaceReady = true;

  var portfolioTabs = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-tab]"));
  var portfolioPanels = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-portfolio-panel]"));
  var sectionTabs = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-section]"));
  var sectionPanels = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-content]"));
  var cycleTabs = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-cycle]"));
  var cyclePanels = Array.prototype.slice.call(root.querySelectorAll("[data-ppl2-cycle-panel]"));

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

  function activateCycle(number, focus) {
    cycleTabs.forEach(function (tab) {
      var active = tab.getAttribute("data-ppl2-cycle") === String(number);
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    cyclePanels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-ppl2-cycle-panel") !== String(number);
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

  cycleTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { activateCycle(tab.getAttribute("data-ppl2-cycle"), false); });
    tab.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      var next = (index + (event.key === "ArrowRight" ? 1 : -1) + cycleTabs.length) % cycleTabs.length;
      activateCycle(cycleTabs[next].getAttribute("data-ppl2-cycle"), true);
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
  root.querySelectorAll(".ppl2-preview-card[data-pdf-src]").forEach(function (card) {
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
    frame.src = source;
    frame.title = "Video pelaksanaan praktik mengajar mandiri";
    frame.loading = "lazy";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    placeholder.replaceWith(frame);
    const link = document.createElement("a");
    link.className = "ppl2-video-link";
    link.href = source;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Buka video di tab baru";
    card.appendChild(link);
  });

  activatePortfolio("portfolio-1", false);
  activateCycle("2", false);
  activateSection("planning", false);
})();
