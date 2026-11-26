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

  var provGrid = $('#province-grid');
  if (provGrid) {
  var provSummary = $('#coverage-summary');
  var mapButtons = $$('.map-toggle button');
  var restBox = $('#coverage-rest');
  var vnMap = $('#vn-map');
  var vnPaths = vnMap ? $$('.vn-p', vnMap) : [];
  var vnTip = $('#vn-tip');
  var currentSet = 'old';
  var lookup = {};
  // new province -> old provinces it was merged from (read from the map itself)
  var members = {};
  vnPaths.forEach(function (p) {
    var n = p.getAttribute('data-new');
    var o = p.getAttribute('data-old');
    members[n] = members[n] || [];
    if (members[n].indexOf(o) === -1) members[n].push(o); // inset repeats some provinces
  });

  function renderProvinces(set) {
    var data = PROVINCE_DATA[set];
    // Provinces with presence first (most locations first), then the rest alphabetically as listed.
    var sorted = data.slice().sort(function (a, b) {
      var sa = (a.open || 0) * 1000 + (a.coming || 0), sb = (b.open || 0) * 1000 + (b.coming || 0);
      return sb - sa || a.name.localeCompare(b.name, 'vi');
    });
    var open = 0, coming = 0, provinces = 0, rest = [];
    var frag = document.createDocumentFragment();
    currentSet = set;
    lookup = {};
    sorted.forEach(function (p) {
      lookup[p.name] = p;
      open += p.open || 0;
      coming += p.coming || 0;
      var present = (p.open || 0) > 0 || p.coming;
      if (present) provinces++;
      // With the map + "rest" box, the list only shows provinces that have (or will have) a location.
      if (restBox && !present) { rest.push(p.name); return; }
      var li = document.createElement('li');
      li.className = 'prov st-' + getStatus(p);
      li.setAttribute('data-name', p.name);
      var b = document.createElement('b');
      b.textContent = p.name;
      var s = document.createElement('span');
      s.textContent = getLabel(p);
      li.appendChild(b);
      li.appendChild(s);
      frag.appendChild(li);
    });
    provGrid.replaceChildren(frag);
    if (restBox) {
      rest.sort(function (a, b) { return a.localeCompare(b, 'vi'); });
      restBox.querySelector('summary').textContent = 'Các tỉnh/thành chưa có cơ sở (' + rest.length + ')';
      restBox.querySelector('p').textContent = rest.join(', ') + '.';
    }
    if (vnMap) {
      vnMap.classList.toggle('is-new', set === 'new');
      vnPaths.forEach(function (path) {
        var rec = lookup[path.getAttribute(set === 'new' ? 'data-new' : 'data-old')];
        path.setAttribute('class', 'vn-p st-' + (rec ? getStatus(rec) : 0));
      });
      hideTip();
    }
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
  /* Map tooltip + highlight (mouse, touch; the list beside the map carries the same data for keyboard/AT) */
  function keyOf(path) { return path.getAttribute(currentSet === 'new' ? 'data-new' : 'data-old'); }
  function highlight(key) {
    if (!vnMap) return;
    vnMap.classList.toggle('has-hl', !!key);
    vnPaths.forEach(function (p) { p.classList.toggle('is-hl', !!key && keyOf(p) === key); });
  }
  function hideTip() {
    if (vnTip) vnTip.hidden = true;
    highlight(null);
  }
  function showTip(e) {
    var path = e.target.closest ? e.target.closest('.vn-p') : null;
    if (!path) { hideTip(); return; }
    var key = keyOf(path);
    var rec = lookup[key];
    if (!rec) return;
    var extra = '';
    if (currentSet === 'new' && members[key] && members[key].length > 1) {
      extra = 'Gồm: ' + members[key].join(', ');
    } else if (currentSet === 'old' && path.getAttribute('data-new') !== key) {
      extra = 'Từ 7/2025 thuộc ' + path.getAttribute('data-new');
    } else if (currentSet === 'old' && members[key] && members[key].length > 1) {
      extra = 'Từ 7/2025 sáp nhập thêm ' + members[key].filter(function (n) { return n !== key; }).join(', ');
    }
    vnTip.replaceChildren();
    var b = document.createElement('b'); b.textContent = key;
    var s = document.createElement('span'); s.textContent = getLabel(rec);
    vnTip.appendChild(b); vnTip.appendChild(s);
    if (extra) { var sm = document.createElement('small'); sm.textContent = extra; vnTip.appendChild(sm); }
    var box = vnTip.parentNode.getBoundingClientRect();
    var x = Math.min(Math.max(e.clientX - box.left, 90), box.width - 90);
    var y = e.clientY - box.top;
    vnTip.style.left = x + 'px';
    vnTip.style.top = y + 'px';
    vnTip.classList.toggle('is-below', y < 110);
    vnTip.hidden = false;
    highlight(key);
  }
  if (vnMap && vnTip) {
    vnMap.addEventListener('pointermove', showTip);
    vnMap.addEventListener('click', showTip);
    vnMap.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hideTip(); });
    document.addEventListener('click', function (e) { if (!vnMap.contains(e.target)) hideTip(); });
    provGrid.addEventListener('mouseover', function (e) {
      var li = e.target.closest('li[data-name]');
      highlight(li ? li.getAttribute('data-name') : null);
    });
    provGrid.addEventListener('mouseleave', function () { highlight(null); });
  }

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
