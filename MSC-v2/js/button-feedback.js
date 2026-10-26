// Shared placeholder feedback for contact, demo and feature-request actions.
(() => {
  let tooltip;
  let timer;
  function hide() {
    clearTimeout(timer);
    tooltip?.remove();
    tooltip = null;
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-coming-soon]');
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    hide();
    tooltip = document.createElement('div');
    tooltip.className = 'coming-soon-tooltip';
    tooltip.setAttribute('role', 'status');
    tooltip.textContent = 'coming soon';
    document.body.append(tooltip);
    const rect = trigger.getBoundingClientRect();
    const box = tooltip.getBoundingClientRect();
    tooltip.style.left = `${Math.max(8, Math.min(innerWidth - box.width - 8, rect.left + (rect.width - box.width) / 2))}px`;
    tooltip.style.top = `${rect.top > box.height + 16 ? rect.top - box.height - 8 : rect.bottom + 8}px`;
    timer = setTimeout(hide, 2400);
  }, true);
  document.addEventListener('pointerdown', event => { if (!event.target.closest('[data-coming-soon]')) hide(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide, { passive: true });
})();
