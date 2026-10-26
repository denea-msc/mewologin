// ====== NAVBAR SCROLL ======
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('half-scrolled', window.scrollY > 1380);
});

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 1400);
});

// ====== SMOOTH SCROLL FOR NAV LINKS ======
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ====== WORD FILL ON SCROLL ======
const quoteWrapper = document.getElementById('quoteWrapper');
if (quoteWrapper) {
  const text = quoteWrapper.textContent;
  quoteWrapper.innerHTML = '';
  text.split(/(\s+)/).forEach(part => {
    if (/\s+/.test(part)) {
      quoteWrapper.appendChild(document.createTextNode(part));
    } else {
      const span = document.createElement('span');
      span.className = 'quote-word';
      span.textContent = part;
      quoteWrapper.appendChild(span);
    }
  });
  const words = quoteWrapper.querySelectorAll('.quote-word');
  const totalWords = words.length;

  window.addEventListener('scroll', () => {
    const rect = quoteWrapper.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress 0→1 as element scrolls from bottom of viewport to ~40% up
    const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.55)));
    const filledCount = Math.round(progress * totalWords);
    words.forEach((w, i) => w.classList.toggle('filled', i < filledCount));
  });
}

// ====== GREEN SWEEP PATH SCROLL ANIMATION (5 sequential segments + dot highlights) ======
const greenSegs = document.querySelectorAll('.green-seg');
const greenDots = document.querySelectorAll('.green-dot');
if (greenSegs.length) {
  const segs = Array.from(greenSegs).map(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    return { el: p, len };
  });
  const panelsArea = document.querySelector('.connecting-lines');
  window.addEventListener('scroll', () => {
    if (!panelsArea) return;
    const rect = panelsArea.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh;
    const end = -rect.height * 0.3;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    const n = segs.length;
    segs.forEach((s, i) => {
      const segStart = i / n;
      const segEnd = (i + 1) / n;
      const segProgress = Math.max(0, Math.min(1, (progress - segStart) / (segEnd - segStart)));
      s.el.style.strokeDashoffset = s.len * (1 - segProgress);
    });
    // Green dots: appear when their segment completes
    greenDots.forEach(dot => {
      const afterSeg = parseInt(dot.dataset.after);
      const segEnd = (afterSeg + 1) / n;
      dot.style.opacity = progress >= segEnd ? '1' : '0';
    });
  });
}

// ====== SLIDE SECTION - SCROLL LOCK (4 distinct stops) ======
const slideSection = document.querySelector('.slide-section');
const slideItems = document.querySelectorAll('.slide-item');
const slideTrackFill = document.getElementById('slideTrackFill');
const slideScreenshot = document.getElementById('slideScreenshot');
const screenshotSRC = [
  'assets/registration.png',
  'assets/rides.png',
  'assets/delivery.png',
  'assets/events.png'
]

if (slideSection) {
  let targetFillH = 0, currentFillH = 0;
  window.addEventListener('scroll', () => {
    const rect = slideSection.getBoundingClientRect();
    const sectionHeight = slideSection.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
    
    const activeIndex = Math.min(3, Math.floor(progress * 4));
    
    // Only the scrolled item is highlighted
    slideItems.forEach((item, i) => {
      item.classList.toggle('active', i <= activeIndex);
    });
    
    // Track fill with smooth delay
    const itemsContainer = document.getElementById('slideItems');
    if (itemsContainer && slideTrackFill) {
      const items = Array.from(slideItems);
      const activeItem = items[activeIndex];
      if (activeItem) {
        const icon = activeItem.querySelector('.slide-item-icon');
        if (icon && icon.offsetParent !== null) {
          const containerTop = itemsContainer.getBoundingClientRect().top;
          const iconTop = icon.getBoundingClientRect().top;
          targetFillH = Math.max(0, iconTop - containerTop + 18);
        }
      }
    }
    // Screenshot label
    if (slideScreenshot) {
      slideScreenshot.src = screenshotSRC[activeIndex] || screenshotSRC[0];
    }
  });
  // Smooth lerp for the green fill bar — creates premium delayed feel
  (function lerpFill(){
    const diff = targetFillH - currentFillH;
    // Fast when far, slow when close — adaptive lerp factor
    const factor = Math.min(0.25, Math.max(0.02, Math.abs(diff) * 0.002));
    currentFillH += diff * factor;
    if (slideTrackFill) slideTrackFill.style.height = currentFillH + 'px';
    requestAnimationFrame(lerpFill);
  })();
}

