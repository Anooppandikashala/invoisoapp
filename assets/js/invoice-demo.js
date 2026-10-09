// Animated invoice-creation walkthrough (mirrors the app's CreateInvoiceScreenV2).
// Mounts over every [data-invoice-demo] host once the page has loaded; the host's
// static screenshot stays underneath as the no-JS / reduced-motion fallback.
// Theme follows the host's data-demo-theme="dark" attribute (light otherwise).
(function () {
  var hosts = document.querySelectorAll('[data-invoice-demo]');
  if (!hosts.length || !window.ResizeObserver || !window.IntersectionObserver) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var W = 960;
  // name, price, stock, HSN
  var PRODUCTS = [['DELL Monitor', 2555, 188, '8528'], ['Dell Mouse', 200, 144, '8471'], ['DELL Keyboard', 345, 64, '8471']];
  var CUSTOMER = { name: 'John', business: 'John Traders', phone: '896234170', gst: '32ABCDE1234F1Z5', email: 'john@gmail.com', address: 'Kochi, Kerala' };

  function money(n) { return 'Rs.' + n.toFixed(2); }
  function nav(icon, label, key) {
    return '<div class="iv-nav"' + (key ? ' data-k="' + key + '"' : '') + '><i class="fas ' + icon + '"></i>' + label + '</div>';
  }
  function stat(icon, color, label, value) {
    return '<div class="iv-card iv-stat"><i class="fas ' + icon + '" style="--c:' + color + '"></i><span><small>' + label + '</small><b>' + value + '</b></span></div>';
  }
  function recent(no, who, amt, paid) {
    return '<div class="iv-tr"><b>#' + no + '</b><span>' + who + '</span><span>' + amt + '</span><em class="iv-pill' + (paid ? '' : ' is-due') + '">' + (paid ? 'Paid' : 'Unpaid') + '</em></div>';
  }
  function field(label, key, value, extra) {
    return '<div class="iv-f' + (extra || '') + '"><label>' + label + '</label><span' + (key ? ' data-f="' + key + '"' : '') + '>' + (value || '') + '</span></div>';
  }
  function custTile(name, sub, key) {
    return '<div class="iv-li"' + (key ? ' data-cust' : '') + '><b class="iv-av">' + name[0] + '</b><span>' + name + '<small>' + sub + '</small></span><i class="fas fa-circle-check iv-ok"></i></div>';
  }
  function tile(icon, color, label, key) {
    return '<div class="iv-tile" style="--c:' + color + '"' + (key ? ' ' + key : '') + '><i class="fas ' + icon + '"></i><span>' + label + '</span></div>';
  }

  var TPL =
    '<div class="iv-title"><span class="iv-cap"></span>invoiso<span class="iv-win"><span></span><span></span><span></span></span></div>' +
    '<div class="iv-body">' +
      '<div class="iv-side">' +
        '<div class="iv-logo"></div>' +
        nav('fa-table-cells-large', 'Dashboard', 'dash') + nav('fa-file-circle-plus', 'New Invoice', 'new') +
        nav('fa-file-invoice', 'Invoices') + nav('fa-file-lines', 'Quotations') + nav('fa-receipt', 'Receipts') +
        nav('fa-users', 'Customers') + nav('fa-box', 'Products') + nav('fa-chart-simple', 'Reports') + nav('fa-gear', 'Settings') +
        '<div class="iv-user"><b class="iv-av">A</b><span>admin<small>Admin</small></span></div>' +
      '</div>' +
      '<div class="iv-main">' +
        '<div class="iv-head"><span></span><span>Dashboard Overview</span><span></span></div>' +

        '<div class="iv-scene" data-s="dash">' +
          '<div class="iv-welcome"><div><b>Welcome back, admin</b><small>Here\'s your business at a glance</small></div><div><small data-day></small><b data-date></b></div></div>' +
          '<div class="iv-stats">' +
            stat('fa-wallet', '#8b5cf6', 'Revenue Collected', 'Rs. 1.24L') + stat('fa-hourglass-half', '#ef4444', 'Outstanding', 'Rs. 38.5K') +
            stat('fa-file-invoice', '#f97316', 'Total Invoices', '134') + stat('fa-users', '#3b82f6', 'Customers', '42') + stat('fa-box', '#22c55e', 'Products', '55') +
          '</div>' +
          '<div class="iv-row">' +
            '<div class="iv-card"><h4>Revenue — Last 6 Months</h4><div class="iv-bars"><span style="--h:38%"></span><span style="--h:52%"></span><span style="--h:45%"></span><span style="--h:68%"></span><span style="--h:60%"></span><span style="--h:88%"></span></div>' +
              '<div class="iv-months"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div></div>' +
            '<div class="iv-card"><h4>Financial Overview</h4><div class="iv-donut"></div>' +
              '<p class="iv-legend"><span class="iv-dot" style="--c:#22c55e"></span>Collected<b>Rs. 1.24L</b></p><p class="iv-legend"><span class="iv-dot" style="--c:#ef4444"></span>Outstanding<b>Rs. 38.5K</b></p></div>' +
          '</div>' +
          '<div class="iv-card"><h4>Recent Invoices</h4>' +
            recent('00000034', 'John', 'Rs. 401.20', true) + recent('00000033', 'Abin', 'Rs. 1,250.00', false) + recent('00000032', 'Meera', 'Rs. 8,960.00', true) +
          '</div>' +
        '</div>' +

        '<div class="iv-scene" data-s="new">' +
          '<div class="iv-col">' +
            '<div class="iv-card">' +
              '<h4 class="iv-sec"><i class="far fa-user"></i>CUSTOMER DETAILS<span class="iv-obtn" data-pick><i class="fas fa-magnifying-glass"></i>Select from existing</span><i class="fas fa-chevron-up iv-mut"></i></h4>' +
              '<p class="iv-hint" data-hint>New or walk-in customer — enter their details below.</p>' +
              '<div class="iv-g3">' + field('Customer Name *', 'name') + field('Business Name', 'business') + field('Phone', 'phone') +
                field('GSTIN/VAT', 'gst') + field('Email', 'email') + field('Address', 'address') + '</div>' +
            '</div>' +
            '<div class="iv-card iv-items">' +
              '<h4 class="iv-sec">ITEMS<em class="iv-count" data-count>0 items</em></h4>' +
              '<div class="iv-rows" data-rows><div class="iv-empty"><i class="fas fa-cart-shopping"></i><span>No items added yet</span><small>Search below or press Ctrl+F</small></div></div>' +
              '<div class="iv-drop" data-drop></div>' +
              '<div class="iv-quick"><div class="iv-f iv-search" data-search><i class="fas fa-magnifying-glass"></i><span data-q></span><label>Search product</label></div><span class="iv-obtn"><i class="fas fa-plus"></i>Custom item (Ctrl+M)</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="iv-col">' +
            '<div class="iv-card"><h4 class="iv-sec">INVOICE DETAILS<i class="fas fa-chevron-up iv-mut"></i></h4>' +
              '<div class="iv-g2">' + field('Order date', 0, '<span data-date></span>') + field('Due date') + '</div>' + field('Invoice type', 0, 'Invoice') +
            '</div>' +
            '<div class="iv-card iv-panel">' +
              '<div class="iv-pbody">' +
                '<p class="iv-lbl">PAYMENT</p><div class="iv-seg"><span class="is-on">Unpaid</span><span>Partial</span><span>Paid</span></div>' +
                '<p class="iv-lbl">NOTES</p>' + field('Notes (optional)', 0, 'Thank you for your business!') +
                '<p class="iv-lbl">TAX SETTINGS</p><div class="iv-toggle">Enable tax<span></span></div>' + field('Default tax rate', 0, '18.0 %') +
              '</div>' +
              '<div class="iv-totals"><p>Subtotal<b data-t="sub">Rs.0.00</b></p><p>Tax<b data-t="tax">Rs.0.00</b></p><p class="iv-total">Total<b data-t="total">Rs.0.00</b></p></div>' +
            '</div>' +
          '</div>' +
          '<div class="iv-actions">' +
            tile('fa-eye', '#22c55e', 'View') + tile('fa-file-pdf', '#a855f7', 'Preview') + tile('fa-download', '#7c3aed', 'Download') + tile('fa-print', '#3b82f6', 'Print') +
            '<span class="iv-btn" data-create><i class="far fa-floppy-disk"></i><span>Create Invoice (Ctrl+S)</span></span>' +
          '</div>' +
        '</div>' +

        '<div class="iv-scene" data-s="done"><div class="iv-done">' +
          '<div class="iv-check"><i class="fas fa-circle-check"></i></div>' +
          '<b class="iv-done-h">Invoice Created Successfully!</b><span class="iv-chip">Invoice ID: #00000035</span>' +
          '<div class="iv-tiles">' + tile('fa-eye', '#22c55e', 'View Details') + tile('fa-file-pdf', '#a855f7', 'Preview PDF', 'data-preview') +
            tile('fa-download', '#7c3aed', 'Download PDF') + tile('fa-print', '#3b82f6', 'Print PDF') + '</div>' +
          '<span class="iv-btn"><i class="fas fa-circle-plus"></i>Create New Invoice</span>' +
        '</div></div>' +

        '<div class="iv-scene iv-dlg-wrap" data-s="cust"><div class="iv-dlg">' +
          '<h4>Choose a customer<i class="fas fa-xmark"></i></h4>' +
          '<div class="iv-f iv-search"><i class="fas fa-magnifying-glass"></i><label>Search customer</label></div>' +
          custTile('John', 'John Traders  •  896234170', 1) + custTile('Abin', '8795632410') + custTile('Meera', 'Meera Stores  •  9847012345') +
        '</div></div>' +

        '<div class="iv-scene iv-dlg-wrap" data-s="add"><div class="iv-dlg">' +
          '<h4><b class="iv-dlg-ic"><i class="fas fa-cart-shopping"></i></b><span data-ptitle></span></h4>' +
          '<span class="iv-stock" data-pstock></span>' +
          field('Quantity', 'qty', '', ' iv-qty') + field('Discount', 0, '0') + field('Unit Price (override)', 'unit') +
          '<div class="iv-dlg-btns"><span>Cancel</span><span class="iv-btn" data-add>Add</span></div>' +
        '</div></div>' +

        '<div class="iv-scene iv-dlg-wrap" data-s="pdf"><div class="iv-modal">' +
          '<div class="iv-mbar"><span>Invoice #00000035</span><i class="fas fa-print"></i><i class="fas fa-download" data-dl></i><i class="fas fa-xmark"></i></div>' +
          '<div class="iv-paper">' +
            '<div class="iv-ph"><div class="iv-plogo"></div><div><b>INV-00000035</b><br><span data-date></span></div></div>' +
            '<div class="iv-parties"><div>FROM<br><b>Your Business</b><br>9745244240</div><div>BILL TO<br><b>John</b><br>John Traders<br>896234170</div></div>' +
            '<div class="iv-tr2 iv-thead"><span>#</span><span>Item Name</span><span>Qty</span><span>Price</span><span>Total</span></div>' +
            '<div class="iv-tr2"><span>1</span><span>DELL Monitor</span><span>1</span><span>2,555.00</span><span>2,555.00</span></div>' +
            '<div class="iv-tr2"><span>2</span><span>Dell Mouse</span><span>2</span><span>200.00</span><span>400.00</span></div>' +
            '<div class="iv-ptot"><p>Subtotal<span>Rs. 2,955.00</span></p><p>Tax (18%)<span>Rs. 531.90</span></p><p>Total<span>Rs. 3,486.90</span></p></div>' +
          '</div></div></div>' +
      '</div>' +
    '</div>' +
    '<div class="iv-toast"><i class="fas fa-circle-check"></i>Saved inv-35-john.pdf</div>' +
    '<div class="iv-cursor"><svg viewBox="0 0 18 18"><path d="M1 1l5.5 15 2.2-6.3L15 7.5z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg></div>';

  function mount(host) {
    var wrap, stage, timers = [], running = false, inView = false, scale = 1, cx = 0, cy = 0, sub = 0;

    function $(sel) { return stage.querySelector(sel); }
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function stop() { running = false; timers.forEach(clearTimeout); timers = []; }
    function start() { if (running || !inView || document.hidden) return; running = true; play(); }
    function fit() { scale = wrap.clientWidth / W; stage.style.transform = 'scale(' + scale + ')'; }

    function on(key, yes) { $('[data-s="' + key + '"]').classList.toggle('is-on', yes); }
    function head(l, c, r) {
      var s = stage.querySelectorAll('.iv-head span');
      s[0].textContent = l; s[1].textContent = c; s[2].textContent = r;
    }
    function caption(n, text) { $('.iv-cap').innerHTML = (n ? '<em>' + n + '</em>' : '') + text; }
    // Layout offsets, not getBoundingClientRect: the host may be 3D-tilted (index hero),
    // which skews client rects but leaves stage coordinates untouched.
    function moveTo(sel) {
      var el = $(sel);
      cx = el.offsetWidth / 2; cy = el.offsetHeight / 2;
      for (; el && el !== stage; el = el.offsetParent) { cx += el.offsetLeft; cy += el.offsetTop; }
      $('.iv-cursor').style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    }
    function click() {
      var cur = $('.iv-cursor'), rip = document.createElement('span');
      rip.className = 'iv-ripple';
      rip.style.left = cx + 'px'; rip.style.top = cy + 'px';
      stage.appendChild(rip);
      cur.classList.add('is-click');
      at(150, function () { cur.classList.remove('is-click'); });
      at(600, function () { rip.remove(); });
    }
    function type(el, text) {
      var f = el.closest('.iv-f');
      f.classList.add('is-typing');
      el.textContent = '';
      text.split('').forEach(function (ch, i) { at(i * 70, function () { el.textContent += ch; }); });
      return text.length * 70;
    }
    function count(el, to) {
      var from = +el.dataset.v || 0, t0 = performance.now();
      el.dataset.v = to;
      (function tick(now) {
        var p = Math.min(1, (now - t0) / 500);
        el.textContent = money(from + (to - from) * p);
        if (p < 1 && running) requestAnimationFrame(tick);
      })(t0);
    }
    function search(query) {
      var q = $('[data-q]');
      $('[data-search]').classList.add('is-filled');
      at(type(q, query) + 150, function () {
        $('[data-drop]').innerHTML = PRODUCTS.map(function (p, i) {
          return p[0].toLowerCase().indexOf(query) < 0 ? '' : '<div class="iv-opt" data-opt="' + i + '"><b>' + p[0] + '</b><small>' +
            money(p[1]) + '  ·  Stock: ' + p[2] + '  ·  HSN ' + p[3] + '</small></div>';
        }).join('');
        $('[data-drop]').classList.add('is-on');
      });
    }
    function pickProduct(i) {
      var p = PRODUCTS[i], s = $('[data-search]');
      $('[data-drop]').classList.remove('is-on');
      s.classList.remove('is-typing', 'is-filled');
      $('[data-q]').textContent = '';
      $('[data-ptitle]').textContent = p[0] + ' (Rs. ' + p[1] + '.0)';
      $('[data-pstock]').textContent = 'Available Stock: ' + p[2];
      $('[data-f="qty"]').textContent = '';
      $('[data-f="unit"]').textContent = p[1] + '.0';
      on('add', true);
    }
    function addItem(i, qty) {
      var rows = $('[data-rows]'), p = PRODUCTS[i];
      $('[data-f="qty"]').closest('.iv-f').classList.remove('is-typing');
      on('add', false);
      if (!rows.querySelector('.iv-item')) rows.innerHTML = '';
      var n = rows.children.length + 1;
      rows.insertAdjacentHTML('beforeend', '<div class="iv-item"><em>' + n + '</em><span><b>' + p[0] + '</b><small>Price: <b>' + money(p[1]) +
        '</b>   HSN/SAC: <b>' + p[3] + '</b>   Qty: <b>' + qty + '</b></small></span><b class="iv-amt">' + money(p[1] * qty) +
        '</b><i class="far fa-pen-to-square iv-mut"></i><i class="far fa-trash-can iv-del"></i></div>');
      $('[data-count]').textContent = n + (n === 1 ? ' item' : ' items');
      sub += p[1] * qty;
      count($('[data-t="sub"]'), sub);
      count($('[data-t="tax"]'), sub * 0.18);
      count($('[data-t="total"]'), sub * 1.18);
    }

    function play() {
      timers = [];
      sub = 0;
      stage.innerHTML = TPL;
      stage.classList.remove('is-out');
      var d = new Date(), today = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      stage.querySelectorAll('[data-date]').forEach(function (el) { el.textContent = today; });
      $('[data-day]').textContent = d.toLocaleDateString('en-GB', { weekday: 'long' });
      $('[data-k="dash"]').classList.add('is-on');
      caption(0, 'Your business at a glance');

      var t = 0;
      function step(dt, fn) { t += dt; at(t, fn); }
      // Each product: search → pick from dropdown → enter quantity in the add dialog → Add
      function addProduct(query, i, qty) {
        step(700, function () { moveTo('[data-search]'); });
        step(700, function () { click(); search(query); });
        step(query.length * 70 + 700, function () { moveTo('[data-opt="' + i + '"]'); });
        step(700, function () { click(); pickProduct(i); });
        step(600, function () { moveTo('[data-f="qty"]'); });
        step(700, function () { click(); type($('[data-f="qty"]'), String(qty)); });
        step(500, function () { moveTo('[data-add]'); });
        step(700, function () { click(); addItem(i, qty); });
      }

      step(60, function () { on('dash', true); });
      step(1700, function () { moveTo('[data-k="new"]'); });
      step(750, function () {
        click();
        $('[data-k="dash"]').classList.remove('is-on');
        $('[data-k="new"]').classList.add('is-on');
        on('dash', false); on('new', true);
        head('Create New Invoice', today, 'Invoice Number : #00000035');
        caption(1, 'Pick a customer');
      });
      step(700, function () { moveTo('[data-pick]'); });
      step(700, function () { click(); on('cust', true); });
      step(800, function () { moveTo('[data-cust]'); });
      step(700, function () {
        click();
        $('[data-cust]').classList.add('is-sel');
        at(300, function () {
          on('cust', false);
          $('[data-hint]').remove();
          Object.keys(CUSTOMER).forEach(function (k) {
            var el = $('[data-f="' + k + '"]');
            el.textContent = CUSTOMER[k];
            el.closest('.iv-f').classList.add('is-fill');
          });
        });
      });
      step(1100, function () { caption(2, 'Add products'); });
      addProduct('dell', 0, 1);
      addProduct('mouse', 1, 2);
      step(900, function () { caption(3, 'Tax & totals calculated'); $('.iv-totals').classList.add('is-glow'); });
      step(1300, function () { moveTo('[data-create]'); });
      step(750, function () {
        click();
        var b = $('[data-create]');
        b.classList.add('is-busy');
        b.querySelector('span').textContent = 'Processing...';
      });
      step(700, function () {
        on('new', false); on('done', true);
        head('Invoice Created', today, 'Invoice Number : #00000035');
        caption(4, 'Preview, print or save as PDF');
      });
      step(1200, function () { moveTo('[data-preview]'); });
      step(750, function () { click(); on('pdf', true); });
      step(1500, function () { moveTo('[data-dl]'); });
      step(750, function () { click(); $('.iv-toast').classList.add('is-on'); });
      step(2600, function () { stage.classList.add('is-out'); });
      step(450, play);
    }

    wrap = document.createElement('div');
    wrap.className = 'iv-demo';
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', 'Animated demo of creating an invoice in Invoiso: pick a customer, add products, taxes are calculated, then save and export as PDF');
    wrap.innerHTML = '<div class="iv"></div>';
    stage = wrap.firstChild;
    host.appendChild(wrap);
    new ResizeObserver(fit).observe(wrap);
    new IntersectionObserver(function (e) {
      inView = e[0].isIntersecting;
      inView ? start() : stop();
    }).observe(wrap);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    requestAnimationFrame(function () { wrap.classList.add('is-ready'); });
  }

  function init() { Array.prototype.forEach.call(hosts, mount); }
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
