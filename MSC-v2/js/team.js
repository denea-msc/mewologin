(() => {
  const config = window.MSC_TEAM;
  const canvas = document.getElementById('mscTeamComposite');
  const stage = document.getElementById('mscTeamStage');
  const panel = document.getElementById('mscTeamPanel');
  if (!config || !canvas || !stage || !panel) return;

  stage.style.maxWidth = `${config.width + 85}px`;
  canvas.style.width = `${config.width / (config.width + 85) * 100}%`;
  canvas.style.aspectRatio = `${config.width} / ${config.height}`;
  const name = panel.querySelector('.msc-team-name');
  const description = panel.querySelector('.msc-team-description');
  const location = panel.querySelector('.msc-team-location');
  const locationText = location.querySelector('span');
  let active = null;
  let inputMode = 'keyboard';

  const members = config.members.map((data, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'msc-team-member';
    button.dataset.member = data.id;
    button.dataset.flip = String(Boolean(data.flip));
    button.setAttribute('aria-label', data.name);
    button.setAttribute('aria-expanded', 'false');
    button.style.cssText = `left:${data.x / config.width * 100}%;top:${data.y / config.height * 100}%;width:${data.width / config.width * 100}%;height:${data.height / config.height * 100}%;z-index:${data.layer ?? index};`;
    const normal = new Image();
    normal.className = 'msc-team-default';
    normal.alt = '';
    normal.draggable = false;
    normal.src = data.image;
    const hover = new Image();
    hover.className = 'msc-team-hover';
    hover.alt = '';
    hover.draggable = false;
    hover.src = data.hoverImage || data.image;
    button.append(normal, hover);
    canvas.append(button);
    const member = { data, button, normal, hover, index, mask: null };
    const cachedMask = window.MSC_TEAM_MASKS?.[data.image];
    if (cachedMask) {
      member.mask = {
        width: cachedMask.width, height: cachedMask.height,
        bits: Uint8Array.from(atob(cachedMask.bits), char => char.charCodeAt(0))
      };
    }

    // Build a small alpha mask once; no decoding or pixel reads on pointermove.
    normal.decode().then(() => {
      if (member.mask) return;
      const buffer = document.createElement('canvas');
      buffer.width = 160;
      buffer.height = Math.max(1, Math.round(160 * normal.naturalHeight / normal.naturalWidth));
      const ctx = buffer.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(normal, 0, 0, buffer.width, buffer.height);
      try {
        member.mask = {
          pixels: ctx.getImageData(0, 0, buffer.width, buffer.height).data,
          width: buffer.width, height: buffer.height
        };
      } catch {
        // Some browsers restrict file:// pixel reads; keep an inset fallback.
      }
    }).catch(() => {});
    button.addEventListener('focus', () => show(member));
    button.addEventListener('blur', () => {
      if (active === member && inputMode === 'keyboard') hide();
    });
    button.addEventListener('click', () => show(member));
    return member;
  });

  const frontToBack = [...members].sort((a, b) =>
    (b.data.layer ?? b.index) - (a.data.layer ?? a.index) || b.index - a.index);

  function alignPortraits() {
    const scale = canvas.getBoundingClientRect().width / config.width;
    const snap = value => `${Math.round(value * scale * devicePixelRatio) / devicePixelRatio}px`;
    members.forEach(({ data, button }) => {
      button.style.left = snap(data.x);
      button.style.top = snap(data.y);
      button.style.width = snap(data.width);
      button.style.height = snap(data.height);
    });
    positionPanel();
  }
  alignPortraits();
  new ResizeObserver(alignPortraits).observe(canvas);

  function pick(clientX, clientY) {
    return frontToBack.find(member => {
      const rect = member.button.getBoundingClientRect();
      let x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return false;
      if (member.data.flip) x = rect.width - x;
      if (!member.mask) return x > rect.width * 0.15 && x < rect.width * 0.85 && y > rect.height * 0.08;
      const scale = Math.max(rect.width / member.normal.naturalWidth, rect.height / member.normal.naturalHeight);
      const cropX = (member.normal.naturalWidth * scale - rect.width) / 2;
      const cropY = (member.normal.naturalHeight * scale - rect.height) / 2;
      const mx = Math.min(member.mask.width - 1, Math.max(0, Math.floor((x + cropX) / scale / member.normal.naturalWidth * member.mask.width)));
      const my = Math.min(member.mask.height - 1, Math.max(0, Math.floor((y + cropY) / scale / member.normal.naturalHeight * member.mask.height)));
      const index = my * member.mask.width + mx;
      return member.mask.bits
        ? Boolean(member.mask.bits[index >> 3] & (1 << (index & 7)))
        : member.mask.pixels[index * 4 + 3] > 24;
    });
  }

  function positionPanel() {
    if (!active) return;
    const rect = canvas.getBoundingClientRect();
    const scale = rect.width / config.width;
    const anchor = active.data.panel || { x: active.data.x + active.data.width * 0.9, y: active.data.y - 27 };
    const left = rect.left + anchor.x * scale;
    let top = rect.top + anchor.y * scale;
    // On phones, leave the portraits visible so another member is easy to tap.
    if (innerWidth < 768) {
      const above = rect.top - panel.offsetHeight - 16;
      const below = rect.bottom + 16;
      if (above >= 16) top = above;
      else if (below + panel.offsetHeight <= innerHeight - 16) top = below;
    }
    panel.style.left = `${Math.max(16, Math.min(left, innerWidth - panel.offsetWidth - 16))}px`;
    panel.style.top = `${Math.max(16, Math.min(top, innerHeight - panel.offsetHeight - 16))}px`;
  }

  function show(member) {
    if (!member) { hide(); return; }
    if (active === member) return;
    hide();
    active = member;
    name.textContent = member.data.name;
    description.textContent = member.data.description || '';
    description.hidden = !member.data.description;
    locationText.textContent = member.data.location || '';
    location.hidden = !member.data.location;
    panel.setAttribute('aria-hidden', 'false');
    member.button.setAttribute('aria-describedby', panel.id);
    member.button.setAttribute('aria-expanded', 'true');
    const activateImage = () => {
      if (active === member) {
        member.button.classList.add('is-active');
        canvas.classList.add('has-active');
      }
    };
    if (member.hover.complete && member.hover.naturalWidth) activateImage();
    else member.hover.decode().then(activateImage).catch(() => {});
    positionPanel();
    void panel.offsetWidth;
    panel.classList.add('visible');
  }

  function hide() {
    if (active) {
      active.button.classList.remove('is-active');
      active.button.removeAttribute('aria-describedby');
      active.button.setAttribute('aria-expanded', 'false');
    }
    active = null;
    canvas.classList.remove('has-active');
    panel.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'true');
  }

  canvas.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const member = pick(event.clientX, event.clientY);
    canvas.style.cursor = member ? 'pointer' : '';
    show(member);
  });
  canvas.addEventListener('pointerleave', event => {
    if (event.pointerType === 'touch') return;
    if (!active?.button.matches(':focus-visible')) hide();
  });
  canvas.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch') return;
    const member = pick(event.clientX, event.clientY);
    if (active === member) hide();
    else show(member);
  });
  document.addEventListener('pointerdown', event => {
    inputMode = 'pointer';
    if (!canvas.contains(event.target)) hide();
  });
  document.addEventListener('keydown', event => {
    inputMode = 'keyboard';
    if (event.key === 'Escape') hide();
    if ((event.key === 'Enter' || event.key === ' ') && members.some(m => m.button === event.target)) {
      event.preventDefault();
      show(members.find(m => m.button === event.target));
    }
  });
  window.addEventListener('resize', positionPanel, { passive: true });
  window.addEventListener('scroll', () => {
    if (!active) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) hide();
    else positionPanel();
  }, { passive: true });
})();