// ====== LOGO MOSAIC GRID (exact Figma: 8 rows x 30 cols, real images) ======
const mosaic = document.getElementById('logoMosaic');
if (mosaic) {
  // Grid: each cell is [path, opacity] or 0 for empty/white
  const G = [
    [0,0,["assets/logos/logo-1071.png",0.2],["assets/logos/logo-1069-4.png",1],["assets/logos/logo-1069-5.png",1],["assets/logos/logo-1069-6.png",1],["assets/logos/logo-1069-7.png",1],["assets/logos/logo-1070-1.png",1],["assets/logos/logo-1070-2.png",1],["assets/logos/logo-1070-3.png",1],0,["assets/logos/logo-1070-4.png",1],["assets/logos/logo-1070-5.png",1],["assets/logos/logo-1070-6.png",1],["assets/logos/logo-1070-7.png",1],["assets/logos/logo-1084.png",1],["assets/logos/logo-1085.png",1],["assets/logos/logo-1086.png",1],["assets/logos/logo-1087.png",1],["assets/logos/logo-1088.png",1],["assets/logos/logo-1089.png",1],["assets/logos/logo-1090.png",1],["assets/logos/logo-1091.png",1],["assets/logos/logo-1092.png",1],["assets/logos/logo-1093.png",1],["assets/logos/logo-1094.png",1],["assets/logos/logo-1095.png",0.4],0,0,0],
    [0,["assets/logos/logo-1070-1.png",1],["assets/logos/logo-1071-1.png",1],["assets/logos/logo-1071.png",1],["assets/logos/logo-1071-1.png",1],0,["assets/logos/logo-1071-2.png",1],["assets/logos/logo-1071-3.png",1],["assets/logos/logo-1083-2.png",0.8],["assets/logos/logo-1083-3.png",1],["assets/logos/logo-1083-4.png",1],["assets/logos/logo-1083-5.png",1],["assets/logos/logo-1083-6.png",1],["assets/logos/logo-1083-7.png",1],["assets/logos/logo-1084.png",1],["assets/logos/logo-1084-1.png",1],["assets/logos/logo-1085-1.png",1],["assets/logos/logo-1086-1.png",1],["assets/logos/logo-1087-1.png",1],["assets/logos/logo-1088-1.png",1],["assets/logos/logo-1089-1.png",1],0,["assets/logos/logo-1091-1.png",1],["assets/logos/logo-1092-1.png",1],["assets/logos/logo-1093-1.png",1],["assets/logos/logo-1094-1.png",1],["assets/logos/logo-1095-1.png",1],["assets/logos/logo-1096-1.png",0.2],["assets/logos/logo-1097-1.png",1],0],
    [0,0,["assets/logos/logo-1071-2.png",1],["assets/logos/logo-1084-1.png",0.5],["assets/logos/logo-1084-2.png",1],["assets/logos/logo-1084-3.png",0.3],["assets/logos/logo-1084-4.png",1],["assets/logos/logo-1084-5.png",1],["assets/logos/logo-1084-6.png",1],["assets/logos/logo-1084-7.png",1],["assets/logos/logo-1085.png",1],["assets/logos/logo-1085-1.png",1],["assets/logos/logo-1085-2.png",1],["assets/logos/logo-1085-3.png",0.76],["assets/logos/logo-1083-2.png",1],["assets/logos/logo-1084-2.png",1],["assets/logos/logo-1085-2.png",1],["assets/logos/logo-1086-2.png",1],["assets/logos/logo-1087-2.png",1],["assets/logos/logo-1088-2.png",1],["assets/logos/logo-1089-2.png",1],["assets/logos/logo-1090-2.png",1],["assets/logos/logo-1091-2.png",1],["assets/logos/logo-1092-2.png",1],["assets/logos/logo-1093-2.png",1],["assets/logos/logo-1094-2.png",1],0,["assets/logos/logo-1096-2.png",0.6],["assets/logos/logo-1097-2.png",1],["assets/logos/logo-1098-2.png",0.1]],
    [["assets/logos/logo-1085-4.png",0.1],["assets/logos/logo-1070-3.png",1],["assets/logos/logo-1071-3.png",1],0,["assets/logos/logo-1085-5.png",1],["assets/logos/logo-1085-6.png",1],["assets/logos/logo-1085-7.png",1],0,["assets/logos/logo-1086.png",1],0,["assets/logos/logo-1086-1.png",1],["assets/logos/logo-1086-2.png",1],0,["assets/logos/logo-1086-3.png",1],["assets/logos/logo-1083-3.png",1],["assets/logos/logo-1084-3.png",1],["assets/logos/logo-1085-3.png",1],0,["assets/logos/logo-1087-3.png",1],["assets/logos/logo-1088-3.png",1],["assets/logos/logo-1089-3.png",1],["assets/logos/logo-1090-3.png",1],["assets/logos/logo-1091-3.png",1],["assets/logos/logo-1092-3.png",1],["assets/logos/logo-1093-3.png",1],["assets/logos/logo-1094-3.png",1],["assets/logos/logo-1095-3.png",1],["assets/logos/logo-1096-3.png",1],["assets/logos/logo-1097-3.png",1],0],
    [0,["assets/logos/logo-1070-4.png",0.1],["assets/logos/logo-1086-4.png",1],["assets/logos/logo-1086-5.png",1],["assets/logos/logo-1086-6.png",1],0,["assets/logos/logo-1086-7.png",0.3],["assets/logos/logo-1087.png",1],0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,["assets/logos/logo-1093-4.png",1],["assets/logos/logo-1094-4.png",0.3],["assets/logos/logo-1095-4.png",1],["assets/logos/logo-1096-4.png",1],["assets/logos/logo-1097-4.png",0.6],["assets/logos/logo-1098-4.png",0.2]],
    [0,["assets/logos/logo-1070-5.png",0.6],0,["assets/logos/logo-1087-1.png",1],["assets/logos/logo-1087-2.png",1],0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,["assets/logos/logo-1090-5.png",0.43],["assets/logos/logo-1091-5.png",0.8],0,0,["assets/logos/logo-1094-5.png",0.1],0,0,0,0],
    [["assets/logos/logo-1069-6.png",0.3],0,["assets/logos/logo-1087-3.png",1],0,["assets/logos/logo-1087-4.png",0.1],0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,["assets/logos/logo-1093-6.png",0.3],["assets/logos/logo-1094-6.png",0.6],0,["assets/logos/logo-1096-6.png",1],0,0],
    [0,0,["assets/logos/logo-1087-5.png",0.2],0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,["assets/logos/logo-1095-7.png",0.2],0,["assets/logos/logo-1097-7.png",0.7],0]
  ];

  const allTiles = [];
  G.forEach((row, r) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'logo-row';
    row.forEach((cell, c) => {
      const tile = document.createElement('div');
      tile.className = 'logo-tile';
      if (cell === 0) {
        tile.classList.add('empty');
      } else {
        const [key, op] = cell;
        tile.style.setProperty('--op', op);
        tile.style.backgroundImage = `url(${key.replace(/ /g, '%20')})`;
        tile.classList.add('has-logo');
        allTiles.push({ tile, r, c });
      }
      rowEl.appendChild(tile);
    });
    mosaic.appendChild(rowEl);
  });

  // Staggered populate: tiles pop in from center outward
  let populated = false;
  const centerR = 3.5, centerC = 14.5;
  const mosaicObs = new IntersectionObserver(entries => {
    if (populated) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        populated = true;
        const sorted = allTiles.map(item => {
          const dist = Math.sqrt(Math.pow(item.r - centerR, 2) + Math.pow(item.c - centerC, 2));
          return { ...item, dist };
        }).sort((a, b) => a.dist - b.dist);
        sorted.forEach(item => {
          const baseDelay = item.dist * 44 + Math.random() * 100;
          setTimeout(() => item.tile.classList.add('pop'), baseDelay);
        });
      }
    });
  }, { threshold: 0.1 });
  mosaicObs.observe(mosaic);
}

