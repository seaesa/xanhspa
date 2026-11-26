/* Xanh Wellness — gửi thông tin khách để lại (đánh giá sức khỏe, tư vấn).
 * LEAD_ENDPOINT: Google Apps Script nhận dữ liệu (giữ nguyên endpoint đang dùng).
 * Đổi sang endpoint của bạn tại đây nếu cần; để chuỗi rỗng để tắt gửi. */
(function () {
  'use strict';
  var LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyUePyta4KgclYjkZ7XXsMThYs9iYtfJBc5OGFlhb8t57lCR_4u6YBW9ZrH6nd72eQX/exec';

  function normalizePhone(v) { return String(v || '').replace(/[\s.\-()]/g, ''); }

  window.XanhLead = {
    /* Số điện thoại Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx (9–10 số sau đầu số). */
    isValidPhone: function (v) { return /^(\+?84|0)\d{9,10}$/.test(normalizePhone(v)); },
    normalizePhone: normalizePhone,
    /* Gửi kiểu "simple request" (text/plain) để Apps Script nhận được mà không cần preflight CORS. */
    send: function (payload) {
      if (!LEAD_ENDPOINT) return Promise.resolve();
      return fetch(LEAD_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).catch(function () {});
    }
  };
})();
