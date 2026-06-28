// Nav scroll state
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile menu
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.classList.remove('open');
}));

// Nav dropdown – mobile: tap to toggle
const dropdownBtn = document.getElementById('navDropdownBtn');
const navDropdown = document.getElementById('navDropdown');
if (dropdownBtn && navDropdown) {
  dropdownBtn.addEventListener('click', (e) => {
    if (window.innerWidth <= 640) {
      e.preventDefault();
      const open = navDropdown.classList.toggle('open');
      dropdownBtn.classList.toggle('open', open);
      dropdownBtn.setAttribute('aria-expanded', String(open));
    }
  });
}

// GYIK accordion
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

// Hero carousel
const carouselItems = document.querySelectorAll('.hero__carousel-item');
const carouselDots = document.querySelectorAll('.hero__carousel-dots span');
if (carouselItems.length) {
  let current = 0;
  function goTo(i) {
    carouselItems[current].classList.remove('active');
    carouselDots[current].classList.remove('active');
    current = i;
    carouselItems[current].classList.add('active');
    carouselDots[current].classList.add('active');
  }
  let timer = setInterval(() => goTo((current + 1) % carouselItems.length), 5000);
  carouselDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      timer = setInterval(() => goTo((current + 1) % carouselItems.length), 5000);
    });
  });
}

// Lightbox
(function(){
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCaption');
  const lbCounter = document.createElement('div');
  lbCounter.className = 'lightbox__counter';
  lb.appendChild(lbCounter);

  let items = [], cur = 0;

  function show(i) {
    cur = (i + items.length) % items.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = items[cur].src;
      lbImg.alt = items[cur].caption;
      lbCap.textContent = items[cur].caption;
      lbCounter.textContent = (cur + 1) + ' / ' + items.length;
      lbImg.style.opacity = '1';
    }, 150);
  }

  function open(all, idx) {
    items = all;
    show(idx);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const grp = el.dataset.lightbox;
      const all = [...document.querySelectorAll('[data-lightbox="' + grp + '"]')]
        .map(a => ({ src: a.dataset.src, caption: a.dataset.caption || '' }));
      const idx = [...document.querySelectorAll('[data-lightbox="' + grp + '"]')].indexOf(el);
      open(all, idx);
    });
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', () => show(cur - 1));
  document.getElementById('lbNext').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
})();

// Next-section floating button
const nextBtn = document.getElementById('nextSectionBtn');
if (nextBtn) {
  const sections = [...document.querySelectorAll('section[id]')];
  function updateBtn() {
    const nearBottom = window.scrollY + window.innerHeight > document.body.scrollHeight - 120;
    nextBtn.classList.toggle('hidden', nearBottom);
  }
  nextBtn.addEventListener('click', () => {
    const threshold = window.scrollY + window.innerHeight * 0.5;
    const next = sections.find(s => s.getBoundingClientRect().top + window.scrollY > threshold + 60);
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  });
  window.addEventListener('scroll', updateBtn, { passive: true });
  updateBtn();
}

// Custom form validation helpers
function showFieldError(field, msg) {
  field.classList.add('field--error');
  let el = field.parentElement.querySelector('.field-error-msg');
  if (!el) { el = document.createElement('p'); el.className = 'field-error-msg'; field.parentElement.appendChild(el); }
  el.textContent = msg;
}
function clearFieldError(field) {
  field.classList.remove('field--error');
  const el = field.parentElement.querySelector('.field-error-msg');
  if (el) el.remove();
}
function validateForm(form) {
  const isHR = window.location.pathname.includes('/hr');
  const m = isHR
    ? { req: 'Ovo polje je obavezno.', email: 'Unesite ispravnu email adresu.', gdpr: 'Prihvaćanje pravila privatnosti je obavezno.' }
    : { req: 'Ez a mező kötelező.', email: 'Kérjük, adjon meg érvényes email-címet.', gdpr: 'Az adatkezelési nyilatkozat elfogadása kötelező.' };
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    clearFieldError(f);
    if (f.type === 'checkbox') { if (!f.checked) { showFieldError(f, m.gdpr); ok = false; } }
    else if (f.type === 'email') {
      if (!f.value.trim()) { showFieldError(f, m.req); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) { showFieldError(f, m.email); ok = false; }
    } else { if (!f.value.trim()) { showFieldError(f, m.req); ok = false; } }
  });
  return ok;
}

// Contact form — AJAX submit, inline thank-you
const form = document.getElementById('contactForm');
if (form) {
  form.querySelectorAll('[required]').forEach(f => {
    f.addEventListener('input', () => clearFieldError(f));
    f.addEventListener('change', () => clearFieldError(f));
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) {
      const first = form.querySelector('.field--error');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    const isHR = window.location.pathname.includes('/hr');
    btn.textContent = isHR ? 'Šaljem…' : 'Küldés…';
    btn.disabled = true;
    try {
      const fd = new FormData(form);
      const res = await fetch('/mail.php', { method: 'POST', body: fd });
      if (res.ok) {
        form.querySelectorAll('h3,div.form__row,div.form__group,button,p.form__note').forEach(el => el.style.display = 'none');
        document.getElementById('formThanks').style.display = 'block';
      } else { throw new Error(); }
    } catch {
      btn.textContent = isHR ? 'Greška – pošalji email!' : 'Hiba – írj emailben!';
      btn.style.background = '#c0392b';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
    }
  });
}

// Language switcher — navigate to separate pages
(function() {
  const isHR = window.location.pathname.includes('/hr');
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', (btn.dataset.lang === 'hr') === isHR);
    btn.addEventListener('click', () => {
      if (btn.dataset.lang === 'hr' && !isHR) {
        window.location.href = 'hr/';
      } else if (btn.dataset.lang === 'hu' && isHR) {
        window.location.href = '../';
      }
    });
  });
})();