// ====== OUR STORY - WORD FILL + HEART SVG FILL ON SCROLL ======
const ourstoryText = document.getElementById('ourstoryText');
const heartPath = document.getElementById('ourstoryHeartPath');
if (ourstoryText) {
  const rawText = ourstoryText.textContent;
  ourstoryText.innerHTML = '';
  rawText.split(/(\s+)/).forEach(part => {
    if (/^\s+$/.test(part)) {
      // Preserve line breaks
      if (part.includes('\n\n')) {
        ourstoryText.appendChild(document.createElement('br'));
        ourstoryText.appendChild(document.createElement('br'));
      } else if (part.includes('\n')) {
        ourstoryText.appendChild(document.createTextNode(' '));
      } else {
        ourstoryText.appendChild(document.createTextNode(part));
      }
    } else {
      const span = document.createElement('span');
      span.className = 'ourstory-word';
      span.textContent = part;
      ourstoryText.appendChild(span);
    }
  });
  const words = ourstoryText.querySelectorAll('.ourstory-word');
  const totalWords = words.length;

  // Heart path setup
  let heartLen = 0;
  if (heartPath) {
    heartLen = heartPath.getTotalLength();
    heartPath.style.strokeDasharray = heartLen;
    heartPath.style.strokeDashoffset = heartLen;
  }

  window.addEventListener('scroll', () => {
    const section = document.getElementById('ourstory-section');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const sectionH = section.offsetHeight;
    const vh = window.innerHeight;
    const scrolled = -rect.top;
    const scrollRange = sectionH - vh;
    if (scrollRange <= 0) return;
    const progress = Math.max(0, Math.min(1, scrolled / scrollRange));
    
    // Words take up first 75% of progress, heart takes the remaining 25%
    const wordProgress = Math.min(1, progress / 0.75);
    const heartProgress = Math.max(0, (progress - 0.75) / 0.25);
    
    const filledCount = Math.round(wordProgress * totalWords);
    words.forEach((w, i) => w.classList.toggle('filled', i < filledCount));
    
    if (heartPath && heartLen) {
      heartPath.style.strokeDashoffset = heartLen * (1 - heartProgress);
    }
  });
}

