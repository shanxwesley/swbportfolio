/* Gallery carousel + lightbox for Shan's portfolio.
   Upgrades every existing <div class="gallery"> in place. No HTML changes needed.
   Add once, before </body>:  <script src="assets/gallery.js" defer></script> */
(() => {
  const CSS = `
/* Fix: grid items must be allowed to shrink, otherwise wide content pushes the card off-screen */
.cards { grid-template-columns: minmax(0, 1fr); }
@media (min-width: 900px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.card { min-width: 0; }

.cx { position: relative; width: 100%; margin-top: 1rem; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); background: var(--surface-2); box-shadow: 0 6px 20px rgba(31,47,61,.08); }
.cx-view { overflow: hidden; aspect-ratio: 16 / 10; touch-action: pan-y; }
.cx--wide .cx-view { aspect-ratio: 16 / 9; max-height: min(62vh, 520px); }
.cx-track { display: flex; height: 100%; transition: transform .6s cubic-bezier(.65, 0, .35, 1); will-change: transform; }
.cx-slide { flex: 0 0 100%; min-width: 0; height: 100%; padding: 0; border: 0; background: none; cursor: zoom-in; display: block; position: relative; }
.cx-slide img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; transition: transform .6s ease; }
.cx-slide:hover img { transform: scale(1.025); }
.cx-slide:focus-visible { outline-offset: -3px; }

.cx-zoom { position: absolute; top: .6rem; right: .6rem; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; color: #fff; background: rgba(15,22,30,.55); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); opacity: 0; transition: opacity .2s; pointer-events: none; }
.cx:hover .cx-zoom, .cx:focus-within .cx-zoom { opacity: 1; }

.cx-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; border-radius: 50%; border: 0; cursor: pointer; display: grid; place-items: center; color: #fff; background: rgba(15,22,30,.55); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); opacity: 0; transition: opacity .2s, background .2s; }
.cx-btn:hover { background: rgba(15,22,30,.8); }
.cx-prev { left: .6rem; } .cx-next { right: .6rem; }
.cx:hover .cx-btn, .cx:focus-within .cx-btn { opacity: 1; }
@media (hover: none) { .cx-btn, .cx-zoom { opacity: 1; } .cx-btn { width: 34px; height: 34px; } }

.cx-bar { position: absolute; left: 0; right: 0; bottom: 0; display: flex; align-items: center; gap: .75rem; padding: 1.6rem .85rem .6rem; color: #fff; background: linear-gradient(to top, rgba(10,16,22,.72), transparent); pointer-events: none; }
.cx-cap { flex: 1; min-width: 0; font-size: .82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 3px rgba(0,0,0,.4); }
.cx-dots { display: flex; gap: 5px; pointer-events: auto; }
.cx-dot { width: 7px; height: 7px; padding: 0; border: 0; border-radius: 99px; background: rgba(255,255,255,.5); cursor: pointer; transition: width .3s, background .3s; }
.cx-dot[aria-current="true"] { width: 20px; background: #fff; }
.cx-play { pointer-events: auto; width: 26px; height: 26px; border-radius: 50%; border: 0; cursor: pointer; display: grid; place-items: center; color: #fff; background: rgba(255,255,255,.18); }
.cx-play:hover { background: rgba(255,255,255,.32); }
.cx-prog { position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; background: var(--link); transform-origin: left; transform: scaleX(0); opacity: .9; }
.cx-prog.run { animation: cxprog var(--cx-ms, 4500ms) linear forwards; }
@keyframes cxprog { to { transform: scaleX(1); } }
@media (max-width: 520px) { .cx-cap { display: none; } .cx-dots { margin-left: auto; } }

/* Lightbox */
.lb { position: fixed; inset: 0; z-index: 100; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .5rem; padding: calc(3.5rem + env(safe-area-inset-top, 0px)) .75rem calc(1rem + env(safe-area-inset-bottom, 0px)); background: rgba(8,12,17,.88); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); animation: lbin .2s ease both; }
.lb[hidden] { display: none; }
@keyframes lbin { from { opacity: 0; } to { opacity: 1; } }
.lb figure { margin: 0; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: .75rem; max-height: 100%; }
.lb img { max-width: 100%; max-height: calc(100dvh - 9rem); object-fit: contain; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.5); background: #fff; }
.lb figcaption { color: #e8eff6; font-size: .9rem; text-align: center; }
.lb figcaption small { color: #a2b2c2; margin-left: .5rem; }
.lb-x, .lb-nav { border: 0; cursor: pointer; color: #fff; background: rgba(255,255,255,.14); display: grid; place-items: center; border-radius: 50%; transition: background .2s; }
.lb-x:hover, .lb-nav:hover { background: rgba(255,255,255,.28); }
.lb-x { position: absolute; top: calc(.9rem + env(safe-area-inset-top, 0px)); right: 1rem; width: 42px; height: 42px; }
.lb-nav { width: 46px; height: 46px; }
@media (max-width: 640px) { .lb { grid-template-columns: minmax(0, 1fr); } .lb-nav { position: absolute; bottom: calc(1rem + env(safe-area-inset-bottom, 0px)); } .lb-prev { left: 1rem; } .lb-next { right: 1rem; } .lb img { max-height: calc(100dvh - 12rem); } }
@media (prefers-reduced-motion: reduce) { .cx-track, .cx-slide img { transition: none; } .cx-prog { display: none; } }
`;

  const svg = (d) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    prev: svg('<path d="m15 18-6-6 6-6"/>'),
    next: svg('<path d="m9 18 6-6-6-6"/>'),
    close: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
    pause: svg('<path d="M9 5v14M15 5v14"/>'),
    play: svg('<path d="M7 5l12 7-12 7z"/>'),
    zoom: svg('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>')
  };

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTERVAL = 4500;
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
  let lbItems = [], lbIdx = 0, lbOpener = null, lbSync = null;

  function lbShow(n) {
    lbIdx = (n + lbItems.length) % lbItems.length;
    const it = lbItems[lbIdx];
    lbImg.src = it.src;
    lbImg.alt = it.alt;
    lbCap.innerHTML = '';
    lbCap.append(it.alt);
    const c = document.createElement('small');
    c.textContent = `${lbIdx + 1} / ${lbItems.length}`;
    lbCap.appendChild(c);
    lb.querySelectorAll('.lb-nav').forEach((b) => (b.hidden = lbItems.length < 2));
    // warm the neighbours so next/prev feels instant
    [1, -1].forEach((d) => { const p = lbItems[(lbIdx + d + lbItems.length) % lbItems.length]; if (p) new Image().src = p.src; });
  }
  function lbOpen(items, start, opener, sync) {
    lbItems = items; lbOpener = opener; lbSync = sync;
    lightboxOpen = true;
    lb.hidden = false;
    lbShow(start);
    lb.querySelector('.lb-x').focus();
  }
  function lbClose() {
    if (lb.hidden) return;
    lb.hidden = true;
    lightboxOpen = false;
    if (lbSync) lbSync(lbIdx);
    if (lbOpener) lbOpener.focus({ preventScroll: true });
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

  /* ---------- Carousel ---------- */
  function build(g) {
    const imgs = [...g.querySelectorAll('img')];
    if (!imgs.length) return;
    const items = imgs.map((i) => ({ src: i.currentSrc || i.getAttribute('src'), alt: i.alt || 'Screenshot' }));
    const n = items.length;

    const root = document.createElement('div');
    root.className = 'cx' + (g.classList.contains('gallery--wide') ? ' cx--wide' : '');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', g.getAttribute('aria-label') || 'Screenshots');
    root.style.setProperty('--cx-ms', INTERVAL + 'ms');

    const view = document.createElement('div');
    view.className = 'cx-view';
    const track = document.createElement('div');
    track.className = 'cx-track';
    track.setAttribute('aria-live', 'off');

    const slides = imgs.map((img, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cx-slide';
      b.setAttribute('role', 'group');
      b.setAttribute('aria-roledescription', 'slide');
      b.setAttribute('aria-label', `${i + 1} of ${n}: ${img.alt}. Click to enlarge`);
      img.removeAttribute('width'); img.removeAttribute('height');
      img.draggable = false;
      if (i === 0) img.loading = 'eager';
      b.appendChild(img);
      b.addEventListener('click', () => { if (swiped) return; lbOpen(items, i, b, (k) => go(k, true)); });
      track.appendChild(b);
      return b;
    });
    view.appendChild(track);
    root.appendChild(view);

    const zoom = document.createElement('span');
    zoom.className = 'cx-zoom'; zoom.innerHTML = I.zoom;
    root.appendChild(zoom);

    let idx = 0, userPaused = reduce, hover = false, focus = false, visible = false, timer = null, swiped = false;
    let prev, next, dots = [], play, cap, prog;

    if (n > 1) {
      prev = btn('cx-btn cx-prev', 'Previous slide', I.prev, () => go(idx - 1, true));
      next = btn('cx-btn cx-next', 'Next slide', I.next, () => go(idx + 1, true));
      root.append(prev, next);
    }

    const bar = document.createElement('div');
    bar.className = 'cx-bar';
    cap = document.createElement('span');
    cap.className = 'cx-cap';
    bar.appendChild(cap);
    if (n > 1) {
      const dw = document.createElement('div');
      dw.className = 'cx-dots';
      items.forEach((it, i) => {
        const d = btn('cx-dot', `Go to slide ${i + 1}`, '', () => go(i, true));
        d.className = 'cx-dot';
        dw.appendChild(d); dots.push(d);
      });
      play = btn('cx-play', 'Pause automatic slideshow', I.pause, () => {
        userPaused = !userPaused;
        play.innerHTML = userPaused ? I.play : I.pause;
        play.setAttribute('aria-label', userPaused ? 'Start automatic slideshow' : 'Pause automatic slideshow');
        schedule();
      });
      bar.append(dw, play);
      prog = document.createElement('div');
      prog.className = 'cx-prog';
      root.appendChild(prog);
    }
    root.appendChild(bar);

    function btn(cls, label, html, fn) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = cls; b.innerHTML = html;
      b.setAttribute('aria-label', label);
      b.addEventListener('click', fn);
      return b;
    }

    function go(i, manual) {
      idx = (i + n) % n;
      track.style.transform = `translateX(${-idx * 100}%)`;
      slides.forEach((s, k) => { s.tabIndex = k === idx ? 0 : -1; s.setAttribute('aria-hidden', k === idx ? 'false' : 'true'); });
      dots.forEach((d, k) => d.setAttribute('aria-current', k === idx ? 'true' : 'false'));
      cap.textContent = items[idx].alt;
      if (manual) schedule(); else restartProgress();
    }

    function active() { return n > 1 && !userPaused && !hover && !focus && visible && !document.hidden && !lightboxOpen; }
    function restartProgress() {
      if (!prog) return;
      prog.classList.remove('run');
      void prog.offsetWidth;
      if (active()) prog.classList.add('run');
    }
    function schedule() {
      clearTimeout(timer);
      restartProgress();
      if (active()) timer = setTimeout(() => { go(idx + 1, false); schedule(); }, INTERVAL);
    }

    root.addEventListener('mouseenter', () => { hover = true; schedule(); });
    root.addEventListener('mouseleave', () => { hover = false; schedule(); });
    root.addEventListener('focusin', () => { focus = true; schedule(); });
    root.addEventListener('focusout', () => { focus = false; schedule(); });
    document.addEventListener('visibilitychange', schedule);
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { go(idx - 1, true); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(idx + 1, true); e.preventDefault(); }
    });

    // swipe on touch
    let sx = null;
    view.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; swiped = false; hover = true; }, { passive: true });
    view.addEventListener('touchend', (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx; sx = null; hover = false;
      if (Math.abs(dx) > 40) { swiped = true; setTimeout(() => (swiped = false), 350); go(idx + (dx < 0 ? 1 : -1), true); }
      else schedule();
    });

    // only run while on screen (hidden tabs/panels never intersect)
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; schedule(); }, { threshold: 0.35 }).observe(root);

    g.replaceWith(root);
    go(0, false);
  }

  document.querySelectorAll('.gallery').forEach(build);
})();
