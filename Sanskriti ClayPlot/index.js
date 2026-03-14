/* ===== ClayStory — Enhanced Interactions & Animations ===== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Loading Screen ──
  const loader = document.getElementById('loadingScreen');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ── Navbar Scroll Shadow ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // ── Hamburger Mobile Menu ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ── Smooth Scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Scroll Reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ── Staggered Card Entrance ──
  const allCards = document.querySelectorAll('.product-card, .carousel-card, .masonry-item');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  allCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    cardObserver.observe(card);
  });

  // ── Tray Carousel ──
  const carousel = document.getElementById('trayCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (carousel && prevBtn && nextBtn) {
    const scrollAmount = 324;
    nextBtn.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));

    let isDown = false, startX, scrollLeft;
    carousel.addEventListener('mousedown', e => { isDown = true; carousel.style.cursor = 'grabbing'; startX = e.pageX - carousel.offsetLeft; scrollLeft = carousel.scrollLeft; });
    carousel.addEventListener('mouseleave', () => { isDown = false; carousel.style.cursor = 'grab'; });
    carousel.addEventListener('mouseup', () => { isDown = false; carousel.style.cursor = 'grab'; });
    carousel.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - carousel.offsetLeft; carousel.scrollLeft = scrollLeft - (x - startX) * 1.5; });
    carousel.style.cursor = 'grab';
  }

  // ══════════════════════════════════════════════
  //   VIDEO REEL — Play/Pause on click
  // ══════════════════════════════════════════════
  const videoItems = document.querySelectorAll('.video-reel-item');
  videoItems.forEach(item => {
    const video = item.querySelector('video');
    item.addEventListener('click', () => {
      if (video.paused) {
        // Pause all other videos first
        videoItems.forEach(other => {
          const otherVid = other.querySelector('video');
          if (otherVid !== video) { otherVid.pause(); other.classList.remove('playing'); }
        });
        video.play();
        item.classList.add('playing');
      } else {
        video.pause();
        item.classList.remove('playing');
      }
    });
  });

  // ══════════════════════════════════════════════
  //   LIGHTBOX — Click card to open detail view
  // ══════════════════════════════════════════════
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxName = document.getElementById('lightboxName');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxWa = document.getElementById('lightboxWa');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(card) {
    const img = card.querySelector('img');
    const name = card.dataset.name || '';
    const desc = card.dataset.desc || '';

    lightboxImg.src = img.src;
    lightboxImg.alt = name;
    lightboxName.textContent = name;
    lightboxDesc.textContent = desc;
    lightboxWa.href = `https://wa.me/?text=${encodeURIComponent("Hi, I'm interested in: " + name + ". " + desc)}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach lightbox to all product/gallery cards
  document.querySelectorAll('.masonry-item[data-name], .product-card[data-name], .carousel-card[data-name]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open lightbox if clicking a link inside the card
      if (e.target.closest('a')) return;
      openLightbox(card);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ══════════════════════════════════════════════
  //   COUNTER ANIMATION — Stats count up
  // ══════════════════════════════════════════════
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));

  // ══════════════════════════════════════════════
  //   CURSOR TRAIL — Soft clay blobs (desktop only)
  // ══════════════════════════════════════════════
  const canvas = document.getElementById('cursorCanvas');
  if (canvas && window.innerWidth > 768) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['rgba(250,218,221,0.4)', 'rgba(232,213,245,0.35)', 'rgba(253,220,181,0.35)', 'rgba(213,236,212,0.3)'];
    let mouseX = -100, mouseY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Add particle every few moves
      if (Math.random() > 0.6) {
        particles.push({
          x: mouseX,
          y: mouseY,
          size: Math.random() * 12 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          decay: 0.015 + Math.random() * 0.01,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    });

    function animateCursor() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.99;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, (p.life * 0.5) + ')');
        ctx.fill();
      }

      // Keep array reasonable
      if (particles.length > 60) particles.splice(0, particles.length - 60);

      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ══════════════════════════════════════════════
  //   FORMS — WhatsApp redirect
  // ══════════════════════════════════════════════
  const orderForm = document.getElementById('customOrderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('orderName').value.trim();
      const email = document.getElementById('orderEmail').value.trim();
      const type = document.getElementById('orderType').value;
      const idea = document.getElementById('orderIdea').value.trim();

      if (!name || !email || !type || !idea) { shakeForm(orderForm); return; }

      const message = encodeURIComponent(
        `Hi ClayStory! 🏺\n\nName: ${name}\nEmail: ${email}\nProduct: ${type}\nIdea: ${idea}\n\nI'd love to get a custom order made!`
      );
      window.open(`https://wa.me/?text=${message}`, '_blank');
      showToast('✨ Request sent! We\'ll also reach out on WhatsApp.');
      orderForm.reset();
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const msg = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !msg) { shakeForm(contactForm); return; }

      const message = encodeURIComponent(
        `Hi ClayStory! 💌\n\nName: ${name}\nEmail: ${email}\nMessage: ${msg}`
      );
      window.open(`https://wa.me/?text=${message}`, '_blank');
      showToast('💌 Message sent! We\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  // ── Helpers ──
  function shakeForm(form) {
    form.style.animation = 'shake 0.4s ease';
    setTimeout(() => form.style.animation = '', 400);
  }

  function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; top: 90px; left: 50%; transform: translateX(-50%) translateY(-20px);
      background: linear-gradient(135deg, #D4956A, #C07D52); color: #fff;
      padding: 14px 28px; border-radius: 40px; font-family: 'Nunito', sans-serif;
      font-weight: 700; font-size: 0.9rem; box-shadow: 0 8px 32px rgba(212,149,106,0.4);
      z-index: 9999; opacity: 0; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(-20px)'; setTimeout(() => toast.remove(), 400); }, 3000);
  }

  // ── Sticky WhatsApp hide near footer ──
  const stickyWa = document.getElementById('stickyWa');
  const footer = document.querySelector('.footer');
  if (stickyWa && footer) {
    const footerObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        stickyWa.style.opacity = entry.isIntersecting ? '0' : '1';
        stickyWa.style.pointerEvents = entry.isIntersecting ? 'none' : 'all';
      });
    }, { threshold: 0.3 });
    footerObs.observe(footer);
  }

  // ── Inject shake keyframe ──
  const style = document.createElement('style');
  style.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }`;
  document.head.appendChild(style);
});
