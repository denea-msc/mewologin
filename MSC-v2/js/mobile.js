// Mobile layouts are created and fully restored when crossing the breakpoint.
(() => {
  const media = matchMedia('(max-width: 768px)');
  let cleanup = () => {};
  function setup() {
    cleanup();
    if (!media.matches) return;
    const controller = new AbortController();
    const { signal } = controller;
    const undo = [];
    const styles = new Map();
    const remember = element => {
      if (!styles.has(element)) styles.set(element, element.getAttribute('style'));
      return element;
    };
    const wrap = (nodes, className) => {
      const wrapper = document.createElement('div');
      wrapper.className = className;
      nodes[0].before(wrapper);
      wrapper.append(...nodes);
      undo.push(() => wrapper.replaceWith(...nodes));
      return wrapper;
    };

    const nav = document.getElementById('navbar');
    const toggle = nav.querySelector('.mobile-toggle');
    const menu = remember(nav.querySelector('.nav-menu'));
    menu.inert = true;
    undo.push(() => { menu.inert = false; nav.classList.remove('mobile-nav-scrolled'); });
    function closeMenu() {
      menu.inert = true;
      nav.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('menu-open');
      menu.inert = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    }, { signal });
    menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); }, { signal });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('menu-open')) { closeMenu(); toggle.focus(); }
    }, { signal });
    document.addEventListener('pointerdown', event => { if (!nav.contains(event.target)) closeMenu(); }, { signal });
    undo.push(closeMenu);

    const hero = document.querySelector('.connecting-lines');
    const heroFrame = wrap([hero], 'mobile-hero-frame');
    const heroArt = wrap([heroFrame, document.querySelector('.hero-screenshot')], 'mobile-hero-art');
    const heroScroll = wrap([heroArt], 'mobile-hero-scroll');
    const heroCards = [...hero.querySelectorAll('.panel-card')].map(remember);
    const heroShot = remember(document.querySelector('.hero-screenshot'));
    heroScroll.append(heroShot);
    undo.push(() => heroArt.append(heroShot));
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    remember(hero);
    const p4 = document.querySelector('.p4-inner');
    const p4Frame = wrap([p4], 'mobile-p4-frame');
    remember(p4);
    const demo = document.getElementById('demoComposition');
    remember(demo);
    const demoInner = document.getElementById('demoInner');
    const phone = demo.querySelector('.demo-phone');
    const phoneParent = phone.parentNode;
    demoInner.append(phone);
    undo.push(() => phoneParent.append(phone));
    const kioskRow = document.querySelector('.kiosk-swipe-row');
    const kioskParts = [...kioskRow.children];
    for (let i = 0; i < kioskParts.length; i += 2) {
      wrap(kioskParts.slice(i, i + 2), 'mobile-kiosk-step');
    }
    const slide = document.getElementById('slide-section');
    const slideItems = [...slide.querySelectorAll('.slide-item')];
    const slideItemsBox = remember(slide.querySelector('.slide-items'));
    const stack = document.createElement('div');
    stack.className = 'mobile-slide-stack';
    const slideLayers = screenshotSRC.map((src, index) => {
      const layer = document.createElement('div');
      layer.className = 'mobile-slide-layer';
      layer.style.zIndex = screenshotSRC.length - index;
      const image = new Image();
      image.src = src;
      image.alt = ['Online registration', 'Ride scheduling', 'Meal delivery', 'Event scheduling'][index];
      layer.append(image);
      stack.append(layer);
      return layer;
    });
    slide.querySelector('.slide-screenshot').append(stack);
    undo.push(() => {
      stack.remove();
      slideItems.forEach(item => {
        item.removeAttribute('data-mobile-active');
        item.removeAttribute('data-mobile-past');
      });
    });
    const mobilePaths = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mobilePaths.setAttribute('viewBox', '0 0 1460 700');
    mobilePaths.setAttribute('aria-hidden', 'true');
    mobilePaths.classList.add('mobile-demo-paths');
    const mobileConnectors = Array.from({ length: 3 }, (_, i) => {
      const base = document.createElementNS(mobilePaths.namespaceURI, 'path');
      const pulse = document.createElementNS(mobilePaths.namespaceURI, 'path');
      pulse.classList.add('mobile-demo-flow');
      pulse.style.animationDelay = `${i * -0.9}s`;
      mobilePaths.append(base, pulse);
      return [base, pulse];
    });
    document.getElementById('demoInner').prepend(mobilePaths);
    undo.push(() => mobilePaths.remove());

    const featureSection = document.getElementById('features-section');
    const featureHeader = featureSection.querySelector('.section-header');
    const featureGrid = featureSection.querySelector('.features-grid');
    const featurePin = wrap([featureHeader, featureGrid], 'mobile-scroll-pin');
    const featureRows = [...featureGrid.querySelectorAll('.feat-row')];
    featureRows.forEach(row => { wrap([row], 'mobile-track-viewport'); remember(row); });

    const testimonialSection = document.getElementById('testimonials-section');
    const mosaic = testimonialSection.querySelector('.logo-mosaic-wrap');
    remember(mosaic);
    const testimonialHeader = testimonialSection.querySelector('.testimonials-header');
    const testimonialGrid = testimonialSection.querySelector('.testimonial-grid');
    const testimonialColumns = [...testimonialGrid.children];
    const cards = [...testimonialGrid.querySelectorAll('.test-card')];
    const parents = cards.map(card => card.parentNode);
    const testimonialPin = wrap([mosaic, testimonialHeader, testimonialGrid], 'mobile-scroll-pin');
    const testimonialViewport = wrap([testimonialGrid], 'mobile-track-viewport');
    testimonialGrid.replaceChildren(...cards);
    // Restore the original nodes and columns, not clones, on desktop.
    undo.push(() => {
      testimonialGrid.replaceChildren(...testimonialColumns);
      cards.forEach((card, i) => parents[i].append(card));
    });
    remember(testimonialGrid);
    [featureSection, testimonialSection].forEach(section => {
      remember(section).classList.add('mobile-scroll-section');
      undo.push(() => section.classList.remove('mobile-scroll-section'));
    });
    let heroReveal = 0;
    let heroRevealStarted = false;
    let heroAnimationFrame = 0;
    undo.push(() => cancelAnimationFrame(heroAnimationFrame));
    let featureShift = 0;
    let testimonialShift = 0;
    let featureExcess = 0;
    let lastSlide = -1;
    const story = remember(document.getElementById('ourstory-section'));

    function measure() {
      menu.style.setProperty('--mobile-menu-height', `${menu.querySelector('.nav-links').scrollHeight + menu.querySelector('.nav-buttons').offsetHeight + 48}px`);
      heroArt.style.setProperty('--hero-card-scale', Math.min(.94875, innerWidth * 0.34 * 1.15 * 1.1 / 260));
      const heroTop = scrollY + heroScroll.getBoundingClientRect().top;
      heroArt.style.setProperty('--mobile-hero-height', `${Math.max(180, innerHeight - heroTop - 12)}px`);
      heroScroll.style.height = `${heroArt.offsetHeight + innerHeight * .3125}px`;
      const p4Scale = Math.min(1, p4Frame.clientWidth / 600);
      p4.style.transform = `scale(${p4Scale})`;
      const width = demo.clientWidth;
      const chat = demo.querySelector('.demo-chat-card');
      const topHeight = Math.max(phone.offsetHeight, chat.offsetHeight + 80);
      const heartTop = topHeight - 95;
      const heartX = width * .28;
      const screenshotTop = Math.max(phone.offsetHeight, heartTop + 70) + 22.5;
      demo.style.setProperty('--mobile-heart-left', `${heartX - 35}px`);
      demo.style.setProperty('--mobile-heart-top', `${heartTop}px`);
      demo.style.setProperty('--mobile-screenshot-top', `${screenshotTop}px`);
      const demoHeight = screenshotTop + demo.querySelector('.demo-right-col').offsetHeight;
      demo.style.height = `${demoHeight}px`;
      mobilePaths.setAttribute('viewBox', `0 0 ${width} ${demoHeight}`);
      const chatCenter = width * .02 + chat.offsetWidth / 2;
      const chatBottom = chat.offsetHeight;
      const phoneCenter = width * 1.04 - phone.offsetWidth / 2;
      const routes = [
        `M${chatCenter} ${chatBottom} V${heartTop} H${heartX}`,
        `M${heartX} ${heartTop + 70} V${screenshotTop}`,
        `M${heartX + 35} ${heartTop + 35} H${phoneCenter} V${phone.offsetHeight}`
      ];
      mobileConnectors.forEach((pair, i) => pair.forEach(path => path.setAttribute('d', routes[i])));
      slideItemsBox.style.height = '0px';
      slideItemsBox.style.height = `${Math.max(...slideItems.map(item => item.scrollHeight))}px`;
      mosaic.style.setProperty('--mobile-mosaic-scale', innerWidth / 605);
      featureShift = Math.max(0, featureRows[0].scrollWidth - (innerWidth - 48));
      testimonialShift = Math.max(0, testimonialGrid.scrollWidth - testimonialViewport.clientWidth + 48);
      featureExcess = Math.max(0, featurePin.offsetHeight - (innerHeight - 64));
      featureSection.style.height = `${featurePin.offsetHeight + 64 + featureShift + 240}px`;
      testimonialSection.style.height = `${testimonialPin.offsetHeight + 64 + testimonialShift + 240}px`;
      const trailingSpace = testimonialPin.getBoundingClientRect().bottom - cards.at(-1).getBoundingClientRect().bottom;
      story.style.setProperty('--mobile-story-gap', `${Math.max(0, 200 - trailingSpace - 40)}px`);
      update();
    }
    const progress = (section, top = 64, pinHeight = innerHeight - 64) => {
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - pinHeight;
      return Math.max(0, Math.min(1, (top - rect.top) / Math.max(1, range)));
    };
    // Scrolling starts this once; elapsed time controls every subsequent frame.
    function startHeroReveal() {
      heroRevealStarted = true;
      if (reducedMotion) {
        heroReveal = 1;
        renderHero(heroReveal);
        return;
      }
      const start = performance.now();
      const tick = now => {
        if (signal.aborted) return;
        heroReveal = Math.min(1, (now - start) / 1200);
        renderHero(heroReveal);
        if (heroReveal < 1) heroAnimationFrame = requestAnimationFrame(tick);
      };
      heroAnimationFrame = requestAnimationFrame(tick);
    }
    function renderHero(reveal) {
      const scale = Math.min(.94875, innerWidth * .34 * 1.15 * 1.1 / 260);
      heroCards.forEach((card, i) => {
        const direction = i < 2 ? -1 : 1;
        const rotation = [-12, -6, 3, 8, 14][i];
        card.style.left = `${10 + i * 20}%`;
        card.style.right = 'auto';
        card.style.top = 'auto';
        card.style.bottom = `${12 + [3, 0, 7, 1, 4][i]}%`;
        card.style.transform = `translateX(calc(-50% + ${reducedMotion ? 0 : direction * reveal * innerWidth * .5}px)) translateY(${-reveal * (reducedMotion ? 0 : 65)}px) rotate(${rotation + (reducedMotion ? 0 : direction * reveal * 24)}deg) scale(${scale})`;
        card.style.opacity = String(Math.max(0, 1 - reveal * 1.35));
        card.style.pointerEvents = reveal > .7 ? 'none' : 'auto';
      });
      const imageProgress = Math.min(1, reveal * 1.6);
      heroShot.style.opacity = String(imageProgress * imageProgress * (3 - 2 * imageProgress));
      const imageLift = reducedMotion ? 0 : 50 * reveal * reveal * (3 - 2 * reveal);
      heroShot.style.transform = `translateY(${-imageLift}px) scale(${reducedMotion ? 1 : .94 + .06 * reveal})`;

    }
    function update() {
      nav.classList.toggle('mobile-nav-scrolled', scrollY > 8);
      const heroStart = Math.max(0, scrollY + heroScroll.getBoundingClientRect().top + heroArt.offsetHeight - innerHeight + innerHeight * .2);
      if (!heroRevealStarted && scrollY > heroStart) startHeroReveal();
      renderHero(heroReveal);

      const slideTop = parseFloat(getComputedStyle(slide.querySelector('.slide-sticky')).top);
      const p = progress(slide, slideTop, innerHeight - slideTop);
      const index = Math.min(slideItems.length - 1, Math.floor(p * slideItems.length));
      if (lastSlide !== index) {
        slideItems.forEach((item, i) => {
          item.dataset.mobileActive = String(i === index);
          item.dataset.mobilePast = String(i < index);
        });
        slideLayers.forEach((layer, i) => {
          layer.dataset.past = String(i < index);
          layer.setAttribute('aria-hidden', String(i !== index));
          layer.style.setProperty('--stack-depth', Math.max(0, i - index));
        });
        lastSlide = index;
      }
      const f = progress(featureSection, 64, featurePin.offsetHeight);
      featurePin.style.transform = `translateY(${-featureExcess * f}px)`;
      // Actual track motion: first row right-to-left, second left-to-right.
      featureRows[0].style.transform = `translateX(${-featureShift * f}px)`;
      featureRows[1].style.transform = `translateX(${-featureShift * (1 - f)}px)`;
      const t = progress(testimonialSection, 64, testimonialPin.offsetHeight);
      testimonialGrid.style.transform = `translateX(${-testimonialShift * t}px)`;
    }
    let queued = false;
    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; if (!signal.aborted) update(); });
    }, { passive: true, signal });
    window.addEventListener('resize', measure, { passive: true, signal });
    document.fonts.ready.then(() => { if (!signal.aborted) measure(); });
    measure();
    cleanup = () => {
      controller.abort();
      undo.reverse().forEach(action => action());
      styles.forEach((value, element) => value === null ? element.removeAttribute('style') : element.setAttribute('style', value));
      cleanup = () => {};
    };
  }
  media.addEventListener('change', setup);
  if (document.readyState === 'complete') setup();
  else window.addEventListener('load', setup, { once: true });
})();
