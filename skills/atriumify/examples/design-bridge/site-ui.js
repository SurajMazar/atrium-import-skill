/*
 * Worked example: site script for UI Atrium has no component for (breadcrumb in page heroes and a
 * floating WhatsApp button). Put it in site.json settings.scripts (placement body-end, consent
 * necessary). Replace WA, MSG and LABELS (public path -> breadcrumb label) for each site.
 * Rules it follows: wait for React hydration, re-apply after client navigation, setTimeout (not rAF),
 * support /_preview/<token> and /_site/<slug> prefixes. Style #pg-wa and .pg-crumbs in the bridge CSS.
 */
(function () {
  var WA = '9779800000000'; // WhatsApp number, digits only, with country code
  var MSG = 'Hello — I would like to ask about a stay.';
  var LABELS = {"/about":"About","/booking":"Booking","/contact":"Contact","/dining":"Dining","/events":"Events","/experiences":"Experiences","/faq":"FAQ","/gallery":"Gallery","/journal":"Journal","/location":"Location","/philosophy":"Our Philosophy","/stay":"Stay","/sustainability":"Sustainability","/farm":"The Farm","/experiences/campfire-gathering":"Campfire Gathering","/experiences/dawn-birdwatching":"Dawn Birdwatching","/experiences/family-farm-day":"Family Farm Day","/experiences/forest-bathing":"Forest Bathing","/experiences/guided-foraging":"Guided Foraging","/experiences/harvest-kitchen":"The Harvest Kitchen","/experiences/mindful-movement":"Mindful Movement","/experiences/organic-cultivation":"Organic Cultivation","/experiences/valley-trails":"Valley Trails","/experiences/village-heritage":"Village Heritage","/journal/a-menu-without-a-plan":"A Menu Without a Plan","/journal/building-with-earth":"Building With Earth","/journal/reading-the-soil":"Reading the Soil","/journal/the-valley-at-first-light":"The Valley at First Light","/stay/cottage":"The Cottage","/stay/deluxe":"The Deluxe","/stay/single":"The Single"};
  var ARROW = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  var WA_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.4-1.2A9 9 0 1 0 12 3Z"/><path d="M9 8.4c.3-.1.6 0 .8.3l.8 1.3c.1.3.1.6-.1.8l-.5.5a5.5 5.5 0 0 0 2.7 2.7l.5-.5c.2-.2.5-.2.8-.1l1.3.8c.3.2.4.5.3.8a2 2 0 0 1-2.4 1.2 8.3 8.3 0 0 1-5.4-5.4A2 2 0 0 1 9 8.4Z"/></svg>';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // Only touch the DOM after React has hydrated it, so the server HTML still matches.
  function hydrated(el) { for (var k in el) if (k.indexOf('__reactFiber') === 0) return true; return false; }

  function crumbs() {
    var base = (location.pathname.match(/^\/_(?:preview|site)\/[^/]+/) || [''])[0];
    var path = location.pathname.slice(base.length).replace(/\/+$/, '');
    var copy = document.querySelector('main .a-hero .a-hero__copy');
    if (!copy) return;
    var existing = copy.querySelector('.pg-crumbs');
    if (!path || !LABELS[path]) { if (existing) existing.remove(); return; }
    if (existing && existing.getAttribute('data-path') === path) return;
    if (!hydrated(copy)) return;
    if (existing) existing.remove();
    var segs = path.split('/').filter(Boolean), acc = '', items = '<li><a href="' + base + '/">Home</a></li>';
    segs.forEach(function (s, i) {
      acc += '/' + s;
      var name = esc(LABELS[acc] || s);
      items += '<li>' + ARROW + (i === segs.length - 1 ? '<span aria-current="page">' + name + '</span>' : '<a href="' + base + acc + '">' + name + '</a>') + '</li>';
    });
    var nav = document.createElement('nav');
    nav.className = 'pg-crumbs';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.setAttribute('data-path', path);
    nav.innerHTML = '<ol>' + items + '</ol>';
    copy.insertBefore(nav, copy.firstChild);
  }

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

  var queued = false;
  function run() {
    queued = false;
    try { crumbs(); whatsapp(); } catch (e) { /* never break the page */ }
  }
  function schedule() { if (!queued) { queued = true; setTimeout(run, 30); } }
  schedule();
  window.addEventListener('load', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
