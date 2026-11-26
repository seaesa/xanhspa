/* Xanh Wellness — bài đánh giá sức khỏe 8 câu (danh-gia-suc-khoe.html) */
(function () {
  'use strict';

  var QUESTIONS = [
    { text: 'Mức năng lượng của Anh/Chị trong một ngày bình thường?',
      options: ['Rất dồi dào, ít khi mệt', 'Có hôm khỏe hôm mệt', 'Thường xuyên thấy mệt, uể oải'] },
    { text: 'Giấc ngủ gần đây của Anh/Chị thế nào?',
      options: ['Ngủ sâu, đủ giấc', 'Ngủ được nhưng hay thức giấc', 'Khó ngủ hoặc ngủ không sâu'] },
    { text: 'Anh/Chị có đang muốn thay đổi vóc dáng không?',
      options: ['Không, chỉ muốn duy trì', 'Có, muốn cải thiện nhẹ', 'Có, muốn thay đổi rõ rệt'] },
    { text: 'Tần suất vận động của Anh/Chị trong tuần?',
      options: ['Đều đặn 3 lần/tuần trở lên', 'Thỉnh thoảng', 'Gần như không vận động'] },
    { text: 'Anh/Chị có thường xuyên thấy căng thẳng, áp lực không?',
      options: ['Hiếm khi', 'Thỉnh thoảng', 'Gần như mỗi ngày'] },
    { text: 'Anh/Chị có hay đau mỏi vai gáy, lưng, hoặc khớp không?',
      options: ['Không', 'Thỉnh thoảng', 'Thường xuyên'] },
    { text: 'Anh/Chị đã từng thử phương pháp chăm sóc/giảm cân nào chưa?',
      options: ['Chưa từng', 'Có thử nhưng chưa như ý', 'Thử nhiều cách, chưa hiệu quả lâu dài'] },
    { text: 'Anh/Chị sẵn sàng đầu tư thời gian chăm sóc bản thân ở mức nào?',
      options: ['Nhẹ nhàng, duy trì đều đặn', 'Sẵn sàng đầu tư vừa phải', 'Muốn thay đổi nhanh, đầu tư nghiêm túc'] }
  ]; /* Mỗi câu: lựa chọn thứ 1/2/3 = 0/1/2 điểm */

  var TIERS = {
    bao: {
      name: 'Gói Bảo Dưỡng',
      headline: 'Cơ thể Anh/Chị đang ở mức ổn định, phù hợp bắt đầu nhẹ nhàng.',
      sub: 'Gói Bảo Dưỡng giúp giữ form, duy trì sức khỏe đều đặn — phù hợp cho người mới bắt đầu chăm sóc bản thân, không cần áp lực.',
      gifts: ['Trà', 'Hydrate', 'F1', 'Rebuild'],
      benefits: [
        'Thanh lọc nhẹ nhàng, giúp cơ thể "dễ thở" hơn sau những ngày căng thẳng',
        'Bổ sung nước & điện giải, giảm mệt mỏi, uể oải',
        'Kiểm soát cân nặng ở mức ổn định, hạn chế tăng cân trở lại',
        'Phục hồi cơ bản cho cơ thể, đặc biệt với người ít vận động hoặc mới bắt đầu',
        'Giảm stress nhẹ, ngủ dễ hơn, tinh thần thoải mái hơn'
      ],
      fits: ['Người muốn duy trì sức khỏe', 'Người mới bắt đầu chăm sóc cơ thể', 'Người cần nhẹ nhàng, không áp lực'],
      price: '5.640.000đ/tháng (30 buổi) — khoảng 188.000đ/buổi'
    },
    chuyen: {
      name: 'Gói Chuyên Sâu',
      headline: 'Cơ thể Anh/Chị đang cần một mức chăm sóc sâu hơn.',
      sub: 'Gói Chuyên Sâu tập trung cải thiện tiêu hoá, bắt đầu thấy rõ thay đổi về cân nặng và số đo.',
      gifts: ['Trà', 'Aloe', 'Hydrate', 'F1', 'Rebuild', 'Xơ hoạt hoá'],
      benefits: [
        'Thanh lọc cơ thể sâu hơn, hỗ trợ đào thải độc tố tích tụ',
        'Cải thiện hệ tiêu hoá: giảm đầy bụng, táo bón, hấp thu tốt hơn',
        'Bắt đầu có sự thay đổi rõ về cân nặng và số đo',
        'Giảm mỡ nhẹ, cơ thể gọn gàng hơn từng tuần',
        'Tăng năng lượng, giảm mệt mỏi kéo dài',
        'Ngủ sâu hơn, tinh thần ổn định hơn'
      ],
      fits: ['Người muốn thấy kết quả rõ ràng hơn', 'Người có vấn đề về tiêu hoá', 'Người muốn bắt đầu thay đổi vóc dáng'],
      price: '7.890.000đ/tháng (30 buổi) — khoảng 263.000đ/buổi'
    },
    vip: {
      name: 'Gói VIP',
      headline: 'Anh/Chị đang ở mức sẵn sàng cho một lộ trình thay đổi rõ rệt.',
      sub: 'Gói VIP đẩy mạnh quá trình đốt mỡ, đặc biệt vùng bụng, kết hợp giữ cơ săn chắc.',
      gifts: ['Trà', 'Aloe', 'Hydrate', 'F1', 'Rebuild', 'Xơ hoạt hoá', 'Cell U-Loss', 'Cell Activator', 'Omega 3'],
      benefits: [
        'Đẩy mạnh quá trình đốt mỡ, đặc biệt vùng bụng và mỡ nội tạng',
        'Tăng hấp thu dinh dưỡng ở cấp độ tế bào — cơ thể "ăn ít mà vẫn đủ chất"',
        'Giúp cơ thể săn chắc, hạn chế mất cơ khi giảm cân',
        'Hỗ trợ tim mạch, tuần hoàn, giảm tình trạng mệt khi vận động',
        'Da dẻ sáng hơn, cơ thể có sức sống hơn',
        'Tăng năng lượng rõ rệt, làm việc và tập luyện hiệu quả hơn'
      ],
      fits: ['Người muốn thay đổi vóc dáng rõ rệt', 'Người giảm mỡ nhưng vẫn muốn giữ cơ', 'Người cần cải thiện sức khỏe tổng thể'],
      price: '10.660.000đ/tháng (30 buổi) — khoảng 355.000đ/buổi'
    },
    vvip: {
      name: 'Gói V-VIP',
      headline: 'Anh/Chị đang cần một lộ trình toàn diện, tốc độ nhanh hơn.',
      sub: 'Gói V-VIP là mức chăm sóc cao nhất — kết hợp cải thiện toàn diện vóc dáng, sức khỏe và tinh thần.',
      gifts: ['Trà', 'Aloe', 'Hydrate', 'F1', 'Rebuild', 'Xơ hoạt hoá', 'Cell U-Loss', 'Cell Activator', 'Omega 3', 'Networks', 'Bữa ăn chiều đốt đạm'],
      benefits: [
        'Giảm mỡ nhanh – sâu – bền vững (đặc biệt mỡ lâu năm)',
        'Tăng tuần hoàn máu, hỗ trợ tim mạch và phục hồi cơ thể tốt hơn',
        'Cải thiện giấc ngủ sâu, cơ thể tái tạo tốt vào ban đêm',
        'Tăng cơ – giữ cơ hiệu quả nhờ bổ sung đủ đạm',
        'Nâng cao toàn diện vóc dáng – sức khỏe – tinh thần',
        'Giảm nguy cơ mệt mỏi, kiệt sức khi giảm cân nhanh'
      ],
      fits: ['Người muốn thay đổi toàn diện trong thời gian ngắn', 'Người cần kết hợp vóc dáng & sức khỏe', 'Người cần hiệu quả nhanh nhưng vẫn an toàn & bền'],
      price: '14.990.000đ/tháng (30 buổi) — khoảng 500.000đ/buổi'
    }
  };

  /* Câu 3 (vóc dáng), câu 7 (đã thử phương pháp), câu 8 (mức đầu tư) dùng để cá nhân hoá lý do gợi ý. */
  var VOC_DANG = ['chỉ muốn duy trì vóc dáng hiện tại', 'muốn cải thiện vóc dáng ở mức nhẹ', 'muốn thay đổi vóc dáng rõ rệt'];
  var DAU_TU = ['muốn nhẹ nhàng, duy trì đều đặn', 'sẵn sàng đầu tư ở mức vừa phải', 'muốn thay đổi nhanh, đầu tư nghiêm túc'];
  var DA_THU = ['chưa từng thử phương pháp nào trước đây', 'đã thử nhưng chưa như ý', 'đã thử nhiều cách nhưng chưa hiệu quả lâu dài'];

  var $ = function (id) { return document.getElementById(id); };
  var root = $('quiz');
  if (!root) return;

  var answers = QUESTIONS.map(function () { return null; });
  var tierKey = null;
  var leadName = '';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var progress = $('quiz-progress');
  var progressFill = $('quiz-progress-fill');
  var screens = Array.prototype.slice.call(root.querySelectorAll('.quiz-screen'));

  function setProgress(done) {
    var pct = Math.round(done / QUESTIONS.length * 100);
    progressFill.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', String(pct));
  }

  function show(id) {
    screens.forEach(function (s) { s.hidden = s.id !== id; });
    var target = $(id);
    var heading = target.querySelector('[data-focus]');
    if (heading) heading.focus({ preventScroll: true });
    var top = root.getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function score() { return answers.reduce(function (a, b) { return a + (b || 0); }, 0); }
  function computeTier() {
    var s = score();
    if (s <= 4) return 'bao';
    if (s <= 8) return 'chuyen';
    if (s <= 12) return 'vip';
    return 'vvip';
  }

  /* ----- Build question screens ----- */
  var wrap = $('quiz-questions');
  QUESTIONS.forEach(function (q, i) {
    var sec = document.createElement('section');
    sec.className = 'quiz-screen';
    sec.id = 'quiz-q' + i;
    sec.hidden = true;

    var count = document.createElement('p');
    count.className = 'quiz-count';
    count.textContent = 'Câu ' + (i + 1) + ' / ' + QUESTIONS.length;

    var h = document.createElement('h2');
    h.className = 'quiz-question';
    h.id = 'quiz-q' + i + '-title';
    h.tabIndex = -1;
    h.setAttribute('data-focus', '');
    h.textContent = q.text;

    var opts = document.createElement('div');
    opts.className = 'quiz-options';
    opts.setAttribute('role', 'group');
    opts.setAttribute('aria-labelledby', h.id);

    q.options.forEach(function (label, v) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'quiz-opt';
      b.setAttribute('aria-pressed', 'false');
      var mark = document.createElement('span');
      mark.className = 'quiz-opt-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = String.fromCharCode(65 + v);
      var txt = document.createElement('span');
      txt.textContent = label;
      b.appendChild(mark);
      b.appendChild(txt);
      b.addEventListener('click', function () { choose(i, v, opts); });
      opts.appendChild(b);
    });

    sec.appendChild(count);
    sec.appendChild(h);
    sec.appendChild(opts);

    if (i > 0) {
      var back = document.createElement('button');
      back.type = 'button';
      back.className = 'quiz-back';
      back.textContent = '← Câu trước';
      back.addEventListener('click', function () { goTo(i - 1); });
      sec.appendChild(back);
    }
    wrap.appendChild(sec);
  });
  screens = Array.prototype.slice.call(root.querySelectorAll('.quiz-screen'));

  var busy = false;
  function choose(i, v, opts) {
    if (busy) return;
    busy = true;
    answers[i] = v;
    Array.prototype.forEach.call(opts.children, function (b, n) {
      b.classList.toggle('is-selected', n === v);
      b.setAttribute('aria-pressed', String(n === v));
    });
    setTimeout(function () {
      busy = false;
      if (i < QUESTIONS.length - 1) goTo(i + 1);
      else { setProgress(QUESTIONS.length); showTeaser(); }
    }, reduceMotion ? 0 : 240);
  }
  function goTo(i) { setProgress(i); show('quiz-q' + i); }

  $('quiz-start').addEventListener('click', function () { goTo(0); });

  /* ----- Teaser + lead gate ----- */
  function setBadge(el) {
    el.textContent = TIERS[tierKey].name;
    el.className = 'tier-badge tier-badge--' + tierKey;
  }
  function showTeaser() {
    tierKey = computeTier();
    setBadge($('tier-badge'));
    $('tier-headline').textContent = TIERS[tierKey].headline;
    $('tier-sub').textContent = TIERS[tierKey].sub;
    show('quiz-teaser');
  }
  $('quiz-redo').addEventListener('click', function () { goTo(QUESTIONS.length - 1); });

  var form = $('gate-form');
  var err = $('gate-error');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('lead-name').value.trim();
    var phone = $('lead-phone').value.trim();
    var msg = '';
    if (!name) msg = 'Vui lòng nhập họ và tên.';
    else if (!window.XanhLead.isValidPhone(phone)) msg = 'Số điện thoại chưa đúng — vui lòng kiểm tra lại (ví dụ 0966 859 963).';
    $('lead-name').setAttribute('aria-invalid', String(!name));
    $('lead-phone').setAttribute('aria-invalid', String(!!name && !!msg));
    err.textContent = msg;
    err.hidden = !msg;
    if (msg) { (name ? $('lead-phone') : $('lead-name')).focus(); return; }

    leadName = name;
    window.XanhLead.send({
      name: name,
      phone: window.XanhLead.normalizePhone(phone),
      tier: tierKey,
      score: score(),
      source: 'danh-gia-suc-khoe'
    });
    show('quiz-zalo');
  });

  /* ----- Final result ----- */
  function fillList(id, items) {
    var ul = $(id);
    ul.replaceChildren();
    items.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
  }
  $('reveal-final').addEventListener('click', function () {
    var t = TIERS[tierKey];
    setBadge($('tier-badge-final'));
    $('final-why').textContent = 'Vì sao là ' + t.name + '?';
    $('final-reason').textContent = 'Dựa trên câu trả lời của Anh/Chị — ' + VOC_DANG[answers[2]] + ', ' + DAU_TU[answers[7]] +
      ', và ' + DA_THU[answers[6]] + ' — nên Xanh Wellness gợi ý nhóm "' + t.fits[0] + '" mà gói này hướng tới.';
    $('final-price').textContent = t.price;
    fillList('final-gifts', t.gifts);
    fillList('final-benefits', t.benefits);
    fillList('final-fits', t.fits);
    $('zalo-message').value = 'Chào Xanh Wellness, ' + (leadName || 'tôi') + ' vừa làm bài đánh giá sức khỏe và được gợi ý ' +
      t.name + '. Tôi muốn đặt lịch tư vấn.';
    show('quiz-final');
  });

  var copyBtn = $('copy-btn');
  copyBtn.addEventListener('click', function () {
    var ta = $('zalo-message');
    function done() {
      copyBtn.textContent = 'Đã copy ✓';
      setTimeout(function () { copyBtn.textContent = 'Copy nội dung'; }, 2000);
    }
    ta.select();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(ta.value).then(done, function () { document.execCommand('copy'); done(); });
    } else { document.execCommand('copy'); done(); }
  });

  $('quiz-restart').addEventListener('click', function () {
    answers = answers.map(function () { return null; });
    Array.prototype.forEach.call(root.querySelectorAll('.quiz-opt'), function (b) {
      b.classList.remove('is-selected'); b.setAttribute('aria-pressed', 'false');
    });
    goTo(0);
  });
})();
