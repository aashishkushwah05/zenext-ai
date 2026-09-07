// Zenext.ai — Contact section interactions
// Scope: everything under #contact only. Self-contained, doesn't
// touch chatbot.js, theme.js, i18n.js, or any other existing script.

(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll-reveal for each block ---------- */

  const revealTargets = document.querySelectorAll(
    '.contact__visual, .contact__form-wrap, .contact__journey, .contact__quick, .contact__video-block, .contact__globe-block'
  );

  if (revealTargets.length) {
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealTargets.forEach((el) => io.observe(el));
    } else {
      revealTargets.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ---------- Live "typing" bubble ---------- */

  const typingText = document.getElementById('contactTypingText');

  if (typingText && !prefersReducedMotion) {
    const phrasesByLang = {
      en: ["Tell us what you're building...", 'An AI agent?', 'A new website?', 'A WhatsApp automation?', 'Something else entirely?'],
      hi: ['आप क्या बनाना चाहते हैं?', 'एक एआई एजेंट?', 'एक नई वेबसाइट?', 'WhatsApp ऑटोमेशन?', 'या कुछ बिल्कुल नया?']
    };
    let phraseIndex = 0;

    setInterval(() => {
      const lang = document.documentElement.getAttribute('lang') === 'hi' ? 'hi' : 'en';
      const phrases = phrasesByLang[lang];
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingText.style.opacity = '0';
      setTimeout(() => {
        typingText.textContent = phrases[phraseIndex];
        typingText.style.opacity = '1';
      }, 250);
    }, 3200);

    typingText.style.transition = 'opacity 0.25s ease';
  }

  /* ---------- Service chip selection (single-select) ---------- */

  const chipButtons = document.querySelectorAll('.contact__chip-option');
  const chipsWrap = document.querySelector('.contact__chips');
  const serviceInput = document.getElementById('cfService');

  chipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      chipButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      if (serviceInput) serviceInput.value = btn.dataset.service || '';
      if (chipsWrap) chipsWrap.classList.remove('is-required-empty');
    });
  });

  /* ---------- Form submit: free email-template flow ---------- */

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmit');
  const successBox = document.getElementById('contactSuccess');
  const resetBtn = document.getElementById('contactReset');

  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      form.querySelectorAll('input, textarea').forEach((el) => el.classList.add('is-touched'));

      const serviceChosen = !!(serviceInput && serviceInput.value);
      if (!serviceChosen && chipsWrap) chipsWrap.classList.add('is-required-empty');

      if (!form.checkValidity() || !serviceChosen) {
        if (!serviceChosen && chipsWrap) {
          chipsWrap.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
        } else {
          form.reportValidity();
        }
        return;
      }

      const name = document.getElementById('cfName')?.value.trim() || 'Not provided';
      const email = document.getElementById('cfEmail')?.value.trim() || 'Not provided';
      const phone = document.getElementById('cfPhone')?.value.trim() || 'Not provided';
      const company = document.getElementById('cfCompany')?.value.trim() || 'Not provided';
      const message = document.getElementById('cfMessage')?.value.trim() || 'Not provided';
      const service = serviceInput?.value || 'Not provided';

      const subject = `New Zenext.ai Enquiry — ${name}`;
      const body = [
        'NEW ZENEXT.AI ENQUIRY 🚀',
        '',
        '━━━━━━━━━━━━━━━━━━',
        '',
        `👤 Name: ${name}`,
        `📧 Email: ${email}`,
        `📱 Phone / WhatsApp: ${phone}`,
        `🏢 Business / Company: ${company}`,
        '',
        `🎯 Interested Service: ${service}`,
        '',
        '💡 PROJECT DETAILS:',
        message,
        '',
        '━━━━━━━━━━━━━━━━━━',
        '',
        'Status: New Enquiry'
      ].join('\n');

      const mailto = `mailto:aashishai530@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      setTimeout(() => {
        window.location.href = mailto;
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }, 350);
    });
  }

  if (resetBtn && form && successBox) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.is-touched').forEach((el) => el.classList.remove('is-touched'));
      chipButtons.forEach((b) => b.classList.remove('is-active'));
      if (serviceInput) serviceInput.value = '';
      submitBtn.querySelector('.contact__submit-label').textContent = document.documentElement.lang === 'hi' ? 'अपना संदेश भेजें →' : 'Send Your Message →';

      successBox.classList.remove('is-shown');
      successBox.hidden = true;
      form.hidden = false;
    });
  }
})();