// ====== DEMO COMPOSITION RESPONSIVE SCALER ======
const demoComp = document.getElementById('demoComposition');
const demoInner = document.getElementById('demoInner');
if (demoComp && demoInner) {
  function scaleDemo() {
    const available = demoComp.offsetWidth;
    const native = 1460;
    if (available < native) {
      const s = available / native;
      demoInner.style.transform = `scale(${s})`;
      demoInner.style.height = (700 * s) + 'px';
      demoInner.style.marginLeft = '0';
    } else {
      demoInner.style.transform = 'none';
      demoInner.style.height = '700px';
      demoInner.style.marginLeft = ((available - native) / 2) + 'px';
    }
  }
  scaleDemo();
  window.addEventListener('resize', scaleDemo);
}

// ====== DEMO PULSE LINES (Figma gradient: transparent→green→transparent, 60px) ======
// ====== DEMO PULSE LINES (Chained: P1 → P2 (round-trip) → P3, repeat) ======

const pulseLengths = new WeakMap();

// Initialize all pulse paths
document.querySelectorAll('.demo-pulse').forEach(path => {
  const len = path.getTotalLength();
  pulseLengths.set(path, len);
  const dashLen = 60;
  path.style.strokeDasharray = dashLen + ' ' + (len + dashLen);
  path.style.strokeDashoffset = dashLen;
  path.style.opacity = 0;
});

// Group paths by their data-delay attribute
const pathGroups = [[], [], []];
document.querySelectorAll('.demo-pulse').forEach(path => {
  const delay = parseFloat(path.dataset.delay) || 0;
  if (delay === 0) pathGroups[0].push(path);
  else if (delay === 2.5) pathGroups[1].push(path);
  else if (delay === 2) pathGroups[2].push(path);
});

const durations = [2500, 1200, 2500];
const pauseAfterCycle = 1400;
const nearEndThreshold = 0.70;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function getOpacity(t, isGlow) {
  let o;
  if (t < 0.1) o = t / 0.1;
  else if (t > 0.85) o = (1 - t) / 0.15;
  else o = 1;
  o = o * o * (3 - 2 * o);
  return isGlow ? o * 0.25 : o;
}

