/* ══════════════════════════════════════
   CANVAS PARTICLE BACKGROUND
══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 1.4 + 0.3;
      this.vx    = (Math.random() - 0.5) * 0.15;
      this.vy    = (Math.random() - 0.5) * 0.15;
      this.alpha = Math.random() * 0.35 + 0.05;
      const hues = [220, 250, 200, 270];
      this.hue   = hues[Math.floor(Math.random() * hues.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},80%,65%,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
    grad.addColorStop(0, 'rgba(59,130,246,0.03)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ══════════════════════════════════════
   READ PROGRESS + NAV HIGHLIGHT
══════════════════════════════════════ */
function updateReadProgress() {
  const doc = document.documentElement;
  const pct = Math.min(100, Math.round((doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100));

  document.getElementById('readPct').textContent = pct + '%';
  document.getElementById('ringFill').style.strokeDashoffset = 82 - (82 * pct / 100);

  const sectionIds = ['top', 'overview', 'usermode', 'secenforced', 'migration', 'quiz', 'resources'];
  let current = 0;
  sectionIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < 80) current = i;
  });
  document.querySelectorAll('.nav-link').forEach((link, i) => {
    link.classList.toggle('active', i === Math.max(0, current - 1));
  });
}
window.addEventListener('scroll', updateReadProgress, { passive: true });

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════
   IMPACT BAR ANIMATION
══════════════════════════════════════ */
document.querySelectorAll('.impact-fill[data-w]').forEach(bar => {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 300);
      obs.unobserve(bar);
    }
  }, { threshold: 0.1 });
  obs.observe(bar);
});

/* ══════════════════════════════════════
   ACCORDION
══════════════════════════════════════ */
function toggleAcc(trigger) {
  const item   = trigger.closest('.acc-item');
  const body   = item.querySelector('.acc-body');
  const isOpen = item.classList.contains('open');

  trigger.closest('.accordion').querySelectorAll('.acc-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.acc-body').classList.remove('open');
  });

  if (!isOpen) {
    item.classList.add('open');
    body.classList.add('open');
  }
}

/* ══════════════════════════════════════
   TABS
══════════════════════════════════════ */
function switchTab(tabKey, containerId) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  const target = container.querySelector(`[data-tab="${tabKey}"]`);
  if (target) target.classList.add('active');

  const tabBar = target ? target.closest('.section').querySelector('.tab-bar') : null;
  if (tabBar) {
    const tabOrder = ['soql', 'dml', 'dbmethod'];
    tabBar.querySelectorAll('.tab-btn').forEach((btn, i) => {
      btn.classList.toggle('active', tabOrder[i] === tabKey);
    });
  }
}

/* ══════════════════════════════════════
   COPY CODE
══════════════════════════════════════ */
function copyCode(btn) {
  const wrap  = btn.closest('.code-wrap');
  const lines = wrap.querySelectorAll('.diff-content, pre');
  let text    = '';
  lines.forEach(l => { text += l.textContent + '\n'; });

  navigator.clipboard.writeText(text.trim()).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

/* ══════════════════════════════════════
   MIGRATION CHECKLIST
══════════════════════════════════════ */
function loadChecks() {
  document.querySelectorAll('#migList .check-item').forEach(li => {
    if (localStorage.getItem('sf26-' + li.dataset.id) === '1') {
      li.classList.add('done');
      li.querySelector('.check-box').textContent = '✓';
    }
  });
  updateCheckProg();
}

function toggleCheck(li) {
  li.classList.toggle('done');
  const isDone = li.classList.contains('done');
  li.querySelector('.check-box').textContent = isDone ? '✓' : '';
  localStorage.setItem('sf26-' + li.dataset.id, isDone ? '1' : '0');
  updateCheckProg();
}

function updateCheckProg() {
  const total = document.querySelectorAll('#migList .check-item').length;
  const done  = document.querySelectorAll('#migList .check-item.done').length;
  const pct   = Math.round((done / total) * 100);
  document.getElementById('checkBar').style.width = pct + '%';
  document.getElementById('checkPct').textContent  = pct + '% complete';
}

/* ══════════════════════════════════════
   QUIZ
══════════════════════════════════════ */
let quizAnswers = {};

function answerQ(qId, optEl, isCorrect) {
  const card = document.getElementById(qId);
  if (card.dataset.answered) return;
  card.dataset.answered = '1';
  quizAnswers[qId] = isCorrect;

  card.querySelectorAll('.quiz-opt').forEach(o => o.classList.add('disabled'));
  optEl.classList.add(isCorrect ? 'correct' : 'wrong');
  optEl.querySelector('.opt-letter').textContent = isCorrect ? '✓' : '✗';

  if (!isCorrect) {
    card.querySelectorAll('.quiz-opt').forEach(o => {
      if (o.getAttribute('onclick')?.includes('true')) {
        o.classList.remove('disabled');
        o.classList.add('correct');
        o.querySelector('.opt-letter').textContent = '✓';
      }
    });
  }

  document.getElementById('exp-' + qId).classList.add('show');
  checkQuizDone();
}

function checkQuizDone() {
  if (Object.keys(quizAnswers).length < 5) return;
  const correct = Object.values(quizAnswers).filter(Boolean).length;
  const msgs = [
    'Keep studying — review the modules above.',
    'Good effort! A couple to review.',
    'Solid understanding!',
    'Great work — nearly there!',
    "Perfect score! You're ready for Summer '26."
  ];
  document.getElementById('scoreVal').textContent = correct + '/5';
  document.getElementById('scoreMsg').textContent = msgs[correct];
  document.getElementById('quizScore').classList.add('show');
}

function resetQuiz() {
  quizAnswers = {};
  document.querySelectorAll('.quiz-card').forEach(card => {
    delete card.dataset.answered;
    card.querySelectorAll('.quiz-opt').forEach(o => {
      o.className = 'quiz-opt';
      const match = o.getAttribute('onclick')?.match(/'([A-D])'/);
      o.querySelector('.opt-letter').textContent = match ? match[1] : '';
    });
    card.querySelectorAll('.quiz-explanation').forEach(e => e.classList.remove('show'));
  });
  document.getElementById('quizScore').classList.remove('show');
  document.getElementById('scoreVal').textContent = '—';
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadChecks();

  document.querySelectorAll('.quiz-opt').forEach(o => {
    const match = o.getAttribute('onclick')?.match(/'([A-D])'\)/);
    if (match) o.querySelector('.opt-letter').textContent = match[1];
  });

  updateReadProgress();
});
