/* ========================================
   WENWEN PORTFOLIO — script.js
   Premium Animations & Interactivity
======================================== */

'use strict';

/* ========== LOADER ========== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initSite();
  }, 2000);
});

function initSite() {
  applyPortfolioData();   // ← apply all saved edits before anything renders
  initLenis();
  initCursor();
  initSidebar();
  initParticles();
  initTyped();
  initScrollProgress();
  initScrollAnimations();
  initSkillBars();
  initProjects();
  initGallery();
  initChat();
  initLogin();
  initLike();
  initScrollTop();
  initContact();
  initRipple();
  trackVisit();
  initKeyboardShortcuts();
}

/* ========== LENIS SMOOTH SCROLL ========== */
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 0.9,                                       // snappier feel
    easing: (t) => 1 - Math.pow(1 - t, 4),              // ease-out-quart: fast start, smooth stop
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.1,                                // more responsive wheel
    smoothTouch: false,                                  // native touch is already smooth
    touchMultiplier: 1.5,
    infinite: false,
    prevent: (node) => node.closest('[data-lenis-prevent]') !== null,
  });

  // Sync ScrollTrigger with Lenis using rAF, not on every scroll event
  lenis.on('scroll', () => ScrollTrigger.update());

  // Drive Lenis from GSAP's single rAF loop — no competing loops
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Keep lag smoothing ON (default 300ms) so GSAP skips frames on tab-blur
  // instead of trying to catch up, which causes a lurch
  gsap.ticker.lagSmoothing(300, 16);
}

/* ========== GSAP SETUP ========== */
gsap.registerPlugin(ScrollTrigger);

/* ========== CURSOR ========== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    // Dot snaps instantly (no lag = feels precise)
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  }, { passive: true });

  // Use GSAP ticker for the lerped outer ring — same rAF loop
  gsap.ticker.add(() => {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    cursor.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
  });

  document.querySelectorAll('a,button,.skill-card,.project-card,.cert-card,.gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ========== SIDEBAR ========== */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const navItems = document.querySelectorAll('.nav-item');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navItems.forEach(n => {
          n.classList.toggle('active', n.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));

  // Smooth scroll on nav click
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(item.getAttribute('href'));
      if (target && lenis) {
        lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      }
      // Close on mobile
      if (window.innerWidth < 900) sidebar.classList.remove('open');
    });
  });
}

/* ========== PARTICLES ========== */
let particleTicker = null;
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -Math.random() * 0.5 - 0.15;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.0015;
      if (this.y < -10 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,107,0,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  // Use GSAP ticker so there is only ONE rAF loop on the page
  particleTicker = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
  };
  gsap.ticker.add(particleTicker);
}

/* ========== TYPED EFFECT ========== */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const roles = ['IT Professional', 'Web Developer', 'UI Designer', 'Network Engineer', 'Problem Solver'];
  let ri = 0, ci = 0, del = false;

  function type() {
    const word = roles[ri];
    el.textContent = del ? word.substring(0, ci--) : word.substring(0, ci++);
    let speed = del ? 60 : 110;
    if (!del && ci === word.length + 1) { speed = 1800; del = true; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; speed = 300; }
    setTimeout(type, speed);
  }
  type();
}

/* ========== SCROLL PROGRESS ========== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-bar');
  window.addEventListener('scroll', () => {
    const prog = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = prog + '%';
  }, { passive: true });
}

/* ========== SCROLL ANIMATIONS (GSAP) ========== */
function initScrollAnimations() {
  // Hero — plays once on load, no ScrollTrigger needed
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-image-wrapper', { scale: 0.7, opacity: 0, duration: 1.0, ease: 'back.out(1.5)' })
    .from('.hero-greeting',       { y: 24, opacity: 0, duration: 0.6 }, '-=0.7')
    .from('.hero-name',           { y: 36, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.hero-typed-wrapper',  { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
    .from('.hero-desc',           { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
    .from('.hero-cta',            { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
    .from('.hero-socials',        { y: 14, opacity: 0, duration: 0.4 }, '-=0.2')
    .from('.hero-stats',          { y: 14, opacity: 0, duration: 0.4 }, '-=0.2');

  // Helper: simple fade-up with once:true so trigger is killed after firing
  function fadeUp(selector, extras = {}) {
    gsap.utils.toArray(selector).forEach((el, i) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.65,
        delay: i * 0.07,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        ...extras
      });
    });
  }

  // Section headers
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el.querySelectorAll('.section-label, .section-title'), {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true }
    });
  });

  // About
  gsap.from('.about-img-wrapper', {
    x: -50, opacity: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.about-grid', start: 'top 78%', once: true }
  });
  gsap.from('.about-bio, .about-hobbies', {
    x: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.about-grid', start: 'top 78%', once: true }
  });

  // Timeline
  gsap.utils.toArray('.timeline-item').forEach((el, i) => {
    gsap.from(el, {
      x: i % 2 === 0 ? -40 : 40, opacity: 0, duration: 0.65,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 83%', once: true }
    });
  });

  // Cards
  fadeUp('.skill-card');
  fadeUp('.project-card');
  fadeUp('.cert-card');
  fadeUp('.gallery-item');

  // Experience
  gsap.utils.toArray('.exp-item').forEach((el, i) => {
    gsap.from(el, {
      x: -30, opacity: 0, duration: 0.6, delay: i * 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 84%', once: true }
    });
  });

  // Contact
  gsap.from('.contact-info', {
    x: -40, opacity: 0, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-grid', start: 'top 78%', once: true }
  });
  gsap.from('.contact-form', {
    x: 40, opacity: 0, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-grid', start: 'top 78%', once: true }
  });

  // Parallax blobs — use scrub:true but keep it lightweight
  gsap.to('.blob-1', {
    y: -80, ease: 'none',
    scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 2 }
  });
  gsap.to('.blob-2', {
    y: -50, ease: 'none',
    scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 3 }
  });
}

