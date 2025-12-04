/* app.js - interactions: menu, loader, EmailJS form submit, chat, paystack, toasts */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.nav');
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('show');
  });

  // Hide loader
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    setTimeout(() => {
      overlay.style.transition = 'opacity 350ms ease';
      overlay.style.opacity = 0;
      setTimeout(() => overlay.remove(), 400);
    }, 800);
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Toast helper
  const toast = document.getElementById('toast');
  function showToast(msg = '', ms = 3500) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.style.display = 'none', 300);
    }, ms);
  }

  // EmailJS form (replace SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY)
  const form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Basic front validation
      const name = this.name?.value.trim();
      const email = this.email?.value.trim();
      if (!name || !email) {
        showToast('Please enter your name and email.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Free Audit';
        return;
      }

      // If EmailJS not available, fallback to simulated success
      if (!window.emailjs) {
        setTimeout(() => {
          showToast('Request received. We will contact you shortly.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Free Audit';
          form.reset();
        }, 900);
        return;
      }

      // Real EmailJS send (user must replace placeholders)
      emailjs.sendForm('YOUR_EMAILJS_SERVICE_ID', 'YOUR_EMAILJS_TEMPLATE_ID', this)
        .then(() => {
          showToast('✅ Request received. Security team will contact you.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Free Audit';
          this.reset();
        }, (err) => {
          console.error('EmailJS error', err);
          showToast('❌ Sending failed — please try again or call us.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Free Audit';
        });
    });
  }

  // Live chat / WhatsApp triggers
  const liveToggle = document.getElementById('live-toggle');
  const openChat = document.getElementById('open-chat');
  const chatBtn = document.getElementById('chat-btn');

  function openWhatsApp() {
    // Opens WhatsApp link in HTML (already provided on anchor). Also show toast.
    showToast('Opening WhatsApp...');
  }

  liveToggle?.addEventListener('click', () => { showToast('Opening WhatsApp...'); });
  openChat?.addEventListener('click', openWhatsApp);
  chatBtn?.addEventListener('click', openWhatsApp);

  // Paystack payment redirect (replace PAYSTACK_LINK)
  window.payWithPaystack = function (amountNaira) {
    // amountNaira: integer in NGN (site displays currency in NGN)
    showToast('Redirecting to secure payment...');
    // The real integration should call Paystack inline or server; this is a redirect placeholder.
    const link = 'https://paystack.com/pay/YOUR_PAYSTACK_LINK'; // <- replace with your Paystack link
    setTimeout(() => window.location.href = link, 700);
  };

  // Intersection animations for service cards
  const cards = document.querySelectorAll('.service-card');
  if ('IntersectionObserver' in window && cards.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach(c => {
      c.style.transform = 'translateY(12px)';
      c.style.opacity = '0';
      obs.observe(c);
    });
  }
});


