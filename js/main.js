document.addEventListener('DOMContentLoaded', function() {
  // ===== HERO SLIDESHOW (with image placeholders) =====
  const slidesData = [
    { title: "Reliable Electrical & Security", subtitle: "Professional solutions for homes and businesses", bg: "url('images/whyuss.jpg')" },
    { title: "Gyser Installations", subtitle: "Professional geyser installations for lasting comfort.", bg: "url('images/gyser.jpg')" },
    { title: "Backup Power & Inverter Solutions", subtitle: "Load shedding solutions, inverters, batteries", bg: "url('images/fullsolar.jpg')" }
  ];

  let current = 0;
  let slideInterval;
  const slidesContainer = document.getElementById('slideshowContainer');
  const heroTitle = document.getElementById('dynamicHeroTitle');
  const heroSub = document.getElementById('dynamicHeroSub');
  const dotsDiv = document.getElementById('slideDots');

  if (slidesContainer && heroTitle && heroSub && dotsDiv) {
    function buildSlides() {
      slidesContainer.innerHTML = '';
      dotsDiv.innerHTML = '';
      slidesData.forEach((slide, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${idx === 0 ? 'active' : ''}`;
        slideDiv.style.backgroundImage = slide.bg;
        slideDiv.style.backgroundSize = 'cover';
        slideDiv.style.backgroundPosition = 'center';
        slidesContainer.appendChild(slideDiv);

        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active-dot');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsDiv.appendChild(dot);
      });
      updateHeroText(0);
    }

    function updateHeroText(index) {
      heroTitle.textContent = slidesData[index].title;
      heroSub.textContent = slidesData[index].subtitle;
      document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active-dot', i === index);
      });
    }

    function goToSlide(index) {
      document.querySelectorAll('.slide').forEach((s, i) => {
        s.classList.toggle('active', i === index);
      });
      current = index;
      updateHeroText(index);
      resetInterval();
    }

    function nextSlide() { goToSlide((current + 1) % slidesData.length); }
    function resetInterval() {
      if (slideInterval) clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    buildSlides();
    resetInterval();
  }

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  // ===== TESTIMONIALS CAROUSEL =====
  const testimonials = [
    { name: "Linda Khumalo", text: "Brian responded fast, fixed my faulty wiring and installed CCTV. Highly professional!", rating: 5 },
    { name: "Thabo Nkosi", text: "Inverter installation done perfectly. Clean work, reasonable pricing.", rating: 5 },
    { name: "Sarah van der Merwe", text: "Excellent alarm and CCTV setup. He explained everything. Trustworthy.", rating: 5 }
  ];
  const track = document.getElementById('testimonialTrack');
  let testiIdx = 0;
  if (track) {
    function buildTestiCards() {
      track.innerHTML = '';
      testimonials.forEach(t => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
          <i class="fas fa-user-circle fa-3x" style="color:#4A5CF5"></i>
          <h4>${t.name}</h4>
          ${'⭐'.repeat(t.rating)}
          <p>“${t.text}”</p>
        `;
        track.appendChild(card);
      });
    }
    function updateTestiCarousel() {
      track.style.transform = `translateX(-${testiIdx * 100}%)`;
    }
    const prevBtn = document.getElementById('prevTesti');
    const nextBtn = document.getElementById('nextTesti');
    if (prevBtn) prevBtn.addEventListener('click', () => {
      testiIdx = (testiIdx - 1 + testimonials.length) % testimonials.length;
      updateTestiCarousel();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      testiIdx = (testiIdx + 1) % testimonials.length;
      updateTestiCarousel();
    });
    buildTestiCards();
  }

  // ===== MODALS & TOAST =====
  const whatsappModal = document.getElementById('whatsappPopup');
  const quoteModal = document.getElementById('quoteModal');
  const toast = document.getElementById('toastNotification');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg || "Message sent! Brian will reply ASAP.";
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  if (whatsappModal) {
    setTimeout(() => {
      if (!localStorage.getItem('waPopup')) {
        whatsappModal.style.display = 'flex';
        localStorage.setItem('waPopup', 'true');
      }
    }, 4500);
    const closeWa = document.getElementById('closeWAPopup');
    if (closeWa) closeWa.addEventListener('click', () => whatsappModal.style.display = 'none');
  }

  document.querySelectorAll('.quote-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      if (quoteModal) quoteModal.style.display = 'flex';
    });
  });
  const closeQuote = document.getElementById('closeQuoteModal');
  if (closeQuote) closeQuote.addEventListener('click', () => quoteModal.style.display = 'none');

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && window.innerWidth > 768 && !localStorage.getItem('exitPopup') && quoteModal) {
      quoteModal.style.display = 'flex';
      localStorage.setItem('exitPopup', 'true');
    }
  });

  const quoteForm = document.getElementById('quoteFormModal');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (quoteModal) quoteModal.style.display = 'none';
      showToast("Quote request sent! Brian will contact you soon.");
      quoteForm.reset();
    });
  }

  const contactForm = document.getElementById('quickContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Thank you! Brian will reply within hours.");
      contactForm.reset();
    });
  }

// ===== SCROLL REVEAL (Intersection Observer) =====
const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target); // stop watching after reveal
    }
  });
}, {
  threshold: 0.15,               // triggers when 15% visible
  rootMargin: '0px 0px -50px 0px' // triggers slightly before element enters
});

fadeElements.forEach(el => {
  // Immediately reveal if already visible on load
  const rect = el.getBoundingClientRect();
  const winHeight = window.innerHeight || document.documentElement.clientHeight;
  if (rect.top < winHeight && rect.bottom > 0) {
    el.classList.add('revealed');
  } else {
    observer.observe(el);
  }
});

// Re-check on resize in case layout changes
window.addEventListener('resize', () => {
  document.querySelectorAll('.fade-up:not(.revealed)').forEach(el => {
    const rect = el.getBoundingClientRect();
    const winHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < winHeight && rect.bottom > 0) {
      el.classList.add('revealed');
      observer.unobserve(el);
    }
  });
});

  // Also observe any dynamic elements added later (if needed)
});