function animateGroup(paths, duration, reverse, onNearEnd, onDone, variableWidth) {
  const startTime = performance.now();
  let firedNearEnd = false;

  function tick(now) {
    const elapsed = now - startTime;
    const rawT = Math.min(elapsed / duration, 1);
    const t = reverse ? 1 - rawT : rawT;
    const progress = easeInOut(t);

    paths.forEach(path => {
      const len = pulseLengths.get(path);
      const dashLen = 60;
      const isGlow = path.classList.contains('demo-pulse-glow');

      if (variableWidth && !isGlow) {
        const offset = progress * (len + dashLen) - dashLen;
        const dashStart = Math.max(offset, 0);
        const dashEnd = Math.min(offset + dashLen, len);

        if (dashEnd > dashStart) {
          const steps = 30;
          const topPoints = [];
          const bottomPoints = [];

          for (let i = 0; i <= steps; i++) {
            const frac = i / steps;
            const dist = dashStart + frac * (dashEnd - dashStart);
            const pt = path.getPointAtLength(dist);

            let halfW;
            if (frac <= 0.75) {
              halfW = (0 + (frac / 0.75) * 2.5) / 2; // 0.5px → 3px
            } else {
              halfW = (3 - ((frac - 0.75) / 0.25) * 2) / 3; // 3px → 1px
            }

            const dt = 0.5;
            const ptA = path.getPointAtLength(Math.max(dist - dt, 0));
            const ptB = path.getPointAtLength(Math.min(dist + dt, len));
            const dx = ptB.x - ptA.x;
            const dy = ptB.y - ptA.y;
            const mag = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = -dy / mag;
            const ny = dx / mag;

            topPoints.push(`${pt.x + nx * halfW},${pt.y + ny * halfW}`);
            bottomPoints.unshift(`${pt.x - nx * halfW},${pt.y - ny * halfW}`);
          }

          const polyPoints = topPoints.concat(bottomPoints).join(' ');

          let poly = path.nextElementSibling;
          if (!poly || !poly.classList.contains('demo-pulse-poly')) {
            poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            poly.classList.add('demo-pulse-poly');
            poly.setAttribute('fill', 'url(#pulseColor)');
            poly.setAttribute('filter', 'url(#lineGlow)');
            path.parentNode.insertBefore(poly, path.nextSibling);
          }
          poly.setAttribute('points', polyPoints);

          const opacityT = reverse ? 1 - rawT : rawT;
          poly.style.opacity = getOpacity(opacityT, false);
          path.style.opacity = 0;
        } else {
          path.style.opacity = 0;
          let poly = path.nextElementSibling;
          if (poly && poly.classList.contains('demo-pulse-poly')) {
            poly.style.opacity = 0;
          }
        }
      } else {
        const offset = dashLen - progress * (len + dashLen);
        path.style.strokeDashoffset = offset;

        const opacityT = reverse ? 1 - rawT : rawT;
        path.style.opacity = getOpacity(opacityT, isGlow);
      }
    });

    if (!firedNearEnd && rawT >= nearEndThreshold && onNearEnd) {
      firedNearEnd = true;
      onNearEnd();
    }

    if (rawT < 1) {
      requestAnimationFrame(tick);
    } else {
      paths.forEach(path => {
        path.style.opacity = 0;
        let poly = path.nextElementSibling;
        if (poly && poly.classList.contains('demo-pulse-poly')) {
          poly.style.opacity = 0;
        }
      });
      if (onDone) onDone();
    }
  }
  requestAnimationFrame(tick);
}

function runCycle() {
  animateGroup(pathGroups[0], durations[0], false,
    () => {
      animateGroup(pathGroups[1], durations[1], false, null,
        () => {
          animateGroup(pathGroups[1], durations[1], true,
            () => {
              animateGroup(pathGroups[2], durations[2], false, null,
                () => { setTimeout(runCycle, pauseAfterCycle); },
                true  // ← variable width for Path 3
              );
            },
            null,
            true  // ← variable width for Path 2 reverse
          );
        },
        true  // ← variable width for Path 2 forward
      );
    },
    null,
    true
  );
}

runCycle();
