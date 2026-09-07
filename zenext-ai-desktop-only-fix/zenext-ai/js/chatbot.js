// Zenext.ai — Floating chatbot (reusable, injected on every page)
// Rule-based and session-context aware: no external APIs or web search.

(function () {
  const WHATSAPP_LINK = 'https://wa.me/917470739101?text=Hi%20Zenext.ai%2C%20I%27d%20like%20to%20talk%20about%20a%20project.';
  const EXACT_FALLBACK = 'I can help with information about Zenext.ai and our services. Try asking about AI Automation, WhatsApp Automation, websites, content, video, or digital advertising.';

  const defaultKnowledgeBase = [
    { keywords: ['service', 'offer', 'what do you do', 'what can you build'], response: 'Zenext.ai builds AI Automation, AI Agents, Voice & Calling Agents, WhatsApp Automation, Website Development, Content Creation, Video Editing, and Digital Advertising including Meta Ads.' },
    { keywords: ['contact', 'reach', 'talk', 'email', 'number', 'phone number'], response: "You can reach Zenext.ai directly through the Contact page or WhatsApp — tap 'Contact Zenext.ai' below to continue." }
  ];
  const knowledgeBase = Array.isArray(window.ZENEXT_KNOWLEDGE) && window.ZENEXT_KNOWLEDGE.length
    ? window.ZENEXT_KNOWLEDGE.map((item) => ({ keywords: item.keywords || [item.question], response: item.response, label: item.question }))
    : defaultKnowledgeBase;

  const quickQuestions = ['What is Zenext.ai?', 'What is WhatsApp automation?', 'How much does AI automation cost?', 'Can automation work for hotels?', 'How can I start a project conversation?'];
  const memory = { lastTopic: null, lastQuestion: '', history: [] };

  function findTopic(text) {
    const q = text.toLowerCase();
    for (const entry of knowledgeBase) {
      if (entry.keywords.some((kw) => q.includes(kw))) return entry;
    }
    return null;
  }

  function findResponse(text) {
    const q = text.toLowerCase().trim();
    const contextual = /\b(it|that|this|more|details|pricing|price|cost|how does it work|how it works)\b/.test(q);
    if (contextual && memory.lastTopic) {
      if (/price|pricing|cost/.test(q)) return `For ${memory.lastTopic.label}, pricing depends on the exact scope and requirements. The best next step is to contact Zenext.ai with your use case for a tailored quote.`;
      if (/more|details|how does it work|how it works/.test(q)) return `Regarding ${memory.lastTopic.label}: ${memory.lastTopic.response} If you tell me your business use case, I can also point you toward the most relevant Zenext.ai solution.`;
      return `We were discussing ${memory.lastTopic.label}. ${memory.lastTopic.response}`;
    }

    const match = findTopic(text);
    if (match) {
      memory.lastTopic = { label: match.label || match.keywords[0].replace(/\b\w/g, (c) => c.toUpperCase()), response: match.response };
      return match.response;
    }
    return EXACT_FALLBACK;
  }

  function buildUI() {
    const btn = document.createElement('button');
    btn.className = 'chatbot-btn';
    btn.id = 'chatbotBtn';
    btn.setAttribute('aria-label', 'Open Zenext.ai assistant');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<img src="assets/chatbot-avatar.png" alt="" class="chatbot-btn__avatar" />';

    const win = document.createElement('div');
    win.className = 'chatbot-window';
    win.id = 'chatbotWindow';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Zenext.ai assistant');
    win.innerHTML = `
      <div class="chatbot-window__header">
        <div class="chatbot-window__title"><img src="assets/chatbot-avatar.png" alt="" /><span data-i18n="chatbot.title">Zenext.ai Assistant</span></div>
        <button class="chatbot-window__close" id="chatbotClose" aria-label="Close chat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="chatbot-window__body" id="chatbotBody"></div>
      <div class="chatbot-quick" id="chatbotQuick"></div>
      <a class="chatbot-contact" href="${WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 32 32" fill="currentColor"><path d="M16.02 3C9.4 3 4 8.37 4 15c0 2.29.64 4.43 1.75 6.26L4 29l7.94-1.7A11.9 11.9 0 0016.02 27C22.65 27 28 21.63 28 15S22.65 3 16.02 3z"/></svg><span data-i18n="chatbot.contact">Contact Zenext.ai</span></a>
      <div class="chatbot-window__footer">
        <input class="chatbot-window__input" id="chatbotInput" type="text" autocomplete="off" placeholder="Type your question…" />
        <button class="chatbot-window__send" id="chatbotSend" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
      </div>`;
    document.body.appendChild(btn); document.body.appendChild(win); return { btn, win };
  }

  function addMessage(body, text, who) {
    const msg = document.createElement('div');
    msg.className = `chatbot-msg chatbot-msg--${who}`;
    msg.textContent = text;
    body.appendChild(msg); body.scrollTop = body.scrollHeight;
  }

  function addTyping(body) {
    const typing = document.createElement('div');
    typing.className = 'chatbot-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing); body.scrollTop = body.scrollHeight;
    return typing;
  }

  function triggerFirstVisitAttention(btn) {
    try {
      if (localStorage.getItem('zenext-attention-seen')) return;
      localStorage.setItem('zenext-attention-seen', '1');
      const wa = document.querySelector('.whatsapp-btn');
      setTimeout(() => {
        btn.classList.add('attention-burst');
        if (wa) wa.classList.add('attention-burst');
        setTimeout(() => { btn.classList.remove('attention-burst'); if (wa) wa.classList.remove('attention-burst'); }, 5200);
      }, 1300);
    } catch (_) {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    const { btn, win } = buildUI();
    const body = win.querySelector('#chatbotBody'); const quick = win.querySelector('#chatbotQuick');
    const closeBtn = win.querySelector('#chatbotClose'); const input = win.querySelector('#chatbotInput'); const sendBtn = win.querySelector('#chatbotSend');
    let welcomed = false;

    function welcome() {
      if (welcomed) return; welcomed = true;
      addMessage(body, "Hi! I'm the Zenext.ai assistant. Ask me about our services, or type your own question below.", 'bot');
      quickQuestions.forEach((q) => { const qBtn = document.createElement('button'); qBtn.type = 'button'; qBtn.textContent = q; qBtn.addEventListener('click', () => handleUserMessage(q)); quick.appendChild(qBtn); });
    }

    function handleUserMessage(text) {
      const clean = text.trim(); if (!clean) return;
      addMessage(body, clean, 'user'); input.value = ''; memory.lastQuestion = clean; memory.history.push({ role: 'user', text: clean });
      const typing = addTyping(body);
      setTimeout(() => { typing.remove(); const response = findResponse(clean); memory.history.push({ role: 'bot', text: response }); addMessage(body, response, 'bot'); }, 520);
    }

    function openChat() { win.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); welcome(); setTimeout(() => input.focus(), 180); }
    function closeChat() { win.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', () => win.classList.contains('is-open') ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);
    sendBtn.addEventListener('click', () => handleUserMessage(input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUserMessage(input.value); } });
    triggerFirstVisitAttention(btn);
  });
})();