/* ========== SKILL BARS ========== */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pct = e.target.dataset.percent || '0';
        e.target.style.width = pct + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
}

/* ========== PROJECTS FILTER ========== */
function initProjects() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const show = filter === 'all' || card.dataset.category === filter;
        gsap.to(card, {
          opacity: show ? 1 : 0,
          scale: show ? 1 : 0.9,
          duration: 0.4,
          delay: show ? i * 0.05 : 0,
          onComplete: () => { card.style.display = show ? '' : 'none'; }
        });
        if (show) card.style.display = '';
      });
    });
  });

  // Certificate modal
  document.querySelectorAll('.cert-card, .cert-view-btn').forEach(el => {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.cert-card') || this.parentElement;
      const title = card.querySelector('h4').textContent;
      const org = card.querySelector('p').textContent;
      document.getElementById('cert-modal-title').textContent = title;
      document.getElementById('cert-modal-org').textContent = org;
      openModal('cert-modal');
    });
  });

  document.getElementById('cert-modal-close').addEventListener('click', () => closeModal('cert-modal'));
  document.getElementById('cert-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal('cert-modal');
  });
}

/* ========== GALLERY LIGHTBOX ========== */
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  let currentIdx = 0;
  const srcs = [...items].map(i => i.querySelector('img').src);

  function open(idx) {
    currentIdx = idx;
    lbImg.src = srcs[idx];
    lightbox.classList.add('open');
    gsap.from(lbImg, { scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.4)' });
  }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));

  document.getElementById('lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target.classList.contains('lightbox-inner')) lightbox.classList.remove('open'); });

  document.getElementById('lb-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    currentIdx = (currentIdx - 1 + srcs.length) % srcs.length;
    gsap.to(lbImg, { x: 60, opacity: 0, duration: 0.2, onComplete: () => {
      lbImg.src = srcs[currentIdx];
      gsap.fromTo(lbImg, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 });
    }});
  });

  document.getElementById('lb-next').addEventListener('click', (e) => {
    e.stopPropagation();
    currentIdx = (currentIdx + 1) % srcs.length;
    gsap.to(lbImg, { x: -60, opacity: 0, duration: 0.2, onComplete: () => {
      lbImg.src = srcs[currentIdx];
      gsap.fromTo(lbImg, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 });
    }});
  });

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') document.getElementById('lb-prev').click();
    if (e.key === 'ArrowRight') document.getElementById('lb-next').click();
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });
}

/* ========== CHAT ========== */
function initChat() {
  const widget = document.getElementById('chat-widget');
  const chatBtn = document.getElementById('chat-btn');
  const closeBtn = document.getElementById('chat-close');
  const sendBtn = document.getElementById('chat-send');
  const input = document.getElementById('chat-input');
  const msgContainer = document.getElementById('chat-messages');
  const emojiBtn = document.getElementById('emoji-btn');
  const emojiPicker = document.getElementById('emoji-picker');
  const fileInput = document.getElementById('chat-file');

  let messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');

  function saveMsgs() { localStorage.setItem('chat_messages', JSON.stringify(messages)); }

  function addMessage(text, isUser = true, isHtml = false) {
    const msg = { text, isUser, time: new Date().toLocaleTimeString() };
    messages.push(msg);
    saveMsgs();
    renderMsg(msg, isHtml);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    // notify admin
    addNotification('New chat message: ' + text.substring(0, 40));
    updateBadges();
  }

  function renderMsg(msg, isHtml = false) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (msg.isUser ? 'user' : 'bot');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    if (isHtml) bubble.innerHTML = msg.text;
    else bubble.textContent = msg.text;
    div.appendChild(bubble);
    msgContainer.appendChild(div);
    gsap.from(bubble, { y: 10, opacity: 0, duration: 0.3 });
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = '';
    // Bot reply
    setTimeout(() => {
      const replies = [
        "Thanks for your message! I'll get back to you soon. 😊",
        "Hi! I appreciate you reaching out. I'll respond shortly.",
        "Message received! Wenwen will reply as soon as possible.",
        "Thanks! Your message has been sent. 🙏"
      ];
      renderMsg({ text: replies[Math.floor(Math.random() * replies.length)], isUser: false }, false);
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 1000);
  }

  chatBtn.addEventListener('click', () => widget.classList.toggle('open'));
  closeBtn.addEventListener('click', () => widget.classList.remove('open'));
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  emojiBtn.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'flex' : 'none';
  });
  emojiPicker.addEventListener('click', e => {
    if (e.target.textContent.trim()) {
      input.value += e.target.textContent.trim() + ' ';
      input.focus();
    }
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const html = `<img src="${ev.target.result}" style="max-width:180px;border-radius:10px;margin-top:4px;">`;
      addMessage(html, true, true);
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
  });
}

