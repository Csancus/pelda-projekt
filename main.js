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

// Next-section floating button (homepage only)
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

// Contact form — AJAX submit, inline thank-you
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Küldés…';
    btn.disabled = true;
    try {
      const fd = new FormData(form);
      const res = await fetch('/mail.php', { method: 'POST', body: fd });
      if (res.ok) {
        form.querySelectorAll('h3,div.form__row,div.form__group,button,p.form__note').forEach(el => el.style.display = 'none');
        document.getElementById('formThanks').style.display = 'block';
      } else { throw new Error(); }
    } catch {
      btn.textContent = 'Hiba – írj emailben!';
      btn.style.background = '#c0392b';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
    }
  });
}

// ===== TRANSLATIONS =====
const translations = {
  hu: {
    // Nav
    'nav.about': 'Bemutatkozás',
    'nav.methods': 'Módszerek',
    'nav.prices': 'Árak',
    'nav.reviews': 'Vélemények',
    'nav.faq': 'GYIK',
    'nav.cta': 'Időpontfoglalás',
    // Hero
    'hero.tag': 'Pszichológus  ·  Pszichoterapeuta  ·  Budapest',
    'hero.title': 'Dr. Vásárhelyi Anna –<br>Pszichológus,<br>Pszichoterapeuta<br><span class="hero__city">Budapest</span>',
    'hero.btn': 'Időpontot foglalok',
    // Carousel
    'carousel.0': '„Dr. Vásárhelyi kivételesen empatikus szakember. Minden ülés után megkönnyebbülve mentem haza."',
    'carousel.0.author': '— Dorottya',
    'carousel.1': '„Pánikrohamokkal küzdöttem éveken át. Anna segítségével valóban kontrollt nyertem felettük!"',
    'carousel.1.author': '— Péter',
    'carousel.2': '„A párterápiánk megmentette a kapcsolatunkat. Szívből ajánlom!"',
    'carousel.2.author': '— Zsuzsa & Márk',
    // Quote
    'quote.label': 'Gabriel García Márquez',
    'quote.text': '„Az élet nem az, ahogy megtörtént,<br>hanem az, ahogy emlékszel rá –<br>ahogy elmesélni készülsz."',
    // About
    'about.tag': 'Bemutatkozás',
    'about.title': 'Pszichológus Budapest –<br>Dr. Vásárhelyi Anna',
    'about.lead': 'Klinikai pszichológus, pszichoterapeuta, KVT- és EMDR-terapeuta.',
    'about.bio': '<p>Tizenhárom éve dolgozom Budapesten klinikai pszichológusként és pszichoterapeutaként. Szorongással, traumával, párkapcsolati nehézségekkel, gyásszal és önértékelési problémákkal küzdő kliensekkel foglalkozom.</p><p>Pályám elején rájöttem, hogy az emberek nem csak tünetekkel érkeznek hozzám – hanem élettörténetekkel, vágyakkal és félelmekkel. Azóta minden ülést az egész ember szemléletével közelítek meg, egyéni ütemben, ítéletmentes légkörben.</p><p>Munkám alapját a kognitív viselkedésterápia (KVT) és a humanisztikus szemlélet képezi, amelyeket EMDR-rel és mindfulness technikákkal egészítek ki. Folyamatosan képzem magam, hogy a legkorszerűbb módszereket alkalmazzam.</p><p>Hiszek abban, hogy mindenki képes változásra – ha megkapja a megfelelő teret és támogatást. <strong>Célom, hogy biztonságos, elfogadó légkörben kísérjelek el a változás útján.</strong></p>',
    'about.stat1': 'év tapasztalat',
    'about.stat2': 'Google értékelés',
    'about.stat3': 'átlagos értékelés',
    'about.reviews-label': '★★★★★  Kizárólag 5 és 4.9 csillagos értékelések',
    'about.badge.num': '12+',
    // Methods
    'methods.tag': 'Módszerek',
    'methods.title': 'Mivel tudok segíteni?',
    'methods.lead': 'Minden terápia egyedi – az Ön személyiségéhez, helyzetéhez és céljaihoz igazítva.',
    'methods.cta.text': 'Nem tudod melyik módszer illik hozzád?',
    'methods.cta.title': 'Írj nekem, és együtt megtaláljuk!',
    'methods.cta.btn': 'Kérdezek →',
    // Services
    's1.title': 'Egyéni Pszichoterápia',
    's1.sub': 'KVT · Humanisztikus · Szisztémás',
    's1.desc': 'Az egyéni terápia biztonságos teret teremt, ahol mélyebbre nézhetünk a gondolatok, érzelmek és viselkedési minták összefüggéseibe. Kognitív viselkedésterápiát, humanisztikus és szisztémás szemléletet alkalmazok az Ön egyedi szükségleteihez igazítva.',
    's1.t1': 'Szorongás', 's1.t2': 'Depresszió', 's1.t3': 'Önismeret',
    's2.title': 'Párterápia',
    's2.sub': 'Kommunikáció · Konfliktus · Bizalom',
    's2.desc': 'A párkapcsolati terápia segít a kommunikáció fejlesztésében, a berögzült minták felismerésében és a bizalom helyreállításában. Semleges, biztonságos térben dolgozunk együtt a közös célokért.',
    's2.t1': 'Kommunikáció', 's2.t2': 'Konfliktus', 's2.t3': 'Intimás',
    's3.title': 'Kognitív Viselkedésterápia (KVT)',
    's3.sub': 'Bizonyítékalapú · Hatékony · Strukturált',
    's3.desc': 'A KVT a leginkább bizonyítékon alapuló pszichoterápiás módszer. Segít felismerni és átformálni a negatív gondolati mintákat, amelyek szorongást, depressziót vagy más nehézségeket okoznak.',
    's3.t1': 'Fóbiák', 's3.t2': 'Pánikroham', 's3.t3': 'OCD',
    's4.title': 'Traumafeldolgozás',
    's4.sub': 'EMDR · Veszteség · Gyász',
    's4.desc': 'A traumatikus élmények mély nyomot hagynak a lélekben és a testben egyaránt. EMDR terápiával és traumafókuszú módszerekkel segítem klienseimet a feldolgozásban és a gyógyulásban.',
    's4.t1': 'EMDR', 's4.t2': 'Bántalmazás', 's4.t3': 'Gyász',
    's5.title': 'Szorongás & Stresszkezelés',
    's5.sub': 'Relaxáció · Mindfulness · Légzéstechnikák',
    's5.desc': 'A szorongás kezeléséhez integrált megközelítést alkalmazok: kognitív technikákat, mindfulness meditációt és légzéstechnikákat. Ezek az eszközök a mindennapokban is könnyen alkalmazhatók.',
    's5.t1': 'Pánikroham', 's5.t2': 'Teljesítményszorongás', 's5.t3': 'Burnout',
    's6.title': 'Önismeret & Személyiségfejlesztés',
    's6.sub': 'Életcélok · Értékek · Határok',
    's6.desc': 'Az önismereti munka segít jobban megérteni saját magát, azonosítani az értékeit és céljait, egészséges határokat felállítani és teljesebb, autentikusabb életet élni.',
    's6.t1': 'Életvezetés', 's6.t2': 'Identitás', 's6.t3': 'Döntéshozatal',
    'details': 'Részletek →',
    // Problems
    'help.tag': 'Miben segíthetek?',
    'help.title': 'Hozzád is szól, ha…',
    'p1': 'Szorongással vagy pánikrohamokkal küzdesz',
    'p2': 'Depressziós időszakon mész át',
    'p3': 'Párkapcsolati vagy családi nehézségek terhelnek',
    'p4': 'Traumát vagy veszteséget élsz meg',
    'p5': 'Alacsony önértékelés gátolja a fejlődésed',
    'p6': 'Alvászavar vagy krónikus stressz gyötör',
    'p7': 'Életváltás előtt állsz és irányt keresel',
    'p8': 'Mélyebb önismeretre és személyes növekedésre vágysz',
    'help.btn': 'Segítséget kérek →',
    // Reviews
    'rev.tag': 'Vélemények',
    'rev.title': 'Mit mondanak klienseim?',
    'rev.lead': '80+ ötcsillagos értékelés a Google-on',
    'rev.only5': '★★★★★  Kizárólag 5 csillagos értékelések',
    'rev.more': 'Összes vélemény a Google-on →',
    'r1.author': 'Dorottya M.', 'r1.service': 'Egyéni pszichoterápia',
    'r1.highlight': '„Végre megértettem, miért ismétlődnek ugyanazok a minták."',
    'r1.body': 'Dr. Vásárhelyi kivételesen empatikus és segítőkész. Minden ülés után megkönnyebbülve mentem haza. Szívből ajánlom.',
    'r2.author': 'Péter K.', 'r2.service': 'KVT · Szorongás',
    'r2.highlight': '„Félévnyi terápia, ami megváltoztatta az életemet."',
    'r2.body': 'Pánikrohamokkal küzdöttem éveken át. Anna segítségével nemcsak megértettem a szorongásom gyökereit, de valóban kontrollt nyertem felette.',
    'r3.author': 'Zsuzsa B.', 'r3.service': 'Párterápia',
    'r3.highlight': '„A párterápiánk megmentette a kapcsolatunkat."',
    'r3.body': 'Kommunikációs problémáink voltak, de Anna segítségével teljesen új alapokra helyeztük a kapcsolatunkat. Hálásak vagyunk.',
    'r4.author': 'Márk T.', 'r4.service': 'Traumafeldolgozás · EMDR',
    'r4.highlight': '„Szakmai és emberi szempontból is kiváló."',
    'r4.body': 'Gyászon mentem keresztül, amikor megkerestem Annát. Hallatlanul tapintatos és szakszerű. Az EMDR terápia valóban segített.',
    'r5.author': 'Réka L.', 'r5.service': 'KVT · Fóbia',
    'r5.highlight': '„KVT-vel sikerült leküzdeni a szociális szorongásomat."',
    'r5.body': 'Évek óta szenvedtem szociális szorongástól. Dr. Vásárhelyi türelmesen, lépésről lépésre segített. Megdöbbentő a változás.',
    'r6.author': 'András V.', 'r6.service': 'Önismeret · Burnout',
    'r6.highlight': '„Őszintén ajánlom mindenkinek!"',
    'r6.body': 'Burnout miatt fordultam hozzá, de rájöttem, sokkal mélyebb problémák álltak mögötte. Anna segítségével valódi áttörést értem el.',
    // FAQ
    'faq.tag': 'Kérdések & Válaszok',
    'faq.title': 'Gyakran ismételt kérdések',
    'faq.lead': 'Ha valami nem világos, itt megtalálod a leggyakoribb kérdések válaszait.',
    'faq.q1': 'Mennyi ideig tart egy ülés?',
    'faq.a1': 'Egy ülés 50–60 percet vesz igénybe. Az első találkozón részletes felmérést végzünk, ezért érdemes 90 perccel számolni.',
    'faq.q2': 'Hány alkalomra van szükség?',
    'faq.a2': 'Ez minden embernél egyéni. Sokan már 3–5 alkalom után éreznek jelentős változást. Mélyebb problémák esetén 10–20 alkalom ajánlott.',
    'faq.q3': 'Mennyibe kerül egy alkalom?',
    'faq.a3': 'Egyéni terápia: <strong>15 000 Ft</strong> / alkalom. Párterápia: <strong>20 000 Ft</strong> / alkalom.',
    'faq.q4': 'Online is elérhető a terápia?',
    'faq.a4': 'Igen! Video-konzultációt is vállalok, amely kényelmes és biztonságos alternatíva azok számára, akik nem tudnak személyesen eljönni.',
    'faq.q5': 'Mi a különbség a pszichológus és a pszichiáter között?',
    'faq.a5': 'A pszichiáter orvos, aki gyógyszert is felírhat. A pszichológus/pszichoterapeuta a terápiás kapcsolatra és pszichológiai módszerekre összpontosít. A kettő kiegészíti egymást.',
    'faq.q6': 'Ez helyettesíti a gyógyszeres kezelést?',
    'faq.a6': 'Nem. A pszichoterápia kiegészítő jellegű – nem helyettesíti a pszichiátriai kezelést, hanem amellett hatékonyan támogatja a gyógyulást.',
    'faq.q7': 'Hogyan foglalhatok időpontot?',
    'faq.a7': 'Az oldal alján lévő kapcsolati űrlapon, telefonon (+36 70 555 1234) vagy emailben. Általában 1–2 munkanapon belül visszajelzek.',
    // Contact
    'contact.tag': 'Kapcsolat',
    'contact.title': 'Készen állsz<br>a változásra?',
    'contact.lead': 'Írj, vagy foglalj időpontot! Általában 1–2 munkanapon belül visszajelzek.',
    'contact.loc.label': 'Helyszín',
    'contact.loc.val': '1052 Budapest, Váci utca 8., 2. emelet',
    'contact.phone.label': 'Telefon',
    'contact.email.label': 'Email',
    'contact.price': '💙 Egyéni terápia: 15 000 Ft &nbsp;·&nbsp; Párterápia: 20 000 Ft',
    'form.title': 'Írj nekem',
    'form.name': 'Neved *', 'form.email.lbl': 'Email *',
    'form.phone': 'Telefonszám', 'form.service.lbl': 'Melyik módszer érdekel?',
    'form.service.placeholder': 'Válassz módszert…',
    'form.opt1': 'Egyéni Pszichoterápia', 'form.opt2': 'Párterápia',
    'form.opt3': 'Kognitív Viselkedésterápia (KVT)', 'form.opt4': 'Traumafeldolgozás',
    'form.opt5': 'Szorongás & Stresszkezelés', 'form.opt6': 'Önismeret & Személyiségfejlesztés',
    'form.opt7': 'Még nem tudom, segíts dönteni!',
    'form.message': 'Üzenet',
    'form.message.placeholder': 'Írd le röviden, miben szeretnél segítséget…',
    'form.gdpr': 'Elolvastam és elfogadom az <a href="/adatkezelesi" target="_blank">adatkezelési tájékoztatót</a>, és hozzájárulok adataim kezeléséhez az időpontfoglalás céljából.',
    'form.submit': 'Elküldöm →',
    'form.note': '🔒 Adataidat bizalmasan kezelem, harmadik félnek nem adom át.',
    'form.thanks': 'Köszönöm! 1–2 munkanapon belül keresni fogom!',
    // Footer
    'footer.brand': 'Dr. Vásárhelyi Anna – Pszichológus, Pszichoterapeuta',
    'footer.addr': '1052 Budapest, Váci utca 8., 2. emelet',
    'footer.pages': 'Oldalak',
    'footer.home': 'Főoldal',
    'footer.about.link': 'Bemutatkozás',
    'footer.reviews.link': 'Vélemények',
    'footer.faq.link': 'GYIK',
    'footer.contact.link': 'Kapcsolat',
    'footer.methods': 'Módszerek',
    'footer.copy': '© 2026 Dr. Vásárhelyi Anna · Minden jog fenntartva',
  },
  hr: {
    'nav.about': 'O meni',
    'nav.methods': 'Metode',
    'nav.prices': 'Cijene',
    'nav.reviews': 'Recenzije',
    'nav.faq': 'Česta pitanja',
    'nav.cta': 'Rezerviraj termin',
    'hero.tag': 'Psiholog  ·  Psihoterapeutkinja  ·  Budimpešta',
    'hero.title': 'Dr. Anna Vásárhelyi –<br>Psihologinja,<br>Psihoterapeutkinja<br><span class="hero__city">Budimpešta</span>',
    'hero.btn': 'Rezerviraj termin',
    'carousel.0': '„Dr. Vásárhelyi je iznimno empatična stručnjakinja. Nakon svake sesije osjećala sam olakšanje."',
    'carousel.0.author': '— Dorottya',
    'carousel.1': '„Godinama sam se borila s napadima panike. Uz Anninu pomoć konačno imam kontrolu nad njima!"',
    'carousel.1.author': '— Péter',
    'carousel.2': '„Terapija za parove spasila je naš odnos. Toplo preporučujem!"',
    'carousel.2.author': '— Zsuzsa & Márk',
    'quote.label': 'Gabriel García Márquez',
    'quote.text': '„Život nije ono što se dogodilo,<br>već kako ga pamtite –<br>i kako ste ga pripravni ispričati."',
    'about.tag': 'O meni',
    'about.title': 'Psihologinja u Budimpešti –<br>Dr. Anna Vásárhelyi',
    'about.lead': 'Klinička psihologinja, psihoterapeutkinja, KBT i EMDR terapeutkinja.',
    'about.bio': '<p>Trinaest godina radim u Budimpešti kao klinička psihologinja i psihoterapeutkinja. Radim s klijentima koji se bore s anksioznošću, traumom, partnerskim teškoćama, tugom i problemima sa samopouzdanjem.</p><p>Na početku karijere shvatila sam da klijenti ne dolaze samo s problemima – dolaze s cijelim životnim pričama, željama i strahovima. Od tada svaku sesiju pristupam s holističkim pogledom, individualnim tempom, u ozračju bez osuda.</p><p>Osnovu mog rada čine kognitivno-bihevioralna terapija (KBT) i humanistički pristup, koje nadopunjujem EMDR-om i mindfulness tehnikama. Kontinuirano se usavršavam kako bih primjenjivala najsuvremenije metode.</p><p>Vjerujem da je svaka osoba sposobna za promjenu – ako dobije pravi prostor i podršku. <strong>Moj je cilj pratiti vas na putu promjene u sigurnom, prihvaćajućem ozračju.</strong></p>',
    'about.stat1': 'godina iskustva',
    'about.stat2': 'Google recenzija',
    'about.stat3': 'prosječna ocjena',
    'about.reviews-label': '★★★★★  Isključivo 5-zvjezdičaste recenzije',
    'about.badge.num': '12+',
    'methods.tag': 'Metode',
    'methods.title': 'Kako vam mogu pomoći?',
    'methods.lead': 'Svaka terapija je jedinstvena – prilagođena vašoj osobnosti, situaciji i ciljevima.',
    'methods.cta.text': 'Ne znate koja metoda vam odgovara?',
    'methods.cta.title': 'Pišite mi, zajedno ćemo pronaći pravi put!',
    'methods.cta.btn': 'Postavite pitanje →',
    's1.title': 'Individualna Psihoterapija',
    's1.sub': 'KBT · Humanistička · Sistemska',
    's1.desc': 'Individualna terapija stvara siguran prostor gdje možemo dublje zaviriti u veze između misli, emocija i obrazaca ponašanja. Primjenjujem KBT, humanistički i sistemski pristup prilagođen vašim individualnim potrebama.',
    's1.t1': 'Anksioznost', 's1.t2': 'Depresija', 's1.t3': 'Samospoznaja',
    's2.title': 'Partnerska Terapija',
    's2.sub': 'Komunikacija · Sukobi · Povjerenje',
    's2.desc': 'Partnerska terapija pomaže u razvijanju komunikacije, prepoznavanju ukorjenjenih obrazaca i obnavljanju povjerenja. Radimo zajedno u neutralnom, sigurnom prostoru prema zajedničkim ciljevima.',
    's2.t1': 'Komunikacija', 's2.t2': 'Sukobi', 's2.t3': 'Intimnost',
    's3.title': 'Kognitivno-bihevioralna terapija (KBT)',
    's3.sub': 'Utemeljeno na dokazima · Učinkovito · Strukturirano',
    's3.desc': 'KBT je najutemeljenija psihoterapijska metoda zasnovana na dokazima. Pomaže prepoznati i preoblikovati negativne misaone obrasce koji uzrokuju anksioznost, depresiju ili druge teškoće.',
    's3.t1': 'Fobije', 's3.t2': 'Napadaji panike', 's3.t3': 'OKP',
    's4.title': 'Obrada Traume',
    's4.sub': 'EMDR · Gubitak · Tuga',
    's4.desc': 'Traumatična iskustva ostavljaju duboki trag na duši i tijelu. Uz EMDR terapiju i metode fokusirane na traumu pomažem klijentima u obradi i ozdravljenju.',
    's4.t1': 'EMDR', 's4.t2': 'Zlostavljanje', 's4.t3': 'Tuga',
    's5.title': 'Anksioznost & Upravljanje Stresom',
    's5.sub': 'Relaksacija · Mindfulness · Tehnike disanja',
    's5.desc': 'Za liječenje anksioznosti koristim integrirani pristup: kognitivne tehnike, mindfulness meditaciju i tehnike disanja. Ovi alati lako se primjenjuju u svakodnevnom životu.',
    's5.t1': 'Napadaji panike', 's5.t2': 'Anksioznost od uspjeha', 's5.t3': 'Burnout',
    's6.title': 'Samospoznaja & Osobni Razvoj',
    's6.sub': 'Životni ciljevi · Vrijednosti · Granice',
    's6.desc': 'Rad na samospoznaji pomaže vam bolje razumjeti sebe, identificirati vrijednosti i ciljeve, uspostaviti zdrave granice i živjeti punijim, autentičnijim životom.',
    's6.t1': 'Životno vođenje', 's6.t2': 'Identitet', 's6.t3': 'Donošenje odluka',
    'details': 'Detalji →',
    'help.tag': 'Kako vam mogu pomoći?',
    'help.title': 'Ovo se tiče i vas, ako…',
    'p1': 'Borite se s anksioznošću ili napadajima panike',
    'p2': 'Prolazite kroz depresivno razdoblje',
    'p3': 'Opterećuju vas partnerske ili obiteljske teškoće',
    'p4': 'Doživljavate traumu ili gubitak',
    'p5': 'Nisko samopouzdanje usporava vaš razvoj',
    'p6': 'Muče vas poremećaj spavanja ili kronični stres',
    'p7': 'Stojite pred životnom promjenom i tražite smjer',
    'p8': 'Žudite za dubljom samospoznajom i osobnim rastom',
    'help.btn': 'Tražim pomoć →',
    'rev.tag': 'Recenzije',
    'rev.title': 'Što kažu moji klijenti?',
    'rev.lead': '80+ petzvjezdičastih recenzija na Googleu',
    'rev.only5': '★★★★★  Isključivo 5-zvjezdičaste recenzije',
    'rev.more': 'Sve recenzije na Googleu →',
    'r1.author': 'Dorottya M.', 'r1.service': 'Individualna psihoterapija',
    'r1.highlight': '„Konačno sam razumjela zašto se isti obrasci ponavljaju."',
    'r1.body': 'Dr. Vásárhelyi je iznimno empatična i od pomoći. Nakon svake sesije osjećala sam olakšanje. Od srca preporučujem.',
    'r2.author': 'Péter K.', 'r2.service': 'KBT · Anksioznost',
    'r2.highlight': '„Šest mjeseci terapije koji su promijenili moj život."',
    'r2.body': 'Godinama sam se borio s napadajima panike. Uz Anninu pomoć razumio sam korijene anksioznosti i stvarno stekao kontrolu.',
    'r3.author': 'Zsuzsa B.', 'r3.service': 'Partnerska terapija',
    'r3.highlight': '„Naša terapija za parove spasila je naš odnos."',
    'r3.body': 'Imali smo probleme s komunikacijom, ali uz Anninu pomoć postavili smo odnos na potpuno nove temelje. Zahvalni smo.',
    'r4.author': 'Márk T.', 'r4.service': 'Obrada traume · EMDR',
    'r4.highlight': '„Izvrsna i stručno i ljudski."',
    'r4.body': 'Tražio sam Annu u vrijeme žalosti. Nevjerojatno je taktična i stručna. EMDR terapija stvarno je pomogla.',
    'r5.author': 'Réka L.', 'r5.service': 'KBT · Fobija',
    'r5.highlight': '„Uz KBT sam prevladala socijalnu anksioznost."',
    'r5.body': 'Godinama sam patila od socijalne anksioznosti. Dr. Vásárhelyi me strpljivo, korak po korak, vodila. Promjena je nevjerojatna.',
    'r6.author': 'András V.', 'r6.service': 'Samospoznaja · Burnout',
    'r6.highlight': '„Iskreno preporučujem svima!"',
    'r6.body': 'Obratio sam se zbog burnout-a, no otkrio sam da iza toga stoje dublje probleme. Uz Anninu pomoć postigao sam pravi proboj.',
    'faq.tag': 'Pitanja i Odgovori',
    'faq.title': 'Česta pitanja',
    'faq.lead': 'Ako nešto nije jasno, ovdje ćete naći odgovore na najčešća pitanja.',
    'faq.q1': 'Koliko traje jedna sesija?',
    'faq.a1': 'Jedna sesija traje 50–60 minuta. Za prvu konzultaciju preporučujem rezervirati 90 minuta jer radimo detaljnu procjenu.',
    'faq.q2': 'Koliko sesija je potrebno?',
    'faq.a2': 'Svaka osoba je individualna. Mnogi osjete poboljšanje već nakon 3–5 sesija. Za dublje, dugotrajne probleme preporučuje se 10–20 sesija.',
    'faq.q3': 'Koliko košta sesija?',
    'faq.a3': 'Individualna terapija: <strong>15 000 Ft</strong> / sesija. Terapija za parove: <strong>20 000 Ft</strong> / sesija.',
    'faq.q4': 'Je li terapija dostupna online?',
    'faq.a4': 'Da! Nudim i video konzultacije, što je udobna i sigurna alternativa za one koji ne mogu doći osobno.',
    'faq.q5': 'Koja je razlika između psihologa i psihijatra?',
    'faq.a5': 'Psihijatar je liječnik koji može propisivati lijekove. Psiholog/psihoterapeutkinja fokusira se na terapeutski odnos i psihološke metode. Oboje se nadopunjuju.',
    'faq.q6': 'Zamjenjuje li terapija medikamente?',
    'faq.a6': 'Ne. Psihoterapija je komplementarna – ne zamjenjuje psihijatrijsko liječenje, već ga učinkovito podupire.',
    'faq.q7': 'Kako rezervirati termin?',
    'faq.a7': 'Kontaktnim obrascem ispod, telefonom (+36 70 555 1234) ili emailom. Odgovorim unutar 1–2 radna dana.',
    'contact.tag': 'Kontakt',
    'contact.title': 'Jeste li spremni<br>za promjenu?',
    'contact.lead': 'Pišite ili rezervirajte termin! Obično odgovorim unutar 1–2 radna dana.',
    'contact.loc.label': 'Lokacija',
    'contact.loc.val': '1052 Budimpešta, Váci utca 8., 2. kat',
    'contact.phone.label': 'Telefon',
    'contact.email.label': 'Email',
    'contact.price': '💙 Individualna terapija: 15 000 Ft &nbsp;·&nbsp; Terapija za parove: 20 000 Ft',
    'form.title': 'Pišite mi',
    'form.name': 'Vaše ime *', 'form.email.lbl': 'Email *',
    'form.phone': 'Broj telefona', 'form.service.lbl': 'Koja metoda vas zanima?',
    'form.service.placeholder': 'Odaberite metodu…',
    'form.opt1': 'Individualna Psihoterapija', 'form.opt2': 'Partnerska Terapija',
    'form.opt3': 'Kognitivno-bihevioralna terapija (KBT)', 'form.opt4': 'Obrada Traume',
    'form.opt5': 'Anksioznost & Upravljanje Stresom', 'form.opt6': 'Samospoznaja & Osobni Razvoj',
    'form.opt7': 'Još ne znam, pomozi mi odlučiti!',
    'form.message': 'Poruka',
    'form.message.placeholder': 'Ukratko opišite čime biste htjeli dobiti pomoć…',
    'form.gdpr': 'Pročitao/la sam i prihvaćam <a href="/adatkezelesi" target="_blank">uvjete obrade podataka</a> i suglasan/na sam s obradom svojih podataka u svrhu rezervacije termina.',
    'form.submit': 'Pošaljite →',
    'form.note': '🔒 Vaše podatke čuvam povjerljivo i ne dijelim ih s trećim stranama.',
    'form.thanks': 'Hvala! Javit ću se u roku od 1–2 radna dana!',
    'footer.brand': 'Dr. Anna Vásárhelyi – Psihologinja, Psihoterapeutkinja',
    'footer.addr': '1052 Budimpešta, Váci utca 8., 2. kat',
    'footer.pages': 'Stranice',
    'footer.home': 'Početna',
    'footer.about.link': 'O meni',
    'footer.reviews.link': 'Recenzije',
    'footer.faq.link': 'Česta pitanja',
    'footer.contact.link': 'Kontakt',
    'footer.methods': 'Metode',
    'footer.copy': '© 2026 Dr. Anna Vásárhelyi · Sva prava pridržana',
  }
};

let currentLang = localStorage.getItem('lang') || 'hu';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'hu' ? 'hu' : 'hr';
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key] !== undefined) el.textContent = translations[lang][key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (translations[lang][key] !== undefined) el.innerHTML = translations[lang][key];
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

applyLang(currentLang);
