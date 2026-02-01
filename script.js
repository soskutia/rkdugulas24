(function () {
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $ = (sel, root = document) => root.querySelector(sel);

  // Smooth scroll for elements with data-scroll
  function scrollToTarget(selector) {
    const el = $(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $$("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = btn.getAttribute("data-scroll");
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });

  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Toast
  const toast = $("#toast");
  const toastClose = $(".toast-close", toast || document);
  let toastTimer = null;

  function showToast() {
    if (!toast) return;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 5000);
  }
  function hideToast() {
    if (!toast) return;
    toast.classList.remove("show");
    clearTimeout(toastTimer);
  }
  if (toastClose) toastClose.addEventListener("click", hideToast);

  // Form submit dummy
  const form = $("#callbackForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.elements["name"]?.value?.trim();
      const phone = form.elements["phone"]?.value?.trim();

      // Minimal validation
      if (!name || !phone) {
        // Lightweight inline feedback (native)
        form.reportValidity();
        return;
      }

      // Show success
      showToast();
      form.reset();
    });
  }
})();

// ---- Minimal lightbox for proof images ----
(function () {
  const lightboxTargets = Array.from(document.querySelectorAll(".js-lightbox"));
  if (!lightboxTargets.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lb-overlay";
  overlay.innerHTML = `
    <div class="lb-backdrop" aria-hidden="true"></div>
    <figure class="lb-figure" role="dialog" aria-modal="true" aria-label="Kép nagyban">
      <button class="lb-close" type="button" aria-label="Bezárás">✕</button>
      <img class="lb-img" alt="" />
    </figure>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector(".lb-img");
  const closeBtn = overlay.querySelector(".lb-close");

  function open(src, alt) {
    img.src = src;
    img.alt = alt || "Kép";
    overlay.classList.add("lb-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove("lb-open");
    img.src = "";
    document.body.style.overflow = "";
  }

  lightboxTargets.forEach((el) => {
    el.addEventListener("click", () => {
      const full = el.getAttribute("data-full");
      const imageEl = el.querySelector("img");
      if (!full || !imageEl) return;
      open(full, imageEl.alt);
    });
  });

  overlay.addEventListener("click", (e) => {
    if (e.target.classList.contains("lb-backdrop")) close();
  });

  closeBtn.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