/* ========== LOGIN & ADMIN ========== */
function initLogin() {
  const loginBtn = document.getElementById('login-btn');
  const loginModal = document.getElementById('login-modal');
  const loginClose = document.getElementById('login-modal-close');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  loginBtn.addEventListener('click', () => {
    if (isAdmin()) { openAdmin(); return; }
    openModal('login-modal');
  });
  loginClose.addEventListener('click', () => closeModal('login-modal'));
  loginModal.addEventListener('click', e => { if (e.target === loginModal) closeModal('login-modal'); });

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;

    if (user === 'wenwentenio' && pass === '@wenwendxt') {
      sessionStorage.setItem('admin_logged', '1');
      closeModal('login-modal');
      openAdmin();
    } else {
      loginError.textContent = 'Invalid credentials. Please try again.';
      gsap.from('#login-error', { x: -10, duration: 0.4, ease: 'elastic.out(1,0.3)' });
      gsap.to('.login-card', { x: [-8, 8, -6, 6, 0], duration: 0.4 });
    }
  });

  document.getElementById('admin-logout').addEventListener('click', () => {
    sessionStorage.removeItem('admin_logged');
    document.getElementById('admin-dashboard').style.display = 'none';
    document.body.style.overflow = '';
    gsap.to('#admin-dashboard', { opacity: 0, duration: 0.3, onComplete: () => {
      document.getElementById('admin-dashboard').style.display = 'none';
    }});
  });

  // Admin nav pages
  document.querySelectorAll('.admin-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.admin-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const page = link.dataset.page;
      document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
      const target = document.getElementById('page-' + page);
      if (target) {
        target.classList.add('active');
        gsap.from(target, { opacity: 0, y: 20, duration: 0.4 });
        if (page === 'analytics') initCharts();
        if (page === 'inbox') renderInbox();
        if (page === 'notifications') renderNotifications();
        if (page === 'dashboard') initDashChart();
      }
    });
  });
}

function isAdmin() { return sessionStorage.getItem('admin_logged') === '1'; }

function openAdmin() {
  const dash = document.getElementById('admin-dashboard');
  dash.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  gsap.from(dash, { opacity: 0, duration: 0.4 });
  // Update stats
  document.getElementById('stat-likes').textContent    = localStorage.getItem('portfolio_likes')  || '0';
  document.getElementById('stat-visitors').textContent = localStorage.getItem('portfolio_visits') || '0';
  const msgs = JSON.parse(localStorage.getItem('chat_messages') || '[]');
  document.getElementById('stat-chats').textContent = msgs.length;
  initDashChart();
  updateBadges();
  // Populate all editor fields and init sub-tabs
  populateEditorFields();
  initEditorTabs();
}

/* ========== NOTIFICATIONS ========== */
function addNotification(msg) {
  let notifs = JSON.parse(localStorage.getItem('portfolio_notifs') || '[]');
  notifs.unshift({ msg, time: new Date().toLocaleString() });
  if (notifs.length > 50) notifs = notifs.slice(0, 50);
  localStorage.setItem('portfolio_notifs', JSON.stringify(notifs));
  updateBadges();
}

function updateBadges() {
  const msgs = JSON.parse(localStorage.getItem('chat_messages') || '[]');
  const notifs = JSON.parse(localStorage.getItem('portfolio_notifs') || '[]');
  const inboxBadge = document.getElementById('inbox-badge');
  const notifBadge = document.getElementById('notif-badge');
  const statNotifs = document.getElementById('stat-notifs');
  if (inboxBadge) inboxBadge.textContent = msgs.length;
  if (notifBadge) notifBadge.textContent = notifs.length;
  if (statNotifs) statNotifs.textContent = notifs.length;
}

function renderInbox() {
  const list = document.getElementById('inbox-list');
  const msgs = JSON.parse(localStorage.getItem('chat_messages') || '[]');
  if (!msgs.length) { list.innerHTML = '<p style="color:var(--text-muted);padding:20px">No messages yet.</p>'; return; }
  list.innerHTML = msgs.filter(m => m.isUser).map(m => `
    <div class="inbox-item">
      <div class="avatar">V</div>
      <div class="inbox-meta">
        <strong>Visitor</strong>
        <p>${m.text.substring(0, 100)}</p>
        <small>${m.time || ''}</small>
      </div>
    </div>
  `).join('');
}

function renderNotifications() {
  const list = document.getElementById('notif-list');
  const notifs = JSON.parse(localStorage.getItem('portfolio_notifs') || '[]');
  if (!notifs.length) { list.innerHTML = '<p style="color:var(--text-muted);padding:20px">No notifications yet.</p>'; return; }
  list.innerHTML = notifs.map(n => `
    <div class="notif-item">
      <i class="fa-solid fa-bell"></i>
      <div>
        <p style="font-size:0.9rem">${n.msg}</p>
        <small style="color:var(--text-muted)">${n.time}</small>
      </div>
    </div>
  `).join('');
}

function saveEditorData() { saveSection('hero'); }

/* ============================================================
   FULL PORTFOLIO EDITOR ENGINE
============================================================ */

