/* Xanh Wellness — site interactions (vanilla JS, no dependencies).
   Shared by every page; each block runs only if its markup exists. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------- Header: sticky shadow + mobile nav ---------------- */
  var header = $('.site-header');
  var nav = $('#main-nav');
  var toggle = $('#nav-toggle');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 10);
    toTop.classList.toggle('is-visible', y > 700);
  }

  function setNav(open) {
    if (open) document.documentElement.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    document.body.classList.toggle('no-scroll', open);
  }

  toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 1181px)').addEventListener('change', function (mq) { if (mq.matches) setNav(false); });

  var toTop = $('.to-top');
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Hero banner ---------------- */
  var hero = $('.hero');
  if (hero) {
  var slides = $$('.hero-slide');
  var dots = $$('.hero-dots button');
  var heroIndex = 0;
  var heroTimer = null;

  function showSlide(i) {
    heroIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === heroIndex); });
    dots.forEach(function (d, n) {
      d.classList.toggle('is-active', n === heroIndex);
      if (n === heroIndex) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
  }
  function startHero() {
    if (reduceMotion || slides.length < 2) return;
    stopHero();
    heroTimer = setInterval(function () { showSlide(heroIndex + 1); }, 6000);
  }
  function stopHero() { if (heroTimer) { clearInterval(heroTimer); heroTimer = null; } }

  dots.forEach(function (d, n) { d.addEventListener('click', function () { showSlide(n); startHero(); }); });
  hero.addEventListener('mouseenter', stopHero);
  hero.addEventListener('mouseleave', startHero);
  hero.addEventListener('focusin', stopHero);
  hero.addEventListener('focusout', startHero);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopHero(); else startHero(); });
  startHero();
  }

  /* ---------------- Accessible tabs helper (arrow keys) ---------------- */
  function arrowNav(tabs, activate) {
    tabs.forEach(function (tab, i) {
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        tabs[next].focus();
        activate(next);
      });
    });
  }
  function selectTab(tabs, idx) {
    tabs.forEach(function (t, n) {
      var on = n === idx;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
  }

  /* ---------------- Tech tabs ---------------- */
  var techImg = $('#tech-img');
  if (techImg) {
  var techTabs = $$('.tech-tabs [role="tab"]');

  function activateTech(idx) {
    var tab = techTabs[idx];
    selectTab(techTabs, idx);
    techTabs.forEach(function (t) { $('#' + t.getAttribute('aria-controls')).hidden = t !== tab; });
    var src = tab.getAttribute('data-img');
    if (techImg.getAttribute('src') === src) return;
    techImg.classList.add('is-fading');
    setTimeout(function () {
      techImg.src = src;
      techImg.alt = tab.getAttribute('data-alt');
      techImg.classList.remove('is-fading');
    }, reduceMotion ? 0 : 250);
  }
  techTabs.forEach(function (t, i) { t.addEventListener('click', function () { activateTech(i); }); });
  arrowNav(techTabs, activateTech);
  }

  /* ---------------- Gallery (tabbed) + lightbox ---------------- */
  if ($('#gallery-grid')) {
  var GALLERY = {
    space: (function () {
      var list = [];
      for (var i = 1; i <= 17; i++) {
        var n = i < 10 ? '0' + i : String(i);
        list.push({ src: 'photos/gallery-real/real-' + n + '.webp', alt: 'Không gian thực tế tại Xanh Wellness — ảnh ' + i });
      }
      return list;
    })(),
    exp: [
      { src: 'photos/helpspa/cabin-pod.jpg', alt: 'Khách hàng trải nghiệm buồng công nghệ' },
      { src: 'photos/helpspa/cabin-infrared.jpg', alt: 'Buồng hồng ngoại xa toàn thân' },
      { src: 'photos/helpspa/red-light-mat.jpg', alt: 'Ánh sáng trị liệu trong buồng công nghệ' },
      { src: 'photos/helpspa/cabin-blue-light.jpg', alt: 'Buồng công nghệ với ánh sáng dịu' },
      { src: 'photos/helpspa/towel-two-green.jpg', alt: 'Khách hàng thư giãn sau buổi trải nghiệm' },
      { src: 'photos/helpspa/towel-two-brown.jpg', alt: 'Khách hàng tại khu nghỉ Xanh Wellness' },
      { src: 'photos/helpspa/towel-group-lounge.jpg', alt: 'Khu nghỉ chung sau buổi chăm sóc' },
      { src: 'photos/helpspa/foot-bath.jpg', alt: 'Ngâm chân thảo dược' },
      { src: 'photos/helpspa/herbal-tea.jpg', alt: 'Trà 29 loại thảo mộc' },
      { src: 'photos/helpspa/herbal-drink.jpg', alt: 'Bữa ăn thực dưỡng' },
      { src: 'photos/helpspa/reception-1.jpg', alt: 'Tư vấn cùng chuyên viên' },
      { src: 'photos/helpspa/reception-2.jpg', alt: 'Tư vấn dinh dưỡng cá nhân hoá' },
      { src: 'photos/helpspa/omron-scale.jpg', alt: 'Đo 8 chỉ số thể trạng' }
    ]
  };
  var PAGE = 8;
  var galleryGrid = $('#gallery-grid');
  var galleryMore = $('#gallery-more');
  var galleryTabs = $$('.gallery [role="tab"]');
  var currentSet = 'space';
  var expanded = false;

  function renderGallery() {
    var items = GALLERY[currentSet];
    var frag = document.createDocumentFragment();
    items.forEach(function (item, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'gallery-item';
      b.setAttribute('aria-label', 'Phóng to: ' + item.alt);
      b.hidden = !expanded && i >= PAGE;
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      b.appendChild(img);
      b.addEventListener('click', function () { openLightbox(i, b); });
      frag.appendChild(b);
    });
    galleryGrid.replaceChildren(frag);
    galleryMore.hidden = expanded || items.length <= PAGE;
  }

  function activateGallery(idx) {
    selectTab(galleryTabs, idx);
    galleryGrid.setAttribute('aria-labelledby', galleryTabs[idx].id);
    currentSet = galleryTabs[idx].getAttribute('data-set');
    expanded = false;
    renderGallery();
  }
  galleryTabs.forEach(function (t, i) { t.addEventListener('click', function () { activateGallery(i); }); });
  arrowNav(galleryTabs, activateGallery);
  galleryMore.addEventListener('click', function () {
    expanded = true;
    var firstHidden = $('.gallery-item[hidden]', galleryGrid);
    $$('.gallery-item', galleryGrid).forEach(function (b) { b.hidden = false; });
    galleryMore.hidden = true;
    if (firstHidden) firstHidden.focus();
  });
  renderGallery();

  var lb = $('#lightbox');
  var lbImg = $('#lb-img');
  var lbCount = $('#lb-count');
  var lbIndex = 0;
  var lbReturn = null;

  function showLb(i) {
    var items = GALLERY[currentSet];
    lbIndex = (i + items.length) % items.length;
    lbImg.src = items[lbIndex].src;
    lbImg.alt = items[lbIndex].alt;
    lbCount.textContent = (lbIndex + 1) + ' / ' + items.length;
  }
  function openLightbox(i, trigger) {
    lbReturn = trigger;
    showLb(i);
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    $('.lb-close', lb).focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lbReturn) lbReturn.focus();
  }
  $('.lb-close', lb).addEventListener('click', closeLightbox);
  $('.lb-prev', lb).addEventListener('click', function () { showLb(lbIndex - 1); });
  $('.lb-next', lb).addEventListener('click', function () { showLb(lbIndex + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
    else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    else if (e.key === 'Tab') {
      var f = $$('button', lb);
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });
  }

  /* ---------------- Coverage (province grid) ----------------
   * DỮ LIỆU ĐỘ PHỦ — cập nhật thực tế tháng 9/2026
   * open = số cơ sở ĐANG HOẠT ĐỘNG, coming = số cơ sở SẮP MỞ
   * Sửa số liệu: tìm đúng tên tỉnh, đổi "open"/"coming".
   */
  var PROVINCE_DATA = {
    old: [
      {name:"Hà Nội",open:33,coming:15},{name:"An Giang",open:0},{name:"Bà Rịa - Vũng Tàu",open:0},
      {name:"Bạc Liêu",open:0},{name:"Bắc Giang",open:2},{name:"Bắc Kạn",open:0},
      {name:"Bắc Ninh",open:2},{name:"Bến Tre",open:0},{name:"Bình Dương",open:1},
      {name:"Bình Định",open:0},{name:"Bình Phước",open:0},{name:"Bình Thuận",open:0},
      {name:"Cà Mau",open:0},{name:"Cần Thơ",open:0},{name:"Cao Bằng",open:1},
      {name:"Đà Nẵng",open:0},{name:"Đắk Lắk",open:0},{name:"Đắk Nông",open:0},
      {name:"Điện Biên",open:1},{name:"Đồng Nai",open:0},{name:"Đồng Tháp",open:0},
      {name:"Gia Lai",open:0},{name:"Hà Giang",open:4},{name:"Hà Nam",open:1},
      {name:"Hà Tĩnh",open:1},{name:"Hải Dương",open:1},{name:"Hải Phòng",open:2},
      {name:"Hậu Giang",open:0},{name:"Hòa Bình",open:0},{name:"Hưng Yên",open:1},
      {name:"Khánh Hòa",open:0},{name:"Kiên Giang",open:0},{name:"Kon Tum",open:0},
      {name:"Lai Châu",open:0},{name:"Lâm Đồng",open:0},{name:"Lạng Sơn",open:0},
      {name:"Lào Cai",open:0},{name:"Long An",open:0},{name:"Nam Định",open:2},
      {name:"Nghệ An",open:0,coming:1},{name:"Ninh Bình",open:1,coming:1},{name:"Ninh Thuận",open:0},
      {name:"Phú Thọ",open:1},{name:"Phú Yên",open:0},{name:"Quảng Bình",open:0},
      {name:"Quảng Nam",open:0},{name:"Quảng Ngãi",open:0},{name:"Quảng Ninh",open:3},
      {name:"Quảng Trị",open:0},{name:"Sóc Trăng",open:0},{name:"Sơn La",open:0},
      {name:"Tây Ninh",open:0},{name:"Thái Bình",open:1},{name:"Thái Nguyên",open:1},
      {name:"Thanh Hóa",open:2},{name:"Thừa Thiên Huế",open:0},{name:"Tiền Giang",open:0},
      {name:"TP. Hồ Chí Minh",open:0},{name:"Trà Vinh",open:0},{name:"Tuyên Quang",open:0},
      {name:"Vĩnh Long",open:0},{name:"Vĩnh Phúc",open:4},{name:"Yên Bái",open:0}
    ],
    new: [
      {name:"Hà Nội",open:33,coming:15},{name:"Tuyên Quang",open:4},{name:"Lào Cai",open:0},
      {name:"Thái Nguyên",open:1},{name:"Phú Thọ",open:5},{name:"Bắc Ninh",open:4},
      {name:"Hưng Yên",open:2},{name:"Hải Phòng",open:3},{name:"Ninh Bình",open:4,coming:1},
      {name:"Quảng Trị",open:0},{name:"Đà Nẵng",open:0},{name:"Quảng Ngãi",open:0},
      {name:"Gia Lai",open:0},{name:"Khánh Hòa",open:0},{name:"Lâm Đồng",open:0},
      {name:"Đắk Lắk",open:0},{name:"TP. Hồ Chí Minh",open:1},{name:"Đồng Nai",open:0},
      {name:"Tây Ninh",open:0},{name:"Cần Thơ",open:0},{name:"Vĩnh Long",open:0},
      {name:"Đồng Tháp",open:0},{name:"Cà Mau",open:0},{name:"An Giang",open:0},
      {name:"Huế",open:0},{name:"Lai Châu",open:0},{name:"Điện Biên",open:1},
      {name:"Sơn La",open:0},{name:"Lạng Sơn",open:0},{name:"Quảng Ninh",open:3},
      {name:"Thanh Hóa",open:2},{name:"Nghệ An",open:0,coming:1},{name:"Hà Tĩnh",open:1},
      {name:"Cao Bằng",open:1}
    ]
  };

  function getStatus(p) {
    if (p.open >= 2) return 2;
    if (p.open === 1) return 1;
    if (p.coming) return 3;
    return 0;
  }
  function getLabel(p) {
    var status = getStatus(p);
    if (status === 2) return p.open + ' cơ sở' + (p.coming ? ' +' + p.coming + ' sắp mở' : '');
    if (status === 1) return '1 cơ sở' + (p.coming ? ' +' + p.coming + ' sắp mở' : '');
    if (status === 3) return 'Sắp mở (' + p.coming + ')';
    return 'Chưa có';
  }

  /* ---------------- Coverage: homepage bubble map (34 new provinces) ---------------- */
  var vnMap = $('#vn-map');
  var rankList = $('#rank-list');
  if (vnMap && rankList) {
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var vnPaths = $$('.vn-p', vnMap);
  var vnTip = $('#vn-tip');
  var mapData = PROVINCE_DATA['new'];
  var lookup = {};
  mapData.forEach(function (p) { lookup[p.name] = p; });
  // new province -> old provinces it was merged from (read from the map itself)
  var members = {};
  vnPaths.forEach(function (p) {
    var n = p.getAttribute('data-new');
    var o = p.getAttribute('data-old');
    members[n] = members[n] || [];
    if (members[n].indexOf(o) === -1) members[n].push(o); // guard against duplicate paths
  });
  function mergedNote(name) {
    var m = members[name];
    return m && m.length > 1 ? 'Gồm ' + m.join(', ') : '';
  }

  // Provincial capitals (lon, lat) and the same equirectangular projection the SVG was drawn with.
  var CAPITALS = {
    'Hà Nội': [105.84, 21.03], 'Tuyên Quang': [105.22, 21.82], 'Thái Nguyên': [105.84, 21.59],
    'Phú Thọ': [105.40, 21.32], 'Bắc Ninh': [106.19, 21.27], 'Hưng Yên': [106.05, 20.65],
    'Hải Phòng': [106.68, 20.86], 'Ninh Bình': [105.97, 20.25], 'TP. Hồ Chí Minh': [106.70, 10.78],
    'Điện Biên': [103.02, 21.39], 'Quảng Ninh': [107.08, 20.95], 'Thanh Hóa': [105.78, 19.81],
    'Nghệ An': [105.68, 18.67], 'Hà Tĩnh': [105.90, 18.34], 'Cao Bằng': [106.26, 22.67]
  };
  var PROJ_C = Math.cos(16 * Math.PI / 180);
  function project(name) {
    var c = CAPITALS[name];
    if (c) return [(c[0] - 102) * 200 * PROJ_C, (23.5 - c[1]) * 200];
    // fallback for provinces without a listed capital: centre of their outline
    var box = null;
    vnPaths.forEach(function (p) {
      if (p.getAttribute('data-new') !== name) return;
      var b = p.getBBox();
      box = box ? { x0: Math.min(box.x0, b.x), y0: Math.min(box.y0, b.y), x1: Math.max(box.x1, b.x + b.width), y1: Math.max(box.y1, b.y + b.height) }
                : { x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height };
    });
    return box ? [(box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2] : null;
  }

  var present = mapData.filter(function (p) { return (p.open || 0) > 0 || p.coming; });
  present.sort(function (a, b) {
    return (b.open || 0) - (a.open || 0) || (b.coming || 0) - (a.coming || 0) || a.name.localeCompare(b.name, 'vi');
  });
  var totalOpen = 0, totalComing = 0;
  mapData.forEach(function (p) { totalOpen += p.open || 0; totalComing += p.coming || 0; });
  var maxOpen = present.length ? Math.max(1, present[0].open || 0) : 1;
  var R_MAX = 100, R_MIN = 24; // svg units (map is 2499 units wide)
  function radius(n) { return Math.max(R_MIN, R_MAX * Math.sqrt(n / maxOpen)); }

  var statOpen = $('#cov-open'), statComing = $('#cov-coming'), statProv = $('#cov-prov');
  if (statOpen) statOpen.textContent = totalOpen;
  if (statComing) statComing.textContent = totalComing;
  if (statProv) statProv.textContent = present.length;

  // tint provinces that have a location
  vnPaths.forEach(function (p) { p.classList.toggle('is-present', !!lookup[p.getAttribute('data-new')] && present.indexOf(lookup[p.getAttribute('data-new')]) !== -1); });

  // bubbles: largest first so small ones stay on top
  var LABELS = { 'Hà Nội': 'left', 'TP. Hồ Chí Minh': 'right' };
  var gDots = document.createElementNS(SVG_NS, 'g');
  gDots.setAttribute('class', 'vn-dots');
  var gText = document.createElementNS(SVG_NS, 'g');
  gText.setAttribute('class', 'vn-dot-text');
  present.forEach(function (p) {
    var xy = project(p.name);
    if (!xy) return;
    var r = (p.open || 0) > 0 ? radius(p.open) : R_MIN;
    var c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', xy[0].toFixed(1));
    c.setAttribute('cy', xy[1].toFixed(1));
    c.setAttribute('r', r.toFixed(1));
    c.setAttribute('class', 'vn-dot' + ((p.open || 0) > 0 ? '' : ' is-coming'));
    c.setAttribute('data-name', p.name);
    gDots.appendChild(c);
    if (r >= 60) {
      var num = document.createElementNS(SVG_NS, 'text');
      num.setAttribute('x', xy[0].toFixed(1));
      num.setAttribute('y', xy[1].toFixed(1));
      num.setAttribute('class', 'vn-dot-num');
      num.textContent = p.open;
      gText.appendChild(num);
    }
    if (LABELS[p.name]) {
      var left = LABELS[p.name] === 'left';
      var t = document.createElementNS(SVG_NS, 'text');
      t.setAttribute('x', (xy[0] + (left ? -(r + 16) : r + 16)).toFixed(1));
      t.setAttribute('y', xy[1].toFixed(1));
      t.setAttribute('class', 'vn-dot-label');
      t.setAttribute('text-anchor', left ? 'end' : 'start');
      t.textContent = p.name;
      gText.appendChild(t);
    }
  });
  vnMap.appendChild(gDots);
  vnMap.appendChild(gText);
  var vnDots = $$('.vn-dot', vnMap);

  // ranked list
  var maxTotal = present.length ? Math.max.apply(null, present.map(function (p) { return (p.open || 0) + (p.coming || 0); })) : 1;
  var frag = document.createDocumentFragment();
  present.forEach(function (p) {
    var li = document.createElement('li');
    li.className = 'rank-item';
    li.setAttribute('data-name', p.name);
    var head = document.createElement('div');
    head.className = 'rank-head';
    var b = document.createElement('b'); b.textContent = p.name;
    var v = document.createElement('span'); v.className = 'rank-val'; v.textContent = getLabel(p);
    head.appendChild(b); head.appendChild(v);
    var bar = document.createElement('div');
    bar.className = 'rank-bar';
    bar.setAttribute('aria-hidden', 'true');
    if (p.open) { var io = document.createElement('i'); io.style.width = (p.open / maxTotal * 100) + '%'; bar.appendChild(io); }
    if (p.coming) { var ic = document.createElement('i'); ic.className = 'is-coming'; ic.style.width = (p.coming / maxTotal * 100) + '%'; bar.appendChild(ic); }
    li.appendChild(head);
    li.appendChild(bar);
    frag.appendChild(li);
  });
  rankList.replaceChildren(frag);

  /* tooltip + highlight (mouse, touch; the ranked list carries the same data for keyboard/AT) */
  function highlight(key) {
    vnMap.classList.toggle('has-hl', !!key);
    vnPaths.forEach(function (p) { p.classList.toggle('is-hl', !!key && p.getAttribute('data-new') === key); });
    vnDots.forEach(function (d) { d.classList.toggle('is-hl', !!key && d.getAttribute('data-name') === key); });
    $$('.rank-item', rankList).forEach(function (li) { li.classList.toggle('is-hl', !!key && li.getAttribute('data-name') === key); });
  }
  function hideTip() {
    if (vnTip) vnTip.hidden = true;
    highlight(null);
  }
  function showTip(e) {
    var el = e.target.closest ? e.target.closest('.vn-dot, .vn-p') : null;
    if (!el) { hideTip(); return; }
    var key = el.getAttribute(el.classList.contains('vn-dot') ? 'data-name' : 'data-new');
    var rec = lookup[key];
    if (!rec) { hideTip(); return; }
    vnTip.replaceChildren();
    var b = document.createElement('b'); b.textContent = key;
    var s = document.createElement('span'); s.textContent = getLabel(rec);
    vnTip.appendChild(b); vnTip.appendChild(s);
    var note = mergedNote(key);
    if (note) { var sm = document.createElement('small'); sm.textContent = note; vnTip.appendChild(sm); }
    var box = vnTip.parentNode.getBoundingClientRect();
    var x = Math.min(Math.max(e.clientX - box.left, 90), box.width - 90);
    var y = e.clientY - box.top;
    vnTip.style.left = x + 'px';
    vnTip.style.top = y + 'px';
    vnTip.classList.toggle('is-below', y < 110);
    vnTip.hidden = false;
    highlight(key);
  }
  if (vnTip) {
    vnMap.addEventListener('pointermove', showTip);
    vnMap.addEventListener('click', showTip);
    vnMap.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hideTip(); });
    document.addEventListener('click', function (e) { if (!vnMap.contains(e.target)) hideTip(); });
  }
  rankList.addEventListener('mouseover', function (e) {
    var li = e.target.closest('li[data-name]');
    highlight(li ? li.getAttribute('data-name') : null);
  });
  rankList.addEventListener('mouseleave', function () { highlight(null); });
  }

  /* ---------------- Coverage: province chips with old/new toggle (helpspa) ---------------- */
  var provGrid = $('#province-grid');
  if (provGrid) {
  var provSummary = $('#coverage-summary');
  var mapButtons = $$('.map-toggle button');

  function renderProvinces(set) {
    var data = PROVINCE_DATA[set];
    // Provinces with presence first (most locations first), then the rest alphabetically as listed.
    var sorted = data.slice().sort(function (a, b) {
      var sa = (a.open || 0) * 1000 + (a.coming || 0), sb = (b.open || 0) * 1000 + (b.coming || 0);
      return sb - sa || a.name.localeCompare(b.name, 'vi');
    });
    var open = 0, coming = 0, provinces = 0;
    var frag = document.createDocumentFragment();
    sorted.forEach(function (p) {
      open += p.open || 0;
      coming += p.coming || 0;
      if ((p.open || 0) > 0 || p.coming) provinces++;
      var li = document.createElement('li');
      li.className = 'prov st-' + getStatus(p);
      var b = document.createElement('b');
      b.textContent = p.name;
      var s = document.createElement('span');
      s.textContent = getLabel(p);
      li.appendChild(b);
      li.appendChild(s);
      frag.appendChild(li);
    });
    provGrid.replaceChildren(frag);
    if (provSummary) provSummary.innerHTML = '<b>' + open + '</b> cơ sở đang hoạt động · <b>' + coming + '</b> cơ sở sắp mở · có mặt tại <b>' +
      provinces + '</b>/' + data.length + ' tỉnh/thành';
  }

  mapButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      mapButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      renderProvinces(btn.getAttribute('data-set'));
    });
  });
  renderProvinces('old');
  }

  /* ---------------- Testimonials slider ---------------- */
  $$('.testi-wrap').forEach(function (wrap) {
    var track = $('.testi-track', wrap);
    var prevBtn = $('.testi-prev', wrap);
    var nextBtn = $('.testi-next', wrap);
    var navBar = $('.slider-nav', wrap);
    if (!track || !prevBtn || !nextBtn) return;

    function step() {
      var card = $('.testi', track);
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    }
    function updateArrows() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= max;
      if (navBar) navBar.hidden = track.scrollWidth <= track.clientWidth + 2;
    }
    prevBtn.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    nextBtn.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  });

  /* ---------------- Decorative autoplay videos ----------------
     Respect reduced motion: stop autoplay and show controls instead. */
  if (reduceMotion) {
    $$('video.js-autoplay').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
      v.controls = true;
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
