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
  let panelLeaveTimer = 0;

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
    if (data.crop) {
      for (const image of [normal, hover]) {
        image.style.left = `${data.crop.x * 100}%`;
        image.style.top = `${data.crop.y * 100}%`;
        image.style.width = `${data.crop.width * 100}%`;
        image.style.height = `${data.crop.height * 100}%`;
        image.style.objectFit = 'fill';
      }
    }
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
      if (data.radius) button.style.borderRadius = snap(data.radius);
    });
    positionPanel();
  }
  alignPortraits();
  new ResizeObserver(alignPortraits).observe(canvas);

  function pick(clientX, clientY) {
    // Match the unchanged visual layer order while portraits move vertically.
    return frontToBack.find(member => {
      const rect = member.button.getBoundingClientRect();
      let x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return false;
      if (member.data.flip) x = rect.width - x;
      if (!member.mask) return x > rect.width * 0.15 && x < rect.width * 0.85 && y > rect.height * 0.08;
      let sourceX, sourceY;
      if (member.data.crop) {
        const crop = member.data.crop;
        sourceX = (x / rect.width - crop.x) / crop.width;
        sourceY = (y / rect.height - crop.y) / crop.height;
      } else {
        const scale = Math.max(rect.width / member.normal.naturalWidth, rect.height / member.normal.naturalHeight);
        sourceX = (x + (member.normal.naturalWidth * scale - rect.width) / 2) / (member.normal.naturalWidth * scale);
        sourceY = (y + (member.normal.naturalHeight * scale - rect.height) / 2) / (member.normal.naturalHeight * scale);
      }
      if (sourceX < 0 || sourceY < 0 || sourceX >= 1 || sourceY >= 1) return false;
      const mx = Math.min(member.mask.width - 1, Math.floor(sourceX * member.mask.width));
      const my = Math.min(member.mask.height - 1, Math.floor(sourceY * member.mask.height));
      const index = my * member.mask.width + mx;
      return member.mask.bits
        ? Boolean(member.mask.bits[index >> 3] & (1 << (index & 7)))
        : member.mask.pixels[index * 4 + 3] > 24;
    });
  }

  function positionPanel() {
    if (!active) return;
    panel.style.maxHeight = '';
    panel.classList.remove('is-scrollable');
    const collage = canvas.getBoundingClientRect();
    const button = active.button;
    // Reserve the union of the resting frame and its 5px upward hover motion.
    const width = button.offsetWidth;
    const height = button.offsetHeight;
    const target = {
      left: collage.left + button.offsetLeft,
      right: collage.left + button.offsetLeft + width,
      top: collage.top + button.offsetTop - 5,
      bottom: collage.top + button.offsetTop + height
    };
    const gap = 6;
    const edge = 16;
    const panelWidth = panel.offsetWidth;
    const panelHeight = panel.offsetHeight;
    const topLimit = Math.max(edge, Math.min(80, innerHeight - panelHeight - edge));
    const centeredLeft = (target.left + target.right - panelWidth) / 2;
    const candidates = [
      { placement: 'right', left: target.right + gap, top: target.top },
      { placement: 'left', left: target.left - panelWidth - gap, top: target.top },
      { placement: 'above', left: centeredLeft, top: target.top - panelHeight - gap },
      { placement: 'below', left: centeredLeft, top: target.bottom + gap }
    ];
    const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
      Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const head = { ...target, bottom: target.top + height * .65 };
    const positions = candidates.map((candidate, index) => {
      const left = Math.max(edge, Math.min(candidate.left, innerWidth - panelWidth - edge));
      const top = Math.max(topLimit, Math.min(candidate.top, innerHeight - panelHeight - edge));
      const bounds = { left, top, right: left + panelWidth, bottom: top + panelHeight };
      return { ...candidate, left, top,
        score: overlap(bounds, head) * 100 + overlap(bounds, target) +
          Math.abs(left - candidate.left) + Math.abs(top - candidate.top) + index * .01 };
    });
    positions.sort((a, b) => a.score - b.score);
    let position = positions[0];
    const chosenBounds = { left: position.left, top: position.top,
      right: position.left + panelWidth, bottom: position.top + panelHeight };
    if (overlap(chosenBounds, target) > 0) {
      const above = target.top - gap - topLimit;
      const below = innerHeight - target.bottom - gap * 2;
      const available = Math.max(above, below);
      if (available >= 100) {
        panel.style.maxHeight = `${Math.floor(available)}px`;
        panel.classList.add('is-scrollable');
        position = {
          left: Math.max(edge, Math.min(centeredLeft, innerWidth - panelWidth - edge)),
          top: above >= below ? target.top - gap - panel.offsetHeight : target.bottom + gap,
          placement: above >= below ? 'above-scrollable' : 'below-scrollable'
        };
      }
    }
    panel.style.left = `${position.left}px`;
    panel.style.top = `${position.top}px`;
    panel.dataset.placement = position.placement;

  }

  function show(member) {
    if (!member) { hide(); return; }
    if (active === member) return;
    hide();
    active = member;
    panel.scrollTop = 0;
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
    clearTimeout(panelLeaveTimer);
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
    if (panel.classList.contains('is-scrollable')) {
      clearTimeout(panelLeaveTimer);
      panelLeaveTimer = setTimeout(() => {
        if (!panel.matches(':hover') && !canvas.matches(':hover') && !active?.button.matches(':focus-visible')) hide();
      }, 150);
    } else if (!active?.button.matches(':focus-visible')) hide();
  });
  canvas.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch') return;
    const member = pick(event.clientX, event.clientY);
    if (active === member) hide();
    else show(member);
  });
  panel.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'touch' && !canvas.contains(event.relatedTarget) && !active?.button.matches(':focus-visible')) hide();
  });
  document.addEventListener('pointerdown', event => {
    inputMode = 'pointer';
    if (!canvas.contains(event.target) && !panel.contains(event.target)) hide();
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