// ---------- Default data ----------
const DEFAULTS = {
  hero: {
    name: 'Wenwen', title: 'IT Professional & Developer',
    herodesc: 'Passionate about creating stunning digital experiences, solving complex problems, and building technology that matters.',
    typed: 'IT Professional, Web Developer, UI/UX Designer, Network Specialist',
    stat1val: '4+', stat1label: 'Years Learning',
    stat2val: '20+', stat2label: 'Projects Done',
    stat3val: '6', stat3label: 'Certifications',
    stat4val: '100%', stat4label: 'Dedication',
    github: '#', linkedin: '#', facebook: '#', instagram: '#'
  },
  about: {
    bio1: "I'm a passionate IT professional and creative developer based in the Philippines. I specialize in Computer System Servicing, Networking, Web Development, and UI Design.",
    bio2: "My journey in technology started with curiosity and grew into a deep passion for creating meaningful digital experiences that solve real-world problems.",
    location: 'Philippines', education: 'IT Graduate', availability: 'Open to Opportunities',
    hobbies: 'Coding, Photography, Gaming, Music, Reading, Design',
    edu1year: '2020 — 2024', edu1title: 'Bachelor of Science in Information Technology', edu1desc: 'Focused on software development, networking, and system administration.',
    edu2year: '2018 — 2020', edu2title: 'Senior High School — ICT Track', edu2desc: 'Specialized in Information and Communications Technology with NCII certifications.',
    edu3year: '2014 — 2018', edu3title: 'Junior High School', edu3desc: 'Built foundation in mathematics, science, and early programming concepts.'
  },
  skills: [
    { name: 'HTML5',               icon: 'fa-brands fa-html5',       percent: 95 },
    { name: 'CSS3',                icon: 'fa-brands fa-css3-alt',     percent: 90 },
    { name: 'JavaScript',          icon: 'fa-brands fa-js',           percent: 85 },
    { name: 'Python',              icon: 'fa-brands fa-python',       percent: 75 },
    { name: 'Computer Servicing',  icon: 'fa-solid fa-server',        percent: 92 },
    { name: 'Networking',          icon: 'fa-solid fa-network-wired', percent: 88 },
    { name: 'UI Design',           icon: 'fa-solid fa-pen-ruler',     percent: 80 },
    { name: 'Database',            icon: 'fa-solid fa-database',      percent: 78 }
  ],
  projects: [
    { title: 'E-Commerce Website',         category: 'web',     tags: 'HTML, CSS, JS',    desc: 'A fully responsive online store with cart functionality, product filtering, and smooth animations.',        github: '#', demo: '#' },
    { title: 'Mobile App UI Design',        category: 'design',  tags: 'Figma, UI/UX',     desc: 'Premium mobile application interface design with modern glassmorphism aesthetics.',                          github: '#', demo: '#' },
    { title: 'Network Infrastructure Setup',category: 'network', tags: 'Cisco, LAN',       desc: 'Complete LAN setup for a small office with VLAN configuration and security protocols.',                       github: '#', demo: '#' },
    { title: 'Task Management App',         category: 'web',     tags: 'Python, Flask',    desc: 'A full-stack task management application with user authentication and real-time updates.',                    github: '#', demo: '#' }
  ],
  certs: [
    { title: 'Computer System Servicing NC II', org: 'TESDA', year: '2022', icon: 'fa-solid fa-award' },
    { title: 'Network Infrastructure Setup',    org: 'Cisco Networking Academy', year: '2023', icon: 'fa-solid fa-certificate' },
    { title: 'Web Development Fundamentals',    org: 'freeCodeCamp', year: '2023', icon: 'fa-solid fa-medal' },
    { title: 'Python for Everybody',            org: 'Coursera — University of Michigan', year: '2024', icon: 'fa-solid fa-trophy' },
    { title: 'UI/UX Design Fundamentals',       org: 'Google UX Design Certificate', year: '2024', icon: 'fa-solid fa-star' },
    { title: 'Cybersecurity Essentials',        org: 'Cisco Networking Academy', year: '2024', icon: 'fa-solid fa-shield-halved' }
  ],
  experience: [
    { role: 'IT Support Specialist',  company: 'TechCorp Philippines',  period: '2024 — Present', desc: 'Providing technical support, maintaining network infrastructure, and troubleshooting hardware and software issues for 200+ employees.', tags: 'Networking, Hardware, Windows Server' },
    { role: 'Web Developer Intern',   company: 'Digital Agency PH',     period: '2023 — 2024',    desc: 'Developed and maintained client websites, collaborated with design teams, and implemented responsive layouts using modern web technologies.', tags: 'HTML, CSS, JavaScript' },
    { role: 'Freelance UI Designer',  company: 'Self-Employed',         period: '2022 — 2023',    desc: 'Designed user interfaces and brand identities for local businesses, creating visually appealing and user-friendly digital experiences.', tags: 'Figma, UI/UX, Branding' }
  ],
  contact: { email: 'wenwen@example.com', phone: '+63 912 345 6789', location: 'Philippines' },
  theme: { accent: '#FF6B00', bg: '#FFFFFF', textcolor: '#1A1A2E' }
};

// ---------- Load from localStorage ----------
function loadData(key) {
  try { return JSON.parse(localStorage.getItem('pf_' + key)) || null; } catch(e) { return null; }
}
function saveData(key, val) {
  localStorage.setItem('pf_' + key, JSON.stringify(val));
}
function getData(key) {
  const d = loadData(key);
  if (Array.isArray(DEFAULTS[key])) return d || JSON.parse(JSON.stringify(DEFAULTS[key]));
  return Object.assign({}, DEFAULTS[key], d || {});
}

