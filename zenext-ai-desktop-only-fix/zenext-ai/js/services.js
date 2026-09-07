// Zenext.ai — Services page interactions (Phase 2)
// Scope: interactive service explorer, agent-task micro animation,
// WhatsApp feature demo (audience toggle + flow steps), problem-to-
// solution jump links, and the "choose your direction" selector.
// Does not touch Phase 1 nav/hero/loader behaviour (see main.js, loader.js).

(function () {

  /* ------------------------------------------------------------
     Interactive Service Explorer (Section 2)
     ------------------------------------------------------------ */
  const tabButtons = document.querySelectorAll('.explorer__tab, .explorer__tabs--mobile button');
  const panels = document.querySelectorAll('.explorer__panel');

  function activateTab(name) {
    tabButtons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.tab === name);
    });
    panels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panel === name);
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  /* ------------------------------------------------------------
     Agent task micro-animation (Section 2, "AI Agents" panel)
     Cycles a checklist to suggest an agent working through steps —
     runs only while its panel is visible, so it never fires off-screen.
     ------------------------------------------------------------ */
  const agentTask = document.getElementById('agentTask');
  if (agentTask) {
    const rows = Array.from(agentTask.querySelectorAll('.agent-task__row'));
    let step = 0;
    let agentInterval = null;

    function tickAgent() {
      rows.forEach((row, i) => {
        row.classList.toggle('is-done', i < step);
        const check = row.querySelector('.agent-task__check');
        if (check) check.classList.toggle('is-done', i < step);
      });
      step = (step + 1) % (rows.length + 1);
    }

    function startAgent() {
      if (agentInterval) return;
      tickAgent();
      agentInterval = setInterval(tickAgent, 900);
    }

    function stopAgent() {
      clearInterval(agentInterval);
      agentInterval = null;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startAgent();
          else stopAgent();
        });
      }, { threshold: 0.3 });
      io.observe(agentTask);
    } else {
      startAgent();
    }
  }

  /* ------------------------------------------------------------
     Featured WhatsApp Automation (Section 3)
     ------------------------------------------------------------ */
  const waToggle = document.getElementById('waToggle');
  const waList = document.getElementById('waList');
  const waThread = document.getElementById('waThread');
  const waMockTitle = document.getElementById('waMockTitle');
  // Gently cycle the flow-step highlight so the diagram reads as a
  // live pipeline rather than a static graphic. Each flow container
  // (the WhatsApp mock and the mini task/decision diagram) cycles
  // independently, so they never step in lockstep with each other.
  function cycleFlow(selector, intervalMs) {
    const steps = document.querySelectorAll(selector);
    if (!steps.length) return;
    let index = 0;
    setInterval(() => {
      steps.forEach((step, i) => step.classList.toggle('is-live', i === index));
      index = (index + 1) % steps.length;
    }, intervalMs);
  }

  cycleFlow('.wa-mock__flow-step', 1800);
  cycleFlow('.mini-flow-step', 1500);

  const waContent = {
    hotel: {
      title: 'Grand Palm Hotel',
      list: [
        'Room availability enquiries',
        'Booking requests',
        '24/7 enquiry handling outside front-desk hours',
        'Sending booking details to a guest',
        'Notifying staff when a request needs a person',
      ],
      thread: [
        { side: 'in', text: 'Hi, do you have a room free for 2 nights from Friday?' },
        { side: 'out', text: 'Let me check that for you — one moment.' },
        { side: 'note', text: 'Automation checks availability' },
        { side: 'out', text: 'Yes, a Deluxe Room is available. Would you like the rate details?' },
      ],
    },
    restaurant: {
      title: 'Local Kitchen',
      list: [
        'Table reservation enquiries',
        'Menu-related questions',
        '24/7 customer assistance',
        'Booking requests handled automatically',
        'Notifying staff for larger or special requests',
      ],
      thread: [
        { side: 'in', text: 'Is a table for 4 available tonight at 8?' },
        { side: 'out', text: 'Checking our reservations now.' },
        { side: 'note', text: 'Automation checks booking system' },
        { side: 'out', text: 'We have a table at 8:15 — should I hold it for you?' },
      ],
    },
  };

  function renderWa(audience) {
    const data = waContent[audience];
    if (!data || !waList || !waThread) return;

    waList.innerHTML = data.list.map((item) => `<li>${item}</li>`).join('');
    waMockTitle.textContent = data.title;

    waThread.innerHTML = '';
    data.thread.forEach((msg, i) => {
      const bubble = document.createElement('div');
      bubble.className =
        msg.side === 'note' ? 'wa-bubble wa-bubble--note' : `wa-bubble wa-bubble--${msg.side}`;
      bubble.textContent = msg.text;
      bubble.style.animationDelay = `${i * 0.15}s`;
      waThread.appendChild(bubble);
    });
  }

  if (waToggle) {
    waToggle.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        waToggle.querySelectorAll('button').forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        renderWa(btn.dataset.audience);
      });
    });
    renderWa('hotel');
  }

  /* ------------------------------------------------------------
     Problem → Solution (Section 4): jump to the matching explorer
     tab (or the WhatsApp feature section) and scroll to it.
     ------------------------------------------------------------ */
  const p2sRows = document.querySelectorAll('.p2s__row');
  p2sRows.forEach((row) => {
    row.addEventListener('click', () => {
      const target = row.dataset.target;
      if (target === 'wa-feature') {
        document.getElementById('wa-feature')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      activateTab(target);
      document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ------------------------------------------------------------
     Choose Your Direction (Section 6)
     ------------------------------------------------------------ */
  const directionOptions = document.getElementById('directionOptions');
  const directionResult = document.getElementById('directionResult');
  const directionResultText = document.getElementById('directionResultText');
  const directionResultBtn = document.getElementById('directionResultBtn');

  if (directionOptions && directionResult) {
    directionOptions.querySelectorAll('.direction__option').forEach((btn) => {
      btn.addEventListener('click', () => {
        directionOptions.querySelectorAll('.direction__option').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');

        const choice = btn.dataset.option;
        directionResultText.textContent = `Good starting point — tell us a bit more about "${choice.toLowerCase()}" and we'll take it from there.`;
        const message = encodeURIComponent(`Hi Zenext.ai, I'm looking to: ${choice}.`);
        directionResultBtn.href = `https://wa.me/917470739101?text=${message}`;
        directionResult.classList.add('is-visible');
      });
    });
  }

})();


// Desktop-only WhatsApp automation image carousel. The existing mobile mock is untouched.
(function () {
  const carousel = document.querySelector('.wa-feature__carousel');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('.wa-feature__slide'));
  const dots = Array.from(carousel.querySelectorAll('.wa-feature__carousel-dots button'));
  if (slides.length < 2) return;
  let current = 0;
  let timer;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  };
  const start = () => {
    clearInterval(timer);
    if (window.matchMedia('(min-width: 901px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(() => show(current + 1), 4200);
    }
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
  window.addEventListener('resize', start, { passive: true });
  start();
})();
