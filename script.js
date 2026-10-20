// Thème, menu actif, animation réseau, barre de progression, apparitions
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme');

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

  var net = document.getElementById('net');
  if (net && net.pauseAnimations && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    net.pauseAnimations();
  }

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

  // Barre de progression en haut de page
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  function progress() {
    var d = document.documentElement;
    var max = d.scrollHeight - d.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? d.scrollTop / max : 0) + ')';
  }
  window.addEventListener('scroll', progress, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  // Apparition des blocs au défilement
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm && 'IntersectionObserver' in window) {
    var items = document.querySelectorAll('section h2, .intro, .block, .proj, .contact-box, .note');
    var show = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); show.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) {
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(i, 4) * 100 + 'ms');
      el.classList.add('reveal');
      show.observe(el);
    });
  }
})();
