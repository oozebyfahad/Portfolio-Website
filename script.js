// Smooth scroll for nav links (top + bottom nav)
document.querySelectorAll('.nav-link, .btn-primary, .bottom-nav-link').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
  
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
  
      const rect = target.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY;
  
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    });
  });
  
  // Basic "active" state for navbar based on scroll
  const sections = ['#home', '#about', '#tools', '#projects', '#contact'].map(id =>
    document.querySelector(id)
  );
  const navLinks = document.querySelectorAll('.nav-link');
  
  function updateActiveLink() {
    let currentId = '#home';
    const scrollPos = window.scrollY + 120;
  
    sections.forEach(sec => {
      if (!sec) return;
      const top = sec.offsetTop;
      if (scrollPos >= top) {
        currentId = `#${sec.id}`;
      }
    });
  
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === currentId);
    });
  }
  
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // Bottom nav: show when user scrolls down
  const bottomNav = document.getElementById('bottomNav');

  function toggleBottomNav() {
    if (!bottomNav) return;
    const show = window.scrollY > 120;
    bottomNav.classList.toggle('bottom-nav--visible', show);
  }

  window.addEventListener('scroll', toggleBottomNav);
  toggleBottomNav();

  // Slide-up animation for sections (content only)
  const slideUpSections = document.querySelectorAll('.js-slide-up');
  const hero = document.querySelector('.hero');
  const aboutSection = document.querySelector('#about');
  const toolsSection = document.querySelector('#tools');

  if ('IntersectionObserver' in window && slideUpSections.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.35,
      }
    );

    slideUpSections.forEach(sec => observer.observe(sec));
  } else {
    // Fallback: show immediately
    slideUpSections.forEach(sec => sec.classList.add('is-visible'));
  }

  // Hero dimming removed to keep portrait section clear

  // About section slide-up over hero on scroll
  let aboutOffset = Math.round(window.innerHeight * 0.6);
  let toolsOffset = Math.round(window.innerHeight * 0.5);
  let rafId = null;

  function updateAboutSlide() {
    rafId = null;
    if (!aboutSection || !hero) return;

    const start = hero.offsetTop + hero.offsetHeight - window.innerHeight;
    const end = start + window.innerHeight;
    const y = window.scrollY;
    const t = Math.min(1, Math.max(0, (y - start) / (end - start)));
    const translateY = (1 - t) * aboutOffset;

    aboutSection.style.transform = `translateY(${translateY}px)`;

    const hideAt = aboutSection.offsetTop + aboutSection.offsetHeight - window.innerHeight * 0.2;
    hero.classList.toggle('hero--hidden', y >= hideAt);

    if (toolsSection) {
      const toolsStart = aboutSection.offsetTop + aboutSection.offsetHeight - window.innerHeight;
      const toolsEnd = toolsStart + window.innerHeight;
      const tt = Math.min(1, Math.max(0, (y - toolsStart) / (toolsEnd - toolsStart)));
      const toolsTranslateY = (1 - tt) * toolsOffset;
      toolsSection.style.transform = `translateY(${toolsTranslateY}px)`;
    }
  }

  function requestAboutSlide() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(updateAboutSlide);
  }

  if (aboutSection && hero) {
    window.addEventListener('scroll', requestAboutSlide, { passive: true });
    window.addEventListener('resize', () => {
      aboutOffset = Math.round(window.innerHeight * 0.6);
      toolsOffset = Math.round(window.innerHeight * 0.5);
      requestAboutSlide();
    });
    updateAboutSlide();
  }

  // Projects rows: static logo tiles, hover handled in CSS

  // Project videos: play when visible
  const projectVideos = document.querySelectorAll('.js-project-video');

  if ('IntersectionObserver' in window && projectVideos.length) {
    const videoObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const video = entry.target;
          if (!video) return;
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.4,
      }
    );

    projectVideos.forEach(video => videoObserver.observe(video));
  }
