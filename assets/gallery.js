/* Drifting filmstrip gallery + expanding lightbox for Shan's portfolio.
   Upgrades every existing <div class="gallery"> in place. No HTML changes needed.
   - Slides drift on their own, endlessly, like a tilted film reel.
   - Hover (desktop) eases it to a stop and lifts the card; drag/swipe to scrub.
   - Click any card and it grows out of its spot into a full-size viewer.
   No arrows, dots, captions or buttons on the cards themselves. */
(() => {
  const CSS = `
/* Grid items must be allowed to shrink, otherwise wide content pushes the card off-screen */
.cards { grid-template-columns: minmax(0, 1fr); }
@media (min-width: 900px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.card { min-width: 0; }

.reel { position: relative; width: 100%; margin-top: .6rem; overflow: hidden; cursor: grab; touch-action: pan-y; user-select: none; -webkit-user-select: none;
  padding: 1.5rem 0 1.7rem;
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%); }
.reel.is-drag { cursor: grabbing; }
.reel-track { display: flex; align-items: center; gap: var(--reel-gap, 18px); width: max-content; will-change: transform; }

.reel-card { flex: 0 0 auto; position: relative; padding: 0; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; background: var(--surface-2); cursor: zoom-in; display: block;
  box-shadow: 0 10px 26px rgba(31,47,61,.16), 0 2px 6px rgba(31,47,61,.08);
  transform: translateY(var(--dy, 0)) rotate(var(--rot, 0deg));
  transition: transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .45s ease; }
.reel-card img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top center; pointer-events: none; -webkit-user-drag: none; }
.reel-card:nth-child(4n+1) { --dy: -7px; --rot: -1.6deg; }
.reel-card:nth-child(4n+2) { --dy: 9px;  --rot: 1.3deg; }
.reel-card:nth-child(4n+3) { --dy: -3px; --rot: 1.8deg; }
.reel-card:nth-child(4n)   { --dy: 10px; --rot: -1.2deg; }
@media (hover: hover) {
  .reel-card:hover { transform: translateY(-12px) rotate(0deg) scale(1.07); box-shadow: 0 22px 44px rgba(31,47,61,.28); z-index: 2; }
}
.reel-card:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; transform: translateY(-8px) rotate(0deg) scale(1.04); z-index: 2; }
.reel-card.is-hidden-src { visibility: hidden; }

/* Shuffling stack (home page) */
.deck { position: relative; aspect-ratio: 2.05 / 1; width: calc(100% - 3.4rem); margin: 2rem 3.4rem 1.6rem 0; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
.deck-card { position: absolute; inset: 0; padding: 0; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; background: var(--surface-2); cursor: zoom-in; display: block;
  box-shadow: 0 12px 28px rgba(31,47,61,.18);
  transform-origin: 20% 100%;
  transition: transform .7s cubic-bezier(.3,.9,.3,1), opacity .5s ease, box-shadow .5s ease; }
.deck-card img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top center; pointer-events: none; -webkit-user-drag: none; }
.deck-card.is-fly { transition: transform .6s cubic-bezier(.5,0,.8,.4), opacity .6s ease; transform: translate(-70%, -12%) rotate(-16deg) !important; opacity: 0 !important; }
.deck-card.no-anim { transition: none !important; }
.deck-card:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; }
@media (hover: hover) { .deck:hover .deck-card[data-p="0"] { box-shadow: 0 20px 40px rgba(31,47,61,.3); } }
@media (max-width: 520px) { .deck { width: calc(100% - 2.4rem); margin-right: 2.4rem; } }
@media (prefers-reduced-motion: reduce) { .deck-card { transition: none; } }

/* Lightbox */
.lb { position: fixed; inset: 0; z-index: 100; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .5rem; padding: calc(3.5rem + env(safe-area-inset-top, 0px)) .75rem calc(1rem + env(safe-area-inset-bottom, 0px)); background: rgba(8,12,17,.9); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.lb[hidden] { display: none; }
.lb figure { margin: 0; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: .75rem; max-height: 100%; }
.lb img { max-width: 100%; max-height: calc(100dvh - 9rem); object-fit: contain; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.5); background: #fff; transform-origin: center center; }
.lb figcaption { color: #e8eff6; font-size: .9rem; text-align: center; }
.lb figcaption small { color: #a2b2c2; margin-left: .5rem; }
.lb-x, .lb-nav { border: 0; cursor: pointer; color: #fff; background: rgba(255,255,255,.14); display: grid; place-items: center; border-radius: 50%; transition: background .2s; }
.lb-x:hover, .lb-nav:hover { background: rgba(255,255,255,.28); }
.lb-x { position: absolute; top: calc(.9rem + env(safe-area-inset-top, 0px)); right: 1rem; width: 42px; height: 42px; }
.lb-nav { width: 46px; height: 46px; }
@media (max-width: 640px) { .lb { grid-template-columns: minmax(0, 1fr); } .lb-nav { position: absolute; bottom: calc(1rem + env(safe-area-inset-bottom, 0px)); } .lb-prev { left: 1rem; } .lb-next { right: 1rem; } .lb img { max-height: calc(100dvh - 12rem); } }
@media (prefers-reduced-motion: reduce) { .reel-card { transition: none; } }
`;

  const svg = (d) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    prev: svg('<path d="m15 18-6-6 6-6"/>'),
    next: svg('<path d="m9 18 6-6-6-6"/>'),
    close: svg('<path d="M18 6 6 18M6 6l12 12"/>')
  };

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 38; // px per second of idle drift
  let lightboxOpen = false;

  /* ---------- Lightbox (single shared instance) ---------- */
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = `<button type="button" class="lb-x" aria-label="Close">${I.close}</button>
    <button type="button" class="lb-nav lb-prev" aria-label="Previous image">${I.prev}</button>
    <figure><img alt=""><figcaption></figcaption></figure>
    <button type="button" class="lb-nav lb-next" aria-label="Next image">${I.next}</button>`;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('figcaption');
  const lbBtns = [...lb.querySelectorAll('button')];
  let lbItems = [], lbIdx = 0, lbOpener = null;

  function lbShow(n) {
    lbIdx = (n + lbItems.length) % lbItems.length;
    const it = lbItems[lbIdx];
    lbImg.src = it.src;
    lbImg.alt = it.alt;
    lbCap.textContent = it.alt;
    const c = document.createElement('small');
    c.textContent = `${lbIdx + 1} / ${lbItems.length}`;
    lbCap.appendChild(c);
    lb.querySelectorAll('.lb-nav').forEach((b) => (b.hidden = lbItems.length < 2));
    [1, -1].forEach((d) => { const p = lbItems[(lbIdx + d + lbItems.length) % lbItems.length]; if (p) new Image().src = p.src; });
  }

  // Grow the image out of the card the visitor clicked (FLIP)
  function growFrom(rect) {
    if (reduce || !rect || !lbImg.animate) return;
    const go = () => {
      const to = lbImg.getBoundingClientRect();
      if (!to.width) return;
      const dx = rect.left + rect.width / 2 - (to.left + to.width / 2);
      const dy = rect.top + rect.height / 2 - (to.top + to.height / 2);
      lbImg.animate(
        [{ transform: `translate(${dx}px, ${dy}px) scale(${rect.width / to.width})`, borderRadius: '14px' }, { transform: 'none', borderRadius: '12px' }],
        { duration: 480, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
    };
    if (lbImg.complete && lbImg.naturalWidth) go(); else lbImg.addEventListener('load', go, { once: true });
  }

  function lbOpen(items, start, opener) {
    lbItems = items; lbOpener = opener;
    lightboxOpen = true;
    const rect = opener.getBoundingClientRect();
    lb.hidden = false;
    lbShow(start);
    if (lb.animate && !reduce) lb.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
    growFrom(rect);
    lb.querySelector('.lb-x').focus({ preventScroll: true });
  }
  function lbClose() {
    if (lb.hidden) return;
    const done = () => {
      lb.hidden = true;
      lightboxOpen = false;
      document.dispatchEvent(new Event('reel-resume'));
      if (lbOpener && lbOpener.isConnected) lbOpener.focus({ preventScroll: true });
    };
    if (reduce || !lb.animate) return done();
    lbImg.animate([{ transform: 'none' }, { transform: 'scale(.92)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
    lb.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in' }).onfinish = done;
  }
  lb.querySelector('.lb-prev').onclick = () => lbShow(lbIdx - 1);
  lb.querySelector('.lb-next').onclick = () => lbShow(lbIdx + 1);
  lb.querySelector('.lb-x').onclick = lbClose;
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.tagName === 'FIGURE') lbClose(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
    else if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
    else if (e.key === 'Tab') {
      const vis = lbBtns.filter((b) => !b.hidden);
      const i = vis.indexOf(document.activeElement);
      e.preventDefault();
      vis[(i + (e.shiftKey ? -1 : 1) + vis.length) % vis.length].focus();
    }
  });
  let lbX = null;
  lb.addEventListener('touchstart', (e) => { lbX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (lbX == null) return;
    const dx = e.changedTouches[0].clientX - lbX; lbX = null;
    if (Math.abs(dx) > 50) lbShow(lbIdx + (dx < 0 ? 1 : -1));
  });


  /* ---------- Shuffling stack: top card flicks away, the rest move up ---------- */
  function buildStack(g) {
    const imgs = [...g.querySelectorAll('img')];
    if (imgs.length < 2) return;
    const items = imgs.map((i) => ({ src: i.currentSrc || i.getAttribute('src'), alt: i.alt || 'Screenshot' }));
    const n = items.length;

    const root = document.createElement('div');
    root.className = 'deck';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', (g.getAttribute('aria-label') || 'Screenshots') + '. Click an image to enlarge');

    let top = 0, hover = false, focus = false, visible = false, timer = null, busy = false, moved = false;
    const cards = imgs.map((img, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'deck-card';
      b.dataset.i = i;
      img.removeAttribute('width'); img.removeAttribute('height');
      img.draggable = false;
      b.appendChild(img);
      b.addEventListener('click', () => { if (moved) return; lbOpen(items, i, b); });
      root.appendChild(b);
      return b;
    });

    function place() {
      cards.forEach((c, i) => {
        const p = (i - top + n) % n, q = Math.min(p, 3);
        c.dataset.p = p;
        c.style.zIndex = n - p;
        c.style.opacity = p > 3 ? 0 : 1;
        c.style.transform = `translate(${q * 16}px, ${q * -11}px) rotate(${q * 1.7}deg) scale(${1 - q * 0.045})`;
        c.tabIndex = p === 0 ? 0 : -1;
        c.setAttribute('aria-hidden', p === 0 ? 'false' : 'true');
        c.setAttribute('aria-label', p === 0 ? `${i + 1} of ${n}: ${items[i].alt}. Click to enlarge` : '');
      });
    }

    function next() {
      if (busy) return;
      busy = true;
      const c = cards[top];
      if (reduce) { top = (top + 1) % n; place(); busy = false; return; }
      c.classList.add('is-fly');
      top = (top + 1) % n;
      place(); // the others slide up while the top card flies off
      setTimeout(() => {
        c.classList.add('no-anim');
        c.classList.remove('is-fly');
        void c.offsetWidth;
        c.classList.remove('no-anim');
        busy = false;
      }, 620);
    }

    function active() { return n > 1 && !reduce && visible && !hover && !focus && !document.hidden && !lightboxOpen; }
    function schedule() {
      clearTimeout(timer);
      if (active()) timer = setTimeout(() => { next(); schedule(); }, 3200);
    }

    root.addEventListener('mouseenter', () => { hover = true; schedule(); });
    root.addEventListener('mouseleave', () => { hover = false; schedule(); });
    root.addEventListener('focusin', () => { focus = true; schedule(); });
    root.addEventListener('focusout', () => { focus = false; schedule(); });
    document.addEventListener('visibilitychange', schedule);
    document.addEventListener('reel-resume', schedule);

    // flick the top card to shuffle
    let sx = null;
    root.addEventListener('pointerdown', (e) => { sx = e.clientX; moved = false; });
    root.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { moved = true; setTimeout(() => (moved = false), 350); next(); schedule(); }
    });

    new IntersectionObserver(([en]) => { visible = en.isIntersecting; schedule(); }, { threshold: 0.3 }).observe(root);

    g.replaceWith(root);
    place();
  }

  /* ---------- Drifting reel ---------- */
  function build(g) {
    if (g.classList.contains('gallery--stack')) return buildStack(g);
    const imgs = [...g.querySelectorAll('img')];
    if (!imgs.length) return;
    const wide = g.classList.contains('gallery--wide');
    const items = imgs.map((i) => ({ src: i.currentSrc || i.getAttribute('src'), alt: i.alt || 'Screenshot' }));
    const n = items.length;

    const root = document.createElement('div');
    root.className = 'reel';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', (g.getAttribute('aria-label') || 'Screenshots') + '. Click an image to enlarge');
    const track = document.createElement('div');
    track.className = 'reel-track';
    root.appendChild(track);

    let cardW = 300, setW = 1, copies = 3;
    let pos = 0, vel = 0, factor = 1;
    let hover = false, focus = false, dragging = false, moved = false, visible = false;
    let raf = 0, last = 0;

    function makeCard(i, original) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'reel-card';
      b.dataset.i = i;
      if (original) {
        b.setAttribute('aria-label', `${i + 1} of ${n}: ${items[i].alt}. Click to enlarge`);
      } else {
        b.tabIndex = -1;
        b.setAttribute('aria-hidden', 'true');
      }
      const im = document.createElement('img');
      im.src = items[i].src;
      im.alt = original ? items[i].alt : '';
      im.draggable = false;
      im.decoding = 'async';
      b.appendChild(im);
      return b;
    }

    function layout() {
      const cw = root.clientWidth;
      if (!cw) return;
      const gap = cw < 520 ? 12 : 18;
      root.style.setProperty('--reel-gap', gap + 'px');
      cardW = Math.round(Math.max(210, Math.min(cw * (wide ? 0.6 : 0.68), wide ? 620 : 480)));
      const cardH = Math.round(cardW / 2.05);
      setW = n * (cardW + gap);
      const want = Math.max(2, Math.ceil(cw / setW) + 2);
      if (want !== copies || !track.children.length) {
        copies = want;
        track.textContent = '';
        for (let c = 0; c < copies; c++) for (let i = 0; i < n; i++) track.appendChild(makeCard(i, c === 0));
      }
      [...track.children].forEach((el) => { el.style.width = cardW + 'px'; el.style.height = cardH + 'px'; });
      draw();
    }

    function wrap() { pos = ((pos % setW) + setW) % setW; }
    function draw() { wrap(); track.style.transform = `translate3d(${-pos}px,0,0)`; }

    function running() { return n > 0 && visible && !document.hidden && !lightboxOpen; }

    function frame(t) {
      raf = 0;
      if (!running()) { last = 0; return; }
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      if (!dragging) {
        const paused = hover || focus || reduce;
        factor += ((paused ? 0 : 1) - factor) * Math.min(1, dt * 5);
        pos += (SPEED * factor + vel) * dt;
        vel *= Math.pow(0.04, dt); // inertia fades out after a flick
        if (Math.abs(vel) < 1) vel = 0;
        draw();
      }
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && running()) { last = 0; raf = requestAnimationFrame(frame); } }

    // pointer: hover to pause, drag to scrub
    root.addEventListener('mouseenter', () => { hover = true; });
    root.addEventListener('mouseleave', () => { hover = false; });
    let sx = 0, lx = 0, lt = 0, pid = null;
    root.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button > 0) return;
      sx = lx = e.clientX; lt = performance.now(); moved = false; vel = 0; pid = e.pointerId;
      dragging = true;
    });
    root.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pid) return;
      const dx = e.clientX - lx;
      if (!moved && Math.abs(e.clientX - sx) > 6) { moved = true; root.classList.add('is-drag'); try { root.setPointerCapture(pid); } catch (_) {} }
      if (!moved) return;
      const now = performance.now(), dtm = Math.max(1, now - lt);
      pos -= dx;
      vel = -dx / dtm * 1000 * 0.6 + vel * 0.4;
      lx = e.clientX; lt = now;
      draw();
    });
    const end = (e) => {
      if (!dragging || (e && e.pointerId !== pid)) return;
      dragging = false;
      root.classList.remove('is-drag');
      if (moved) { vel = Math.max(-1600, Math.min(1600, vel)); setTimeout(() => (moved = false), 0); }
      if (e && e.pointerType !== 'mouse') hover = false;
      kick();
    };
    root.addEventListener('pointerup', end);
    root.addEventListener('pointercancel', end);

    // click a card (original or clone) → open viewer
    track.addEventListener('click', (e) => {
      const b = e.target.closest('.reel-card');
      if (!b || moved) { e.preventDefault(); return; }
      lbOpen(items, +b.dataset.i, b);
    });

    // keyboard: bring the focused card to centre and hold still
    root.addEventListener('focusin', (e) => {
      focus = true;
      root.scrollLeft = 0;
      const b = e.target.closest && e.target.closest('.reel-card');
      if (b) {
        const target = b.offsetLeft - (root.clientWidth - cardW) / 2;
        pos = target; draw();
      }
    });
    root.addEventListener('focusout', () => { focus = false; kick(); });
    root.addEventListener('scroll', () => { root.scrollLeft = 0; });
    document.addEventListener('visibilitychange', kick);

    // only animate while on screen (hidden tabs/panels never intersect)
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) { layout(); kick(); } }, { threshold: 0.1 }).observe(root);
    new ResizeObserver(layout).observe(root);

    // closing the viewer resumes the drift
    document.addEventListener('reel-resume', kick);

    g.replaceWith(root);
    layout();
  }

  document.querySelectorAll('.gallery').forEach(build);
})();
