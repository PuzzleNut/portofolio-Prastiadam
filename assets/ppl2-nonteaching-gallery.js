/* Galeri Kegiatan Nonmengajar (PPL 2 / E-Portfolio 1).
   - Filter foto per kelompok kegiatan.
   - Foto dapat dibuka dengan keyboard (Enter / Spasi); pembesaran memakai lightbox bawaan. */
(function () {
  "use strict";
  var root = document.getElementById("ppl2-content-nonteaching");
  if (!root || root.__ntGalleryReady) return;
  root.__ntGalleryReady = true;

  var chips = Array.prototype.slice.call(root.querySelectorAll(".ppl2-nt-chip"));
  var items = Array.prototype.slice.call(root.querySelectorAll(".ppl2-nt-grid .foto-item"));
  var summary = root.querySelector(".ppl2-nt-summary");

  function apply(chip) {
    var group = chip.getAttribute("data-group");
    items.forEach(function (item) {
      item.hidden = group !== "all" && item.getAttribute("data-group") !== group;
    });
    chips.forEach(function (c) {
      c.setAttribute("aria-pressed", c === chip ? "true" : "false");
    });
    if (summary) summary.textContent = chip.getAttribute("data-summary") || "";
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () { apply(chip); });
  });

  items.forEach(function (item) {
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      item.click();
    });
  });
})();
