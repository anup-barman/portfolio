(() => {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const showToast = (message) => {
    const toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  };

  const setTheme = (theme) => {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    try {
      localStorage.setItem('anup-theme', nextTheme);
    } catch (error) {
      // Private browsing modes can disable storage; the visual toggle still works.
    }

    if (themeToggle) {
      const isDark = nextTheme === 'dark';
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  };

  setTheme(root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  themeToggle?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  const closeMobileMenu = () => {
    if (!mobileMenu || !mobileMenuButton) return;
    mobileMenu.classList.remove('is-open');
    mobileMenuButton.classList.remove('is-open');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    mobileMenuButton.setAttribute('aria-label', 'Open navigation');
  };

  mobileMenuButton?.addEventListener('click', () => {
    const willOpen = !mobileMenu?.classList.contains('is-open');
    mobileMenu?.classList.toggle('is-open', willOpen);
    mobileMenuButton.classList.toggle('is-open', willOpen);
    mobileMenuButton.setAttribute('aria-expanded', String(willOpen));
    mobileMenuButton.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));

  document.addEventListener('click', (event) => {
    if (!mobileMenu || !mobileMenuButton) return;
    if (!mobileMenu.classList.contains('is-open')) return;
    if (mobileMenu.contains(event.target) || mobileMenuButton.contains(event.target)) return;
    closeMobileMenu();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
      const email = button.dataset.copyEmail;
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
        showToast('Email address copied to your clipboard.');
      } catch (error) {
        const helper = document.createElement('textarea');
        helper.value = email;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand('copy');
        helper.remove();
        showToast(copied ? 'Email address copied to your clipboard.' : email);
      }
    });
  });

  document.querySelectorAll('[data-year]').forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });

  const filterButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryCards = Array.from(document.querySelectorAll('[data-gallery-index]'));
  const galleryGrid = document.querySelector('[data-gallery-grid]');

  if (filterButtons.length && galleryGrid) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.galleryFilter || 'all';
        filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
        galleryCards.forEach((card) => {
          const categories = (card.dataset.category || '').split(' ');
          const shouldShow = filter === 'all' || categories.includes(filter);
          card.classList.toggle('is-hidden', !shouldShow);
          card.setAttribute('aria-hidden', String(!shouldShow));
        });
      });
    });
  }

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxTitle = document.querySelector('[data-lightbox-title]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const lightboxClose = document.querySelector('.lightbox-close');
  let activeCards = galleryCards.filter((card) => !card.classList.contains('is-hidden'));
  let activeIndex = 0;
  let previouslyFocused = null;

  const getVisibleCards = () => galleryCards.filter((card) => !card.classList.contains('is-hidden'));
  const renderLightbox = (index) => {
    if (!lightbox || !lightboxImage) return;
    activeCards = getVisibleCards();
    if (!activeCards.length) return;
    activeIndex = (index + activeCards.length) % activeCards.length;
    const card = activeCards[activeIndex];
    const image = card.querySelector('img');
    const title = card.querySelector('strong');
    const caption = card.querySelector('small');
    if (!image) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    if (lightboxTitle) lightboxTitle.textContent = title?.textContent || 'Competitive programming journey';
    if (lightboxCaption) lightboxCaption.textContent = caption?.textContent || '';
  };

  const openLightbox = (card) => {
    if (!lightbox) return;
    previouslyFocused = document.activeElement;
    activeCards = getVisibleCards();
    const index = activeCards.indexOf(card);
    renderLightbox(index < 0 ? 0 : index);
    lightbox.hidden = false;
    document.body.classList.add('modal-open');
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('modal-open');
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
  };

  galleryCards.forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
  });

  document.querySelectorAll('[data-lightbox-close]').forEach((button) => button.addEventListener('click', closeLightbox));
  document.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => renderLightbox(activeIndex - 1));
  document.querySelector('[data-lightbox-next]')?.addEventListener('click', () => renderLightbox(activeIndex + 1));

  document.addEventListener('keydown', (event) => {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') renderLightbox(activeIndex - 1);
    if (event.key === 'ArrowRight') renderLightbox(activeIndex + 1);
  });

  // Prevent the page behind the gallery viewer from scrolling while it is open.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('modal-open')) closeLightbox();
  });
})();
