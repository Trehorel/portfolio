// Thème, menu actif, réseau animé, progression, apparitions, fond animé, souris, clics
(function () {
  var root = document.documentElement;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var btn = document.getElementById('theme');

  // ----- Thème clair / sombre -----
  try {
    var saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}

  if (btn) {
    btn.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') === 'dark' ||
        (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ----- Schéma réseau : figé si mouvement réduit -----
  var net = document.getElementById('net');
  if (net && net.pauseAnimations && calm) net.pauseAnimations();

  // ----- Menu : section active -----
  var links = document.querySelectorAll('.top nav a[href^="#"]');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          map[e.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  // ----- Barre de progression + parallaxe du radar -----
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  var radar = document.querySelector('.radar');
  function progress() {
    var d = document.documentElement;
    var max = d.scrollHeight - d.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? d.scrollTop / max : 0) + ')';
    if (radar && !calm) radar.style.transform = 'translateY(' + (-d.scrollTop * 0.12) + 'px)';
  }
  window.addEventListener('scroll', progress, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  // ----- Apparition des blocs + lignes de section -----
  if (!calm && 'IntersectionObserver' in window) {
    var items = document.querySelectorAll('section h2, .intro, .block, .proj, .contact-box, .note');
    var sections = document.querySelectorAll('section');
    var show = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add(e.target.tagName === 'SECTION' ? 'drawn' : 'in');
          show.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) {
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(i, 4) * 100 + 'ms');
      el.classList.add('reveal');
      show.observe(el);
    });
    sections.forEach(function (s) { show.observe(s); });
  }

  // ----- Domaines : les trois mots s'allument tour à tour -----
  var dom = document.querySelector('.domains');
  if (dom && !calm) {
    var parts = dom.textContent.split(' / ');
    dom.innerHTML = parts.map(function (t) { return '<span class="d">' + t + '</span>'; }).join(' / ');
    var ds = dom.querySelectorAll('.d');
    var k = 0;
    var lightUp = function () {
      ds.forEach(function (s, i) { s.classList.toggle('on', i === k); });
      k = (k + 1) % ds.length;
    };
    lightUp();
    setInterval(lightUp, 1400);
  }

  if (calm) return;

  // ----- Cercle qui s'étend à chaque clic -----
  document.addEventListener('click', function (e) {
    var p = document.createElement('span');
    p.className = 'ping';
    p.style.left = e.clientX + 'px';
    p.style.top = e.clientY + 'px';
    document.body.appendChild(p);
    setTimeout(function () { p.remove(); }, 800);
  });

  // ----- Fond animé : points reliés + halo qui suit la souris -----
  var cv = document.createElement('canvas');
  cv.className = 'bg';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d');

  var glow = null;
  if (window.matchMedia('(hover: hover)').matches) {
    glow = document.createElement('div');
    glow.className = 'glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
  }

  var W = 0, H = 0, pts = [], tick = 0, color = '#1F7A6D';
  var mx = -9999, my = -9999, tx = -9999, ty = -9999, gx = -9999, gy = -9999;

  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.min(70, Math.round((W * H) / 20000));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3
      });
    }
  }

  window.addEventListener('resize', size);
  window.addEventListener('pointermove', function (e) {
    mx = tx = e.clientX;
    my = ty = e.clientY;
    if (gx < -9000) { gx = tx; gy = ty; }
  });
  document.documentElement.addEventListener('mouseleave', function () { mx = -9999; my = -9999; });

  function loop() {
    tick++;
    if (tick % 40 === 1) color = getComputedStyle(root).getPropertyValue('--sea').trim() || color;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, 6.2832);
      ctx.fill();

      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.globalAlpha = (1 - d / 130) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      var mdx = p.x - mx, mdy = p.y - my;
      var md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 180) {
        ctx.globalAlpha = (1 - md / 180) * 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mx, my);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    if (glow) {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = 'translate(' + (gx - 200) + 'px,' + (gy - 200) + 'px)';
    }
    window.requestAnimationFrame(loop);
  }

  size();
  loop();
})();
