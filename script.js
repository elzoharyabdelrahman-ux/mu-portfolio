/**
 * ══════════════════════════════════════════════════════════════════
 * PORTFOLIO JAVASCRIPT
 * Client: Abdelrhman Elzohary Abdelhady Mahmoud
 * Role: Web Developer | Problem Solver | Programmer
 * Capabilities: Theme switching, mobile menu, scroll reveal,
 *               active nav tracking, clipboard copy & form handlers
 * ══════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ─── 1. Dark / Light Theme Toggle ────────────────────────────── */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;
  const THEME_STORAGE_KEY = 'ae_portfolio_theme';

  // Default theme is explicitly 'dark'
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const initialTheme = savedTheme ? savedTheme : 'dark';
  applyTheme(initialTheme);

  function applyTheme(theme) {
    if (theme === 'light') {
      rootElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        themeToggleBtn.setAttribute('title', 'Switch to dark mode');
      }
    } else {
      rootElement.removeAttribute('data-theme');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        themeToggleBtn.setAttribute('title', 'Switch to light mode');
      }
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  }

  /* ─── 2. Header Scroll Effect & Back-to-Top Button ────────────── */
  const siteHeader = document.querySelector('.site-header');
  const floatingBackToTop = document.getElementById('floating-back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header shadow on scroll
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Floating back to top button visibility
    if (floatingBackToTop) {
      if (scrollY > 350) {
        floatingBackToTop.classList.add('visible');
      } else {
        floatingBackToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial run

  if (floatingBackToTop) {
    floatingBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Footer back to top link
  const footerBackToTop = document.getElementById('footer-back-to-top');
  if (footerBackToTop) {
    footerBackToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ─── 3. Mobile Navigation Menu ───────────────────────────────── */
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu(isOpen) {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !navMenu.classList.contains('is-open');
    if (shouldOpen) {
      navMenu.classList.add('is-open');
      mobileToggleBtn.classList.add('is-active');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      navMenu.classList.remove('is-open');
      mobileToggleBtn.classList.remove('is-active');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggleMenu(false);
        }
      });
    });

    // Close when clicking outside menu
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !mobileToggleBtn.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  /* ─── 4. Active Navigation Highlighting on Scroll ─────────────── */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ─── 5. Viewport Scroll Reveal Animations ────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Unobserve once animated
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('active'));
  }

  /* ─── 6. Toast Notification Helper ────────────────────────────── */
  let toastTimeout;
  const toastEl = document.getElementById('toast-notification');
  const toastMessageEl = document.getElementById('toast-message');

  function showToast(message) {
    if (!toastEl || !toastMessageEl) return;
    toastMessageEl.textContent = message;
    toastEl.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  /* ─── 7. Copy to Clipboard for Email & Phone ──────────────────── */
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-copy-label') || 'Text';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback using textarea
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        showToast(`Copied ${label}: ${textToCopy}`);
      } catch (err) {
        showToast(`Failed to copy: ${textToCopy}`);
      }
    });
  });

  /* ─── 8. Contact Form Submission (HTML Form + JS enhancement) ──── */
  const contactForm = document.getElementById('contact-form');
  const formStatusMsg = document.getElementById('form-status-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve field values
      const name = document.getElementById('form-name')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();
      const subject = document.getElementById('form-subject')?.value.trim();
      const message = document.getElementById('form-message')?.value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill out all fields before submitting.');
        return;
      }

      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        Sending...
      `;

      // Simulate prompt and clean response
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        if (formStatusMsg) {
          formStatusMsg.className = 'form-status-message success';
          formStatusMsg.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Thank you, <strong>${escapeHtml(name)}</strong>! Your message has been prepared. Abdelrhman will get back to you shortly.</span>
          `;
          formStatusMsg.style.display = 'flex';
        }

        showToast('Message sent successfully!');
        contactForm.reset();

        setTimeout(() => {
          if (formStatusMsg) {
            formStatusMsg.style.display = 'none';
          }
        }, 8000);
      }, 750);
    });
  }

  /* ─── 9. Project Modal / Preview Handler ───────────────────────── */
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalProjectTitle = document.getElementById('modal-project-title');
  const modalProjectDesc = document.getElementById('modal-project-desc');
  const modalProjectTags = document.getElementById('modal-project-tags');
  const projectActionBtns = document.querySelectorAll('.project-action-btn');

  const projectDetails = {
    'portfolio': {
      title: 'Personal Portfolio Website',
      status: 'In Progress',
      desc: 'A responsive personal portfolio website designed to showcase technical skills, learning progress, projects, and professional contact information. Built with semantic HTML5, clean CSS custom properties, and vanilla JavaScript.',
      tech: ['HTML5', 'CSS3 Variables', 'Vanilla JavaScript', 'Responsive Design', 'Accessibility']
    },
    'landing': {
      title: 'Responsive Landing Page',
      status: 'In Progress',
      desc: 'A modern landing-page concept focused on clean layout, responsive design, and a smooth user experience across devices. Emphasizes visual hierarchy, clean conversion CTA architecture, and fluid grid mechanics.',
      tech: ['Modern CSS Grid', 'Flexbox Layouts', 'Mobile First', 'Micro-Interactions']
    },
    'interactive': {
      title: 'JavaScript Interactive Interface',
      status: 'In Progress',
      desc: 'An interactive front-end project that demonstrates JavaScript fundamentals, dynamic user interactions, and practical UI behavior. Implements state management principles, DOM manipulation, and keyboard accessibility.',
      tech: ['Vanilla JS', 'DOM API', 'Event Handling', 'Async Functions', 'CSS Transitions']
    }
  };

  function openProjectModal(key) {
    const data = projectDetails[key];
    if (!data || !modalOverlay) return;

    if (modalProjectTitle) modalProjectTitle.textContent = data.title;
    if (modalProjectDesc) modalProjectDesc.textContent = data.desc;
    if (modalProjectTags) {
      modalProjectTags.innerHTML = data.tech.map(t => `<span class="tech-chip">${t}</span>`).join('');
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  projectActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      openProjectModal(projectKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  /* ─── 10. Utility Functions ───────────────────────────────────── */
  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }
});
