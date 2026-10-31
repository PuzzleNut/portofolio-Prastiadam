/* Defer heavy external innovation previews until a visitor explicitly opens them. */
(() => {
  'use strict';
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-load-seminar-preview]');
    if (!button) return;
    const wrapper = button.closest('.seminar-preview-lazy');
    if (!wrapper || wrapper.dataset.loaded === 'true') return;

    const source = wrapper.dataset.previewSrc;
    if (!source) return;

    wrapper.dataset.loaded = 'true';
    wrapper.classList.add('is-loading');
    const frame = document.createElement('iframe');
    frame.className = 'seminar-innovation-iframe';
    frame.loading = 'eager';
    frame.title = wrapper.dataset.previewTitle || 'Pratinjau media pembelajaran';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'fullscreen; clipboard-read; clipboard-write';
    frame.allowFullscreen = true;
    frame.src = source;
    frame.addEventListener('load', () => wrapper.classList.remove('is-loading'), { once: true });
    wrapper.replaceChildren(frame);
  });
})();