// ---------- Apply all saved data to the live DOM ----------
function applyPortfolioData() {
  const hero = getData('hero');
  const about = getData('about');
  const skills = getData('skills');
  const projects = getData('projects');
  const certs = getData('certs');
  const experience = getData('experience');
  const contact = getData('contact');
  const theme = getData('theme');

  // Hero
  const heroName = document.querySelector('.hero-name');
  if (heroName) heroName.innerHTML = `Hi, I'm <span class="accent-text">${hero.name}</span>`;
  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) heroDesc.textContent = hero.herodesc;
  const statPills = document.querySelectorAll('.stat-pill');
  const statsData = [
    { val: hero.stat1val, label: hero.stat1label },
    { val: hero.stat2val, label: hero.stat2label },
    { val: hero.stat3val, label: hero.stat3label },
    { val: hero.stat4val, label: hero.stat4label }
  ];
  statPills.forEach((pill, i) => {
    if (!statsData[i]) return;
    const strong = pill.querySelector('strong');
    const span = pill.querySelector('span');
    if (strong) strong.textContent = statsData[i].val;
    if (span) span.textContent = statsData[i].label;
  });
  // Social links
  const socials = document.querySelectorAll('.social-icon');
  const socialLinks = [hero.github, hero.linkedin, hero.facebook, hero.instagram];
  socials.forEach((a, i) => { if (socialLinks[i]) a.href = socialLinks[i]; });
  // Typed roles
  if (hero.typed && window._typedRoles !== undefined) {
    window._typedRoles = hero.typed.split(',').map(s => s.trim());
  }

  // About
  const bioParagraphs = document.querySelectorAll('.about-bio p');
  if (bioParagraphs[0]) bioParagraphs[0].textContent = about.bio1;
  if (bioParagraphs[1]) bioParagraphs[1].textContent = about.bio2;
  const detailItems = document.querySelectorAll('.detail-item span');
  if (detailItems[0]) detailItems[0].textContent = about.location;
  if (detailItems[1]) detailItems[1].textContent = about.education;
  if (detailItems[2]) detailItems[2].textContent = about.availability;
  // Hobbies
  const hobbyTags = document.querySelector('.hobby-tags');
  if (hobbyTags && about.hobbies) {
    const icons = ['fa-code','fa-camera','fa-gamepad','fa-music','fa-book','fa-paint-brush','fa-star','fa-heart'];
    hobbyTags.innerHTML = about.hobbies.split(',').map((h, i) =>
      `<span class="tag"><i class="fa-solid ${icons[i % icons.length]}"></i> ${h.trim()}</span>`
    ).join('');
  }
  // Education timeline
  const timelines = document.querySelectorAll('.timeline-card');
  const eduKeys = [
    { year: about.edu1year, title: about.edu1title, desc: about.edu1desc },
    { year: about.edu2year, title: about.edu2title, desc: about.edu2desc },
    { year: about.edu3year, title: about.edu3title, desc: about.edu3desc }
  ];
  timelines.forEach((card, i) => {
    if (!eduKeys[i]) return;
    const yr = card.querySelector('.timeline-year');
    const h4 = card.querySelector('h4');
    const p  = card.querySelector('p');
    if (yr) yr.textContent = eduKeys[i].year;
    if (h4) h4.textContent = eduKeys[i].title;
    if (p)  p.textContent  = eduKeys[i].desc;
  });

  // Skills
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card, i) => {
    const sk = skills[i];
    if (!sk) return;
    const icon = card.querySelector('.skill-icon i');
    const h4   = card.querySelector('h4');
    const fill = card.querySelector('.skill-fill');
    const pct  = card.querySelector('.skill-percent');
    if (icon) icon.className = sk.icon;
    if (h4)   h4.textContent = sk.name;
    if (fill) { fill.dataset.percent = sk.percent; fill.style.width = sk.percent + '%'; }
    if (pct)  pct.textContent = sk.percent + '%';
  });

  // Projects
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, i) => {
    const pr = projects[i];
    if (!pr) return;
    const h3   = card.querySelector('.project-info h3');
    const desc = card.querySelector('.project-info p');
    const tags = card.querySelector('.project-tags');
    const links = card.querySelectorAll('.project-links a');
    if (h3)   h3.textContent = pr.title;
    if (desc) desc.textContent = pr.desc;
    if (tags) tags.innerHTML = pr.tags.split(',').map(t => `<span class="p-tag">${t.trim()}</span>`).join('');
    card.dataset.category = pr.category;
    if (links[0]) links[0].href = pr.github;
    if (links[1]) links[1].href = pr.demo;
  });

  // Certificates
  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach((card, i) => {
    const ct = certs[i];
    if (!ct) return;
    const icon = card.querySelector('.cert-icon i');
    const h4   = card.querySelector('h4');
    const p    = card.querySelector('p');
    const year = card.querySelector('.cert-year');
    if (icon) icon.className = ct.icon;
    if (h4)   h4.textContent = ct.title;
    if (p)    p.textContent  = ct.org;
    if (year) year.textContent = ct.year;
  });

  // Experience
  const expCards = document.querySelectorAll('.exp-card');
  expCards.forEach((card, i) => {
    const ex = experience[i];
    if (!ex) return;
    const h3      = card.querySelector('h3');
    const company = card.querySelector('.exp-company');
    const period  = card.querySelector('.exp-period');
    const desc    = card.querySelector('p');
    const expTags = card.querySelector('.exp-tags');
    if (h3)      h3.textContent      = ex.role;
    if (company) company.textContent = ex.company;
    if (period)  period.textContent  = ex.period;
    if (desc)    desc.textContent    = ex.desc;
    if (expTags) expTags.innerHTML = ex.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
  });

  // Contact
  const contactCards = document.querySelectorAll('.contact-card');
  if (contactCards[0]) contactCards[0].querySelector('p').textContent = contact.email;
  if (contactCards[1]) contactCards[1].querySelector('p').textContent = contact.phone;
  if (contactCards[2]) contactCards[2].querySelector('p').textContent = contact.location;

  // Theme
  document.documentElement.style.setProperty('--accent', theme.accent);
  document.documentElement.style.setProperty('--bg', theme.bg);
  document.documentElement.style.setProperty('--text', theme.textcolor);

  // Profile photo
  const savedImg = localStorage.getItem('profile_img');
  if (savedImg) {
    const heroImg = document.getElementById('hero-img');
    if (heroImg) heroImg.src = savedImg;
  }
}

