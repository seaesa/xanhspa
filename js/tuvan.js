/* Xanh Wellness — form tư vấn nhanh (tuvan.html) */
(function () {
  'use strict';
  var form = document.getElementById('tv-form');
  if (!form) return;
  var err = document.getElementById('tv-error');
  var name = document.getElementById('tv-name');
  var phone = document.getElementById('tv-phone');
  var shop = document.getElementById('tv-shop');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = name.value.trim();
    var p = phone.value.trim();
    var msg = '';
    if (!n) msg = 'Vui lòng nhập họ và tên.';
    else if (!window.XanhLead.isValidPhone(p)) msg = 'Số điện thoại chưa đúng — vui lòng kiểm tra lại (ví dụ 0966 859 963).';
    name.setAttribute('aria-invalid', String(!n));
    phone.setAttribute('aria-invalid', String(!!n && !!msg));
    err.textContent = msg;
    err.hidden = !msg;
    if (msg) { (n ? phone : name).focus(); return; }

    var btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Đang gửi…';
    window.XanhLead.send({
      name: n,
      phone: window.XanhLead.normalizePhone(p),
      shop: shop.value.trim(),
      source: 'tu-van-nhanh'
    }).then(function () {
      document.getElementById('tv-form-screen').hidden = true;
      var done = document.getElementById('tv-done');
      done.hidden = false;
      done.querySelector('[data-focus]').focus();
    });
  });
})();
