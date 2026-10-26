// Keep placeholder resource links from reaching the global anchor handler.
document.querySelectorAll('[data-footer-placeholder]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
  });
});

// Keep copy separate from the mail link so copying never launches an email app.
(() => {
  const button = document.querySelector('.footer-copy-email');
  const tooltip = document.getElementById('footer-copy-tip');
  if (!button || !tooltip) return;
  const reset = () => { tooltip.textContent = 'Copy'; };
  button.addEventListener('pointerleave', reset);
  button.addEventListener('blur', reset);
  button.addEventListener('click', async () => {
    const email = document.querySelector('.footer-email-link').getAttribute('href').slice(7);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const field = document.createElement('textarea');
        field.value = email;
        field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.append(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        button.focus({ preventScroll: true });
        if (!copied) throw new Error('Clipboard unavailable');
      }
      tooltip.textContent = 'Copied to Clipboard ✅';
    } catch {
      tooltip.textContent = 'Unable to copy';
    }
  });
})();