// ---------- Populate editor fields from saved data ----------
function populateEditorFields() {
  const hero     = getData('hero');
  const about    = getData('about');
  const contact  = getData('contact');
  const theme    = getData('theme');

  // Hero tab
  ['name','title','herodesc','typed','stat1val','stat1label','stat2val','stat2label',
   'stat3val','stat3label','stat4val','stat4label','github','linkedin','facebook','instagram'
  ].forEach(k => {
    const el = document.getElementById('e-' + k);
    if (el) el.value = hero[k] || '';
  });

  // About tab
  ['bio1','bio2','location','education','availability','hobbies',
   'edu1year','edu1title','edu1desc','edu2year','edu2title','edu2desc',
   'edu3year','edu3title','edu3desc'
  ].forEach(k => {
    const el = document.getElementById('e-' + k);
    if (el) el.value = about[k] || '';
  });

  // Contact tab
  const emailEl = document.getElementById('e-email');
  const phoneEl = document.getElementById('e-phone');
  const locEl   = document.getElementById('e-contactlocation');
  if (emailEl) emailEl.value = contact.email || '';
  if (phoneEl) phoneEl.value = contact.phone || '';
  if (locEl)   locEl.value   = contact.location || '';

  // Theme tab
  const accentEl    = document.getElementById('e-accent');
  const bgEl        = document.getElementById('e-bg');
  const textcolorEl = document.getElementById('e-textcolor');
  if (accentEl)    accentEl.value    = theme.accent    || '#FF6B00';
  if (bgEl)        bgEl.value        = theme.bg        || '#FFFFFF';
  if (textcolorEl) textcolorEl.value = theme.textcolor || '#1A1A2E';

  // Skills
  buildSkillsEditor();

  // Projects
  buildProjectsEditor();

  // Certs
  buildCertsEditor();

  // Experience
  buildExpEditor();
}

// ---------- Dynamic editors ----------
function buildSkillsEditor() {
  const skills = getData('skills');
  const container = document.getElementById('skills-editor');
  if (!container) return;
  container.innerHTML = skills.map((sk, i) => `
    <div class="skill-row">
      <label>Skill Name
        <input type="text" id="sk-name-${i}" value="${sk.name}" placeholder="Skill Name">
      </label>
      <label>Icon Class
        <input type="text" id="sk-icon-${i}" value="${sk.icon}" placeholder="fa-brands fa-html5">
      </label>
      <label>%
        <input type="number" id="sk-pct-${i}" value="${sk.percent}" min="0" max="100">
      </label>
    </div>
  `).join('');
}

function buildProjectsEditor() {
  const projects = getData('projects');
  const container = document.getElementById('projects-editor');
  if (!container) return;
  container.innerHTML = projects.map((pr, i) => `
    <div class="project-entry-edit">
      <h5>Project ${i + 1}</h5>
      <div class="editor-form">
        <label>Title <input type="text" id="pr-title-${i}" value="${pr.title}"></label>
        <label>Category
          <select id="pr-cat-${i}">
            <option value="web"    ${pr.category==='web'?'selected':''}>Web</option>
            <option value="design" ${pr.category==='design'?'selected':''}>Design</option>
            <option value="network"${pr.category==='network'?'selected':''}>Network</option>
          </select>
        </label>
        <label>Tags (comma separated) <input type="text" id="pr-tags-${i}" value="${pr.tags}"></label>
        <label>Description <textarea id="pr-desc-${i}" rows="2">${pr.desc}</textarea></label>
        <label>GitHub URL <input type="url" id="pr-github-${i}" value="${pr.github}"></label>
        <label>Live Demo URL <input type="url" id="pr-demo-${i}" value="${pr.demo}"></label>
      </div>
    </div>
  `).join('');
}

function buildCertsEditor() {
  const certs = getData('certs');
  const container = document.getElementById('certs-editor');
  if (!container) return;
  container.innerHTML = certs.map((ct, i) => `
    <div class="cert-entry-edit">
      <h5>Certificate ${i + 1}</h5>
      <div class="editor-form">
        <label>Title <input type="text" id="ct-title-${i}" value="${ct.title}"></label>
        <label>Organization <input type="text" id="ct-org-${i}" value="${ct.org}"></label>
        <label>Year <input type="text" id="ct-year-${i}" value="${ct.year}"></label>
        <label>Icon Class <input type="text" id="ct-icon-${i}" value="${ct.icon}" placeholder="fa-solid fa-award"></label>
      </div>
    </div>
  `).join('');
}

function buildExpEditor() {
  const experience = getData('experience');
  const container = document.getElementById('exp-editor');
  if (!container) return;
  container.innerHTML = experience.map((ex, i) => `
    <div class="exp-entry-edit">
      <h5>Experience ${i + 1}</h5>
      <div class="editor-form">
        <label>Job Title <input type="text" id="ex-role-${i}" value="${ex.role}"></label>
        <label>Company <input type="text" id="ex-company-${i}" value="${ex.company}"></label>
        <label>Period <input type="text" id="ex-period-${i}" value="${ex.period}" placeholder="2024 — Present"></label>
        <label>Description <textarea id="ex-desc-${i}" rows="2">${ex.desc}</textarea></label>
        <label>Tags (comma separated) <input type="text" id="ex-tags-${i}" value="${ex.tags}"></label>
      </div>
    </div>
  `).join('');
}

