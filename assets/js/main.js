/* ============================================================
   TechMated Solutions — interactions
   ============================================================ */

/* --- CONTACT FORM ------------------------------------------
   On submit, the form is sent in the background (no email
   client opens) to your Google Apps Script Web App, which
   saves the submission to your Google Sheet AND emails it to
   tj@techmated.com. Paste your Web App URL below — see README,
   section 3, for the 5-minute setup.
------------------------------------------------------------ */
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxQ9_K1dSwqwz-0TuYIOJldG9qwPa4N4d7ASCLWfQCvdqge-5vCVptglfRV9q5y6YVZ/exec";
const CONTACT_EMAIL = "tj@techmated.com";

document.addEventListener('DOMContentLoaded', () => {
  const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  const nav = document.querySelector('.nav');

  // smooth wheel/trackpad scrolling (skipped for reduced-motion users;
  // touch devices keep native scrolling)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Lenis && !reduceMotion) {
    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { offset: -(nav ? nav.offsetHeight : 74), duration: 1.1 },
      autoRaf: true
    });
    window.lenis = lenis;
  }

  // nav shadow on scroll
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // contact form
  const form = document.getElementById('contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    const setStatus = (msg, ok) => {
      status.textContent = msg;
      status.className = 'form-status show ' + (ok ? 'ok' : 'err');
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.querySelector('[name="company_website"]').value) return; // honeypot
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const data = Object.fromEntries(new FormData(form).entries());
      const btn = form.querySelector('button[type="submit"]');
      const label = btn.textContent;

      if (!SHEETS_ENDPOINT) {
        setStatus('This form isn\'t connected yet. Please email ' + CONTACT_EMAIL + ' directly.', false);
        return;
      }

      btn.textContent = 'Sending…'; btn.disabled = true;
      try {
        await fetch(SHEETS_ENDPOINT, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
        form.reset();
        setStatus('Thank you — your message has been sent. We\'ll be in touch shortly.', true);
      } catch (err) {
        setStatus('Something went wrong sending your message. Please email ' + CONTACT_EMAIL + ' directly.', false);
      } finally {
        btn.textContent = label; btn.disabled = false;
      }
    });
  }
});
