(function () {
  // Peace Glory site UI: features of the original site that Atrium has no component for.
  // Ported from the original Next.js components (WhatsAppFloat, PageHero breadcrumbs, CustomCursor,
  // HomeHero scroll cue, HeritageSeal, three/scenes/HeroAtmosphere, three/scenes/TerrainField).
  var WA = '9779747209865';
  var MSG = 'Hello Peace Glory — I would like to ask about a stay.';
  var LABELS = {"/about":"About","/booking":"Booking","/contact":"Contact","/dining":"Dining","/events":"Events","/experiences":"Experiences","/faq":"FAQ","/gallery":"Gallery","/journal":"Journal","/location":"Location","/philosophy":"Our Philosophy","/stay":"Stay","/sustainability":"Sustainability","/farm":"The Farm","/experiences/campfire-gathering":"Campfire Gathering","/experiences/dawn-birdwatching":"Dawn Birdwatching","/experiences/family-farm-day":"Family Farm Day","/experiences/forest-bathing":"Forest Bathing","/experiences/guided-foraging":"Guided Foraging","/experiences/harvest-kitchen":"The Harvest Kitchen","/experiences/mindful-movement":"Mindful Movement","/experiences/organic-cultivation":"Organic Cultivation","/experiences/valley-trails":"Valley Trails","/experiences/village-heritage":"Village Heritage","/journal/a-menu-without-a-plan":"A Menu Without a Plan","/journal/building-with-earth":"Building With Earth","/journal/reading-the-soil":"Reading the Soil","/journal/the-valley-at-first-light":"The Valley at First Light","/stay/cottage":"The Cottage","/stay/deluxe":"The Deluxe","/stay/single":"The Single"};
  var SVG_ATTR = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
  var ARROW = '<svg width="12" height="12" viewBox="0 0 24 24" stroke-width="1.5" ' + SVG_ATTR + '><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  var ARROW_DOWN = '<svg width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" ' + SVG_ATTR + '><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>';
  var WA_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" ' + SVG_ATTR + '><path d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.4-1.2A9 9 0 1 0 12 3Z"/><path d="M9 8.4c.3-.1.6 0 .8.3l.8 1.3c.1.3.1.6-.1.8l-.5.5a5.5 5.5 0 0 0 2.7 2.7l.5-.5c.2-.2.5-.2.8-.1l1.3.8c.3.2.4.5.3.8a2 2 0 0 1-2.4 1.2 8.3 8.3 0 0 1-5.4-5.4A2 2 0 0 1 9 8.4Z"/></svg>';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // Only touch the DOM after React has hydrated it, so the server HTML still matches.
  function hydrated(el) { for (var k in el) if (k.indexOf('__reactFiber') === 0) return true; return false; }
  function route() {
    var base = (location.pathname.match(/^\/_(?:preview|site)\/[^/]+/) || [''])[0];
    return { base: base, path: location.pathname.slice(base.length).replace(/\/+$/, '') || '/' };
  }
  function mq(q) { return !!(window.matchMedia && matchMedia(q).matches); }
  function sectionWith(re) {
    var all = document.querySelectorAll('main > section');
    for (var i = 0; i < all.length; i++) if (re.test(all[i].textContent)) return all[i];
    return null;
  }

  // Device tier (hooks/useDeviceCapability).
  var TIER = (function () {
    if (mq('(prefers-reduced-motion: reduce)')) return 'none';
    var c = navigator.connection; if (c && c.saveData) return 'none';
    var cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4;
    if (window.innerWidth < 768) return cores >= 6 && mem >= 4 ? 'low' : 'none';
    if (cores >= 8 && mem >= 8) return 'high';
    return cores >= 4 ? 'medium' : 'low';
  })();
  var MAX_DPR = TIER === 'high' ? 2 : TIER === 'medium' ? 1.5 : 1;

  // Breadcrumbs (PageHero).
  function crumbs() {
    var r = route(), path = r.path === '/' ? '' : r.path;
    var copy = document.querySelector('main .a-hero .a-hero__copy');
    if (!copy) return;
    var existing = copy.querySelector('.pg-crumbs');
    if (!path || !LABELS[path]) { if (existing) existing.remove(); return; }
    if (existing && existing.getAttribute('data-path') === path) return;
    if (!hydrated(copy)) return;
    if (existing) existing.remove();
    var segs = path.split('/').filter(Boolean), acc = '', items = '<li><a href="' + r.base + '/">Home</a></li>';
    segs.forEach(function (s, i) {
      acc += '/' + s;
      var name = esc(LABELS[acc] || s);
      items += '<li>' + ARROW + (i === segs.length - 1 ? '<span aria-current="page">' + name + '</span>' : '<a href="' + r.base + acc + '">' + name + '</a>') + '</li>';
    });
    var nav = document.createElement('nav');
    nav.className = 'pg-crumbs';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.setAttribute('data-path', path);
    nav.innerHTML = '<ol>' + items + '</ol>';
    copy.insertBefore(nav, copy.firstChild);
  }

  // Floating WhatsApp button (WhatsAppFloat).
  function whatsapp() {
    if (document.getElementById('pg-wa') || !hydrated(document.body)) return;
    var a = document.createElement('a');
    a.id = 'pg-wa';
    a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(MSG);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'Contact us on WhatsApp');
    a.innerHTML = WA_ICON + '<span>WhatsApp</span>';
    document.body.appendChild(a);
  }

  // Custom cursor (CustomCursor).
  var VIEW = '.a-room, .a-exp, .a-clist__item';
  var EXPLORE = '.a-gallery__open, a.a-image__link[href$="/gallery"]';
  var cursorReady = false;
  function cursor() {
    if (!mq('(hover: hover) and (pointer: fine)') || mq('(prefers-reduced-motion: reduce)') || !hydrated(document.body)) return;
    if (!document.getElementById('pg-cursor')) {
      var el = document.createElement('div');
      el.id = 'pg-cursor';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<span></span>';
      document.body.appendChild(el);
    }
    document.documentElement.setAttribute('data-pg-cursor', '');
    if (cursorReady) return;
    cursorReady = true;
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      var el = document.getElementById('pg-cursor');
      if (!el) return;
      el.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      el.classList.add('is-visible');
      var t = e.target && e.target.closest ? e.target : null;
      var hit = t ? t.closest(VIEW + ', ' + EXPLORE + ', [data-cursor], a, button') : null;
      var label = hit && hit.matches(VIEW) ? 'View' : hit && hit.matches(EXPLORE) ? 'Explore' : '';
      el.classList.toggle('is-link', !!hit && !label);
      el.classList.toggle('is-label', !!label);
      el.firstChild.textContent = label;
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () {
      var el = document.getElementById('pg-cursor');
      if (el) el.classList.remove('is-visible');
    });
  }

  // Room cards (AccommodationCard): amenity chips under the tagline.
  var ROOM_TAGS = { cottage: ['Riverside', 'Private Terrace', 'Wood Stove'], single: ['Garden Level', 'For One or Two', 'Direct Garden Access'], deluxe: ['Valley View', 'Private Balcony', 'Stone Tub'] };
  function roomChips() {
    var cards = document.querySelectorAll('main .a-room');
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], body = c.querySelector('.a-room__body'), m = (c.getAttribute('href') || '').match(/\/stay\/([^/?#]+)/);
      if (!body || !m || !ROOM_TAGS[m[1]] || body.querySelector('.pg-chips') || !hydrated(body)) continue;
      var d = document.createElement('div');
      d.className = 'pg-chips';
      d.innerHTML = ROOM_TAGS[m[1]].map(function (t) { return '<span class="pg-chip">' + esc(t) + '</span>'; }).join('');
      body.appendChild(d);
    }
  }

  // Mobile menu (MobileMenu): the secondary links under the primary ones, and the CTA label.
  var MENU2 = [['Location', '/location'], ['Events', '/events'], ['Journal', '/journal'], ['FAQ', '/faq'], ['Contact', '/contact']];
  function menuExtras() {
    var nav = document.querySelector('.a-header__drawer nav'), base = route().base;
    if (nav && !nav.querySelector('.pg-mnav2') && hydrated(nav)) {
      var d = document.createElement('div');
      d.className = 'pg-mnav2';
      d.innerHTML = MENU2.map(function (l) { return '<a href="' + base + l[1] + '">' + l[0] + '</a>'; }).join('');
      nav.appendChild(d);
    }
    var label = document.querySelector('.a-header__drawer-foot .a-btn__label');
    if (label && label.textContent !== 'Book Your Stay' && hydrated(label.parentElement)) label.textContent = 'Book Your Stay';
  }

  // Scroll cue on the home hero (HomeHero).
  function scrollCue() {
    if (route().path !== '/') return;
    var hero = document.querySelector('main .a-hero');
    if (!hero || hero.querySelector('.pg-cue') || !hydrated(hero)) return;
    var a = document.createElement('a');
    a.className = 'pg-cue';
    a.href = '#about';
    a.setAttribute('aria-label', 'Scroll to discover Peace Glory');
    a.innerHTML = ARROW_DOWN;
    hero.appendChild(a);
  }

  // Heritage seal (HeritageSeal): rotating badge at the original's positions.
  var sealN = 0;
  function sealHtml(size) {
    var id = 'pg-seal-path-' + (sealN++), icon = size * 0.375;
    return '<div class="pg-seal" style="width:' + size + 'px;height:' + size + 'px" aria-hidden="true">' +
      '<svg width="' + icon + '" height="' + icon + '" viewBox="0 0 24 24" stroke-width="1" ' + SVG_ATTR + '><path d="M5 19c0-7 5-12 14-13 1 9-3 15-10 15a7 7 0 0 1-4-2Z"/><path d="M6 18C9 14 13 11 17 9"/></svg>' +
      '<svg class="pg-seal__ring" viewBox="0 0 100 100"><path id="' + id + '" d="M 50 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent"/>' +
      '<text><textPath href="#' + id + '" startOffset="0%">• SUSTAINABLE SANCTUARY • PEACE GLORY ECO FARM RESORT</textPath></text></svg></div>';
  }
  // Seal overlapping a corner of `frame`, positioned inside `host` (made relative by CSS).
  function cornerSeal(key, host, frame, size, corner, minWidth) {
    if (!host || !frame || host.querySelector('[data-pg-seal="' + key + '"]') || !hydrated(host)) return;
    var w = document.createElement('div');
    w.className = 'pg-seal-pos';
    w.setAttribute('data-pg-seal', key);
    w.setAttribute('data-min', minWidth);
    w.innerHTML = sealHtml(size);
    host.classList.add('pg-seal-host');
    host.appendChild(w);
    var place = function () {
      var h = host.getBoundingClientRect(), f = frame.getBoundingClientRect();
      w.style.top = (f.bottom - h.top - size + 32) + 'px';
      w.style.left = (corner === 'left' ? f.left - h.left - 32 : f.right - h.left - size + 32) + 'px';
    };
    place();
    if (window.ResizeObserver) new ResizeObserver(place).observe(host);
  }
  function blockSeal(key, host, size, minWidth) {
    if (!host || host.querySelector('[data-pg-seal="' + key + '"]') || !hydrated(host)) return;
    var w = document.createElement('div');
    w.className = 'pg-seal-block';
    w.setAttribute('data-pg-seal', key);
    w.setAttribute('data-min', minWidth);
    w.innerHTML = sealHtml(size);
    host.appendChild(w);
  }
  function seals() {
    var p = route().path, s;
    if (p === '/') {
      s = document.getElementById('about');
      if (s) cornerSeal('home', s.querySelector('.a-split__grid'), s.querySelector('.a-split__media'), 128, 'left', 'sm');
    } else if (p === '/about') {
      s = sectionWith(/More than a resort/);
      if (s) blockSeal('about', s.querySelector('.a-text2__head'), 132, 'md');
    } else if (p === '/philosophy') {
      s = sectionWith(/Built away from the easy road/);
      if (s) cornerSeal('philosophy', s.querySelector('.a-split__grid'), s.querySelector('.a-split__media'), 112, 'right', 'lg');
    } else if (p === '/contact') {
      s = document.querySelector('main .a-form');
      if (s) blockSeal('contact', s.querySelector('.a-fmsec__aside') || s.querySelector('.a-container'), 124, 'lg');
    } else if (/^\/stay\/[^/]+$/.test(p)) {
      var aside = document.querySelector('main aside');
      if (aside) blockSeal('stay', aside.parentElement, 112, 'lg');
    }
    var bottom = document.querySelector('.a-footer__bottom');
    if (bottom && !bottom.querySelector('[data-pg-seal]') && hydrated(bottom)) {
      var f = document.createElement('div');
      f.className = 'pg-seal-foot';
      f.setAttribute('data-pg-seal', 'footer');
      f.innerHTML = sealHtml(88);
      bottom.appendChild(f);
    }
  }

  // Scenes (three/scenes/*), drawn on a 2D canvas with the same maths as the WebGL originals.
  function createRandom(seed) {
    var state = seed >>> 0;
    return function () {
      state = (state + 0x6d2b79f5) >>> 0;
      var t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var FOV_T = Math.tan((45 / 2) * Math.PI / 180), CAM_Z = 6, VIEW_H = 2 * FOV_T * CAM_Z;
  function project(x, y, z, w, h) {
    var d = CAM_Z - z;
    if (d <= 0.1) return null;
    var k = (h / 2) / (d * FOV_T);
    return [w / 2 + x * k, h / 2 - y * k, d];
  }

  // Canvas layer that renders `draw(ctx, w, h, seconds, dpr)` while on screen. The original's overlay sits
  // above its WebGL canvas, so react-three-fiber never receives pointer events: the scenes do not follow the mouse.
  function stage(host, key, draw) {
    if (!host || host.querySelector('canvas[data-pg-scene="' + key + '"]') || !hydrated(host)) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'pg-scene';
    canvas.setAttribute('data-pg-scene', key);
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d'), w = 0, h = 0, dpr = 1, visible = false, running = false, start = performance.now();
    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function frame() {
      if (!visible || document.hidden || !canvas.isConnected) { running = false; return; }
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, (performance.now() - start) / 1000, dpr);
      requestAnimationFrame(frame);
    }
    function kick() { if (!running && visible && !document.hidden) { running = true; requestAnimationFrame(frame); } }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(function (es) { visible = es.some(function (e) { return e.isIntersecting; }); kick(); }, { rootMargin: '200px' }).observe(canvas);
    document.addEventListener('visibilitychange', kick);
  }

  // HeroAtmosphere: drifting motes and a breathing haze.
  function atmosphere(host) {
    var count = TIER === 'high' ? 900 : TIER === 'medium' ? 480 : 220, spread = 18;
    var random = createRandom(0x9e3779b9), base = [], speeds = [], phases = [];
    for (var i = 0; i < count; i++) {
      base.push([(random() - 0.5) * spread, (random() - 0.5) * spread * 0.6, (random() - 0.5) * 8 - 2]);
      random(); // per-point scale: generated by the original, unused by its material
      speeds.push(random() * 0.06 + 0.02);
      phases.push(random() * Math.PI * 2);
    }
    // PointsMaterial alphaMap samples the sprite's green channel, which is ~252/255 everywhere inside the
    // gradient's radius (the gradient only fades alpha), so a mote is a flat #f5e0b7 disc; drawing the 64px
    // disc down to a few pixels with smoothing stands in for the texture's mipmaps.
    var sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    var sc = sprite.getContext('2d');
    sc.fillStyle = 'rgba(245,224,183,0.973)';
    sc.beginPath(); sc.arc(32, 32, 32, 0, Math.PI * 2); sc.fill();
    stage(host, 'atmosphere', function (ctx, w, h, t) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(213,231,222,' + (0.05 + Math.sin(t * 0.18) * 0.02) + ')';
      ctx.fillRect(0, 0, w, h);
      var ry = Math.sin(t * 0.05) * 0.06, cy = Math.cos(ry), sy = Math.sin(ry);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.55;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      for (var i = 0; i < count; i++) {
        var b = base[i];
        var y = b[1] - spread * 0.3 + ((t * speeds[i] + phases[i]) % 1) * spread * 0.6;
        var x = b[0] + Math.sin(t * 0.25 + phases[i]) * 0.35, z = b[2];
        var p = project(x * cy + z * sy, y, -x * sy + z * cy, w, h);
        if (!p) continue;
        var s = 0.075 * (h / 2) / p[2];
        ctx.drawImage(sprite, p[0] - s / 2, p[1] - s / 2, s, s);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    });
  }

  // TerrainField: wireframe contour lattice and cultivated plots.
  function noise2D(x, y) { var s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return s - Math.floor(s); }
  function smoothNoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = noise2D(xi, yi), b = noise2D(xi + 1, yi), c = noise2D(xi, yi + 1), d = noise2D(xi + 1, yi + 1);
    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
  }
  function elevation(x, y) { return smoothNoise(x * 0.35, y * 0.35) + smoothNoise(x * 0.8, y * 0.8) * 0.4 + smoothNoise(x * 1.9, y * 1.9) * 0.15; }
  // Euler XYZ (three.js default): v' = Rx * Ry * Rz * v, then the mesh position offset.
  function transform(v, R, oy, scale) {
    var x = v[0] * scale, y = v[1] * scale, z = v[2] * scale;
    var x1 = x * R.cz - y * R.sz, y1 = x * R.sz + y * R.cz;
    var x2 = x1 * R.cy + z * R.sy, z2 = -x1 * R.sy + z * R.cy;
    return [x2, y1 * R.cx - z2 * R.sx + oy, y1 * R.sx + z2 * R.cx];
  }
  function rot(rx, ry, rz) { return { cx: Math.cos(rx), sx: Math.sin(rx), cy: Math.cos(ry), sy: Math.sin(ry), cz: Math.cos(rz), sz: Math.sin(rz) }; }
  function terrain(host, key) {
    var segX = TIER === 'high' ? 96 : TIER === 'medium' ? 64 : 40, segY = Math.round(segX * 0.6), plots = TIER === 'high' ? 420 : TIER === 'medium' ? 240 : 120;
    var verts = [];
    for (var iy = 0; iy <= segY; iy++) for (var ix = 0; ix <= segX; ix++) {
      var x = -11 + (22 * ix) / segX, y = 7 - (14 * iy) / segY, fall = Math.max(0, 1 - Math.pow(Math.abs(x) / 11, 2));
      verts.push([x, y, (elevation(x, y) - 0.75) * 2.2 * fall]);
    }
    var random = createRandom(0x5bf03635), pts = [];
    for (var i = 0; i < plots; i++) {
      var px = (random() - 0.5) * 20, py = (random() - 0.5) * 12, f = Math.max(0, 1 - Math.pow(Math.abs(px) / 11, 2));
      pts.push([px, py, (elevation(px, py) - 0.75) * 2.2 * f + 0.06]);
    }
    var cols = segX + 1;
    stage(host, key, function (ctx, w, h, t, dpr) {
      var scale = VIEW_H * (w / h) > 8 ? 1 : 0.75, rz = -0.35 + Math.sin(t * 0.06) * 0.03, oy = -1.4 + Math.sin(t * 0.12) * 0.08;
      var R = rot(-1.05, 0, rz), P = new Array(verts.length);
      for (var i = 0; i < verts.length; i++) { var v = transform(verts[i], R, oy, scale); P[i] = project(v[0], v[1], v[2], w, h); }
      ctx.strokeStyle = 'rgba(62,75,49,0.28)';
      ctx.lineWidth = 1 / dpr;
      var seg = function (a, b) { if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } };
      // Pass 1: every edge once. Pass 2: the edges two triangles share (all but the outline) once more.
      for (var pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        for (var y = 0; y <= segY; y++) for (var x = 0; x <= segX; x++) {
          var a = P[y * cols + x];
          if (x < segX && (pass === 0 || (y > 0 && y < segY))) seg(a, P[y * cols + x + 1]);
          if (y < segY && (pass === 0 || (x > 0 && x < segX))) seg(a, P[(y + 1) * cols + x]);
          if (x < segX && y < segY) seg(P[(y + 1) * cols + x], P[y * cols + x + 1]);
        }
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(197,157,95,' + (0.5 + Math.sin(t * 0.4) * 0.12) + ')';
      for (var j = 0; j < pts.length; j++) {
        var q = transform(pts[j], R, oy, 1), pp = project(q[0], q[1], q[2], w, h);
        if (!pp) continue;
        var s = 0.055 * (h / 2) / pp[2];
        ctx.fillRect(pp[0] - s / 2, pp[1] - s / 2, s, s);
      }
    });
  }

  function scenes() {
    if (TIER === 'none' || !window.IntersectionObserver) return;
    var p = route().path, s;
    if (p === '/') {
      atmosphere(document.querySelector('main .a-hero .a-hero__media'));
    } else if (p === '/farm') {
      s = sectionWith(/A farm shaped by its valley/);
      if (s) terrain(s.querySelector('.a-parallax__media'), 'terrain-farm');
    } else if (p === '/location') {
      s = sectionWith(/How to reach us/);
      if (s) terrain(s.querySelector('.a-image .a-frame'), 'terrain-location');
    }
  }

  // The location terrain box carries its label inside, over a gradient (location/page.tsx).
  function terrainLabel() {
    if (route().path !== '/location') return;
    var s = sectionWith(/How to reach us/), fig = s && s.querySelector('.a-image'), frame = fig && fig.querySelector('.a-frame');
    if (!frame || frame.querySelector('.pg-terrain-label') || !hydrated(frame)) return;
    var cap = fig.querySelector('figcaption'), txt = cap ? cap.textContent.split(' — ') : ['Navigate the Terrain', 'The valley, in contour'];
    var shade = document.createElement('div');
    shade.className = 'pg-terrain-shade';
    frame.appendChild(shade);
    var label = document.createElement('div');
    label.className = 'pg-terrain-label';
    label.innerHTML = '<p>' + esc(txt[0] || '') + '</p><p>' + esc(txt[1] || '') + '</p>';
    frame.appendChild(label);
  }

  var queued = false;
  function run() {
    queued = false;
    var steps = [crumbs, whatsapp, cursor, roomChips, menuExtras, scrollCue, seals, scenes, terrainLabel];
    for (var i = 0; i < steps.length; i++) { try { steps[i](); } catch (e) { /* never break the page */ } }
  }
  function schedule() { if (!queued) { queued = true; setTimeout(run, 30); } }
  schedule();
  window.addEventListener('load', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