// ---------- Save per section ----------
function saveSection(section) {
  let data;
  if (section === 'hero') {
    data = {};
    ['name','title','herodesc','typed','stat1val','stat1label','stat2val','stat2label',
     'stat3val','stat3label','stat4val','stat4label','github','linkedin','facebook','instagram'
    ].forEach(k => {
      const el = document.getElementById('e-' + k);
      if (el) data[k] = el.value;
    });
    saveData('hero', data);
  }
  else if (section === 'about') {
    data = {};
    ['bio1','bio2','location','education','availability','hobbies',
     'edu1year','edu1title','edu1desc','edu2year','edu2title','edu2desc',
     'edu3year','edu3title','edu3desc'
    ].forEach(k => {
      const el = document.getElementById('e-' + k);
      if (el) data[k] = el.value;
    });
    saveData('about', data);
  }
  else if (section === 'skills') {
    const skills = getData('skills');
    data = skills.map((_, i) => ({
      name:    document.getElementById(`sk-name-${i}`)?.value || '',
      icon:    document.getElementById(`sk-icon-${i}`)?.value || '',
      percent: parseInt(document.getElementById(`sk-pct-${i}`)?.value || '0')
    }));
    saveData('skills', data);
  }
  else if (section === 'projects') {
    const projects = getData('projects');
    data = projects.map((_, i) => ({
      title:    document.getElementById(`pr-title-${i}`)?.value  || '',
      category: document.getElementById(`pr-cat-${i}`)?.value    || 'web',
      tags:     document.getElementById(`pr-tags-${i}`)?.value   || '',
      desc:     document.getElementById(`pr-desc-${i}`)?.value   || '',
      github:   document.getElementById(`pr-github-${i}`)?.value || '#',
      demo:     document.getElementById(`pr-demo-${i}`)?.value   || '#'
    }));
    saveData('projects', data);
  }
  else if (section === 'certs') {
    const certs = getData('certs');
    data = certs.map((_, i) => ({
      title: document.getElementById(`ct-title-${i}`)?.value || '',
      org:   document.getElementById(`ct-org-${i}`)?.value   || '',
      year:  document.getElementById(`ct-year-${i}`)?.value  || '',
      icon:  document.getElementById(`ct-icon-${i}`)?.value  || 'fa-solid fa-award'
    }));
    saveData('certs', data);
  }
  else if (section === 'experience') {
    const experience = getData('experience');
    data = experience.map((_, i) => ({
      role:    document.getElementById(`ex-role-${i}`)?.value    || '',
      company: document.getElementById(`ex-company-${i}`)?.value || '',
      period:  document.getElementById(`ex-period-${i}`)?.value  || '',
      desc:    document.getElementById(`ex-desc-${i}`)?.value    || '',
      tags:    document.getElementById(`ex-tags-${i}`)?.value    || ''
    }));
    saveData('experience', data);
  }
  else if (section === 'contact') {
    data = {
      email:    document.getElementById('e-email')?.value           || '',
      phone:    document.getElementById('e-phone')?.value           || '',
      location: document.getElementById('e-contactlocation')?.value || ''
    };
    saveData('contact', data);
  }
  else if (section === 'theme') {
    data = {
      accent:    document.getElementById('e-accent')?.value    || '#FF6B00',
      bg:        document.getElementById('e-bg')?.value        || '#FFFFFF',
      textcolor: document.getElementById('e-textcolor')?.value || '#1A1A2E'
    };
    saveData('theme', data);
  }

  // Apply live then show toast
  applyPortfolioData();
  addNotification('Section updated: ' + section);
  showToast('✅ ' + section.charAt(0).toUpperCase() + section.slice(1) + ' saved!');
}

function showToast(msg) {
  const existing = document.querySelector('.save-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'save-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 2500);
}

function applyPreset(preset) {
  const presets = {
    orange: { accent: '#FF6B00', bg: '#FFFFFF', textcolor: '#1A1A2E' },
    blue:   { accent: '#0A6EFF', bg: '#FFFFFF', textcolor: '#1A1A2E' },
    green:  { accent: '#16a34a', bg: '#FFFFFF', textcolor: '#1A1A2E' },
    purple: { accent: '#7C3AED', bg: '#FFFFFF', textcolor: '#1A1A2E' },
    dark:   { accent: '#FF6B00', bg: '#0F0F0F', textcolor: '#F0F0F0' }
  };
  const p = presets[preset] || presets.orange;
  document.getElementById('e-accent').value    = p.accent;
  document.getElementById('e-bg').value        = p.bg;
  document.getElementById('e-textcolor').value = p.textcolor;
  document.documentElement.style.setProperty('--accent', p.accent);
  document.documentElement.style.setProperty('--bg',     p.bg);
  document.documentElement.style.setProperty('--text',   p.textcolor);
}

// ---------- Profile image upload ----------
document.getElementById('profile-upload')?.addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const heroImg = document.getElementById('hero-img');
    if (heroImg) heroImg.src = e.target.result;
    localStorage.setItem('profile_img', e.target.result);
    showToast('✅ Profile photo updated!');
  };
  reader.readAsDataURL(file);
});

// ---------- Editor sub-tabs ----------
function initEditorTabs() {
  document.querySelectorAll('.editor-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.editor-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

/* ========== LIKE BUTTON ========== */
function initLike() {
  const likeBtn = document.getElementById('like-btn');
  const likeCount = document.getElementById('like-count');
  let count = parseInt(localStorage.getItem('portfolio_likes') || '0');
  const liked = localStorage.getItem('portfolio_liked') === '1';
  likeCount.textContent = count;
  if (liked) likeBtn.classList.add('liked');

  likeBtn.addEventListener('click', () => {
    if (localStorage.getItem('portfolio_liked') === '1') return;
    count++;
    localStorage.setItem('portfolio_likes', count);
    localStorage.setItem('portfolio_liked', '1');
    likeCount.textContent = count;
    likeBtn.classList.add('liked');
    // Particle burst
    burstHearts(likeBtn);
    addNotification('Someone liked your portfolio! Total: ' + count);
    updateBadges();
    // Update dashboard
    const statLikes = document.getElementById('stat-likes');
    if (statLikes) statLikes.textContent = count;
  });
}

function burstHearts(el) {
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.cssText = `position:fixed;left:${rect.left + rect.width/2}px;top:${rect.top}px;font-size:${Math.random()*14+14}px;pointer-events:none;z-index:9999`;
    document.body.appendChild(heart);
    gsap.to(heart, {
      x: (Math.random() - 0.5) * 120, y: -(Math.random() * 120 + 40),
      opacity: 0, rotation: (Math.random() - 0.5) * 180,
      duration: 0.9 + Math.random() * 0.5,
      ease: 'power2.out',
      onComplete: () => heart.remove()
    });
  }
}

/* ========== SCROLL TO TOP ========== */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  });
}

/* ========== CONTACT FORM ========== */
function initContact() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value;
    const email = document.getElementById('cf-email').value;
    const subject = document.getElementById('cf-subject').value;
    const msg = document.getElementById('cf-msg').value;
    // Save to localStorage
    let contacts = JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
    contacts.push({ name, email, subject, msg, time: new Date().toLocaleString() });
    localStorage.setItem('portfolio_contacts', JSON.stringify(contacts));
    addNotification(`New contact message from ${name}: ${subject}`);
    status.className = 'form-status success';
    status.textContent = '✅ Message sent! I\'ll get back to you soon.';
    gsap.from(status, { y: 10, opacity: 0, duration: 0.4 });
    form.reset();
    setTimeout(() => { status.textContent = ''; }, 5000);
  });
}

/* ========== RIPPLE EFFECT ========== */
function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
      this.appendChild(r);
      r.addEventListener('animationend', () => r.remove());
    });
  });
}

/* ========== CHARTS (admin) ========== */
let chartsInit = false;
function initDashChart() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('visitors-chart');
  if (!ctx) return;
  if (ctx._chart) { ctx._chart.destroy(); }
  ctx._chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Visitors',
        data: [42, 78, 56, 90, 120, 85, 110],
        borderColor: '#FF6B00',
        backgroundColor: 'rgba(255,107,0,0.08)',
        fill: true, tension: 0.4,
        pointBackgroundColor: '#FF6B00',
        pointRadius: 4, pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#9090AA' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { ticks: { color: '#9090AA' }, grid: { color: 'rgba(0,0,0,0.05)' } }
      }
    }
  });
}

function initCharts() {
  if (typeof Chart === 'undefined') return;
  const accent = '#FF6B00';
  const gridColor = 'rgba(0,0,0,0.05)';
  const tickColor = '#9090AA';

  function mkChart(id, type, labels, data, colors) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    if (ctx._chart) ctx._chart.destroy();
    const isRound = type === 'doughnut' || type === 'pie';
    ctx._chart = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors || Array(data.length).fill('rgba(255,107,0,0.65)'),
          borderColor: isRound ? '#fff' : accent,
          borderWidth: isRound ? 2 : (type === 'line' ? 2 : 0),
          tension: 0.4,
          fill: type === 'line',
          pointBackgroundColor: accent,
          pointRadius: type === 'line' ? 4 : 0,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#4A4A6A', padding: 12, font: { size: 12 } }
          }
        },
        scales: !isRound ? {
          x: { ticks: { color: tickColor }, grid: { color: gridColor } },
          y: { ticks: { color: tickColor }, grid: { color: gridColor } }
        } : undefined
      }
    });
  }

  mkChart('monthly-chart',  'bar',      ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], [120,180,150,210,280,240,320,290,260,310,350,400]);
  mkChart('device-chart',   'doughnut', ['Mobile','Desktop','Tablet'], [55,35,10], ['#FF6B00','#FF9040','#FFB270']);
  mkChart('browser-chart',  'doughnut', ['Chrome','Firefox','Safari','Edge'], [52,20,18,10], ['#FF6B00','#FF7D20','#FF9040','#FFB270']);
  mkChart('sections-chart', 'bar',      ['Home','About','Skills','Projects','Gallery','Contact'], [400,310,280,350,190,220]);
}

/* ========== TRACK VISITS ========== */
function trackVisit() {
  const visits = parseInt(localStorage.getItem('portfolio_visits') || '0') + 1;
  localStorage.setItem('portfolio_visits', visits);
}

/* ========== MODAL HELPERS ========== */
function openModal(id) {
  const el = document.getElementById(id);
  el.classList.add('open');
  gsap.from(el.querySelector('.modal-box, .lightbox-inner'), { scale: 0.85, opacity: 0, duration: 0.4, ease: 'back.out(1.6)' });
}
function closeModal(id) {
  const el = document.getElementById(id);
  gsap.to(el.querySelector('.modal-box, .lightbox-inner'), {
    scale: 0.9, opacity: 0, duration: 0.25,
    onComplete: () => el.classList.remove('open')
  });
}

/* ========== MUSIC TOGGLE ========== */
document.getElementById('music-btn')?.addEventListener('click', function() {
  this.classList.toggle('active');
  const icon = this.querySelector('i');
  icon.className = this.classList.contains('active') ? 'fa-solid fa-volume-high' : 'fa-solid fa-music';
  // Real audio would need a file; this is a placeholder toggle
});

/* ========== THEME SWITCH ========== */
const themes = ['default', 'theme-blue', 'theme-dark'];
let themeIdx = 0;
const themeIcons = ['fa-palette', 'fa-circle-half-stroke', 'fa-moon'];
document.getElementById('theme-btn')?.addEventListener('click', () => {
  const body = document.body;
  body.classList.remove('theme-blue', 'theme-dark');
  themeIdx = (themeIdx + 1) % themes.length;
  if (themes[themeIdx] !== 'default') body.classList.add(themes[themeIdx]);
  // Update icon to hint at what theme is active
  const icon = document.querySelector('#theme-btn i');
  if (icon) icon.className = `fa-solid ${themeIcons[themeIdx]}`;
  gsap.from('body', { opacity: 0.9, duration: 0.35 });
});

/* ========== KEYBOARD SHORTCUTS ========== */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
    // Ctrl+/ = toggle sidebar
    if (e.ctrlKey && e.key === '/') {
      document.getElementById('sidebar').classList.toggle('open');
    }
  });
}
