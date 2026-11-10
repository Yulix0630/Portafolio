/**
 * Carlos Molina — Portafolio Profesional
 * Controlador limpio, rápido y optimizado para Dark/Light mode,
 * navegación interactiva y formulario de contacto.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Selector de Tema (Modo Oscuro / Modo Claro)
  const themeBtn = document.getElementById('theme-btn');
  const moonIcon = document.getElementById('theme-icon-moon');
  const sunIcon = document.getElementById('theme-icon-sun');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cm_portfolio_theme', theme);

    if (theme === 'light') {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }
  }

  // Cargar tema guardado o preferencia del sistema
  const savedTheme = localStorage.getItem('cm_portfolio_theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      showToast(`Modo ${nextTheme === 'light' ? 'Claro' : 'Oscuro'} activado`);
    });
  }

  // 2. Menú de Navegación Móvil
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 3. Resaltado de enlaces según la sección visible
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  });

  // 4. Copiar Correo al Portapapeles
  const copyEmailCard = document.getElementById('copy-email-card');
  if (copyEmailCard) {
    copyEmailCard.addEventListener('click', () => {
      const email = 'carlosmt67@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Correo copiado al portapapeles: carlosmt67@gmail.com');
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }

  // 5. Envío de Formulario por Correo Directo (mailto)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre')?.value || '';
      const email = document.getElementById('email')?.value || '';
      const mensaje = document.getElementById('mensaje')?.value || '';

      const subject = encodeURIComponent(`Contacto Portafolio Web - ${nombre}`);
      const body = encodeURIComponent(`Hola Carlos,\n\nMi nombre es: ${nombre}\nCorreo: ${email}\n\nMensaje:\n${mensaje}`);
      
      showToast('Abriendo tu cliente de correo...');
      window.location.href = `mailto:carlosmt67@gmail.com?subject=${subject}&body=${body}`;
      
      contactForm.reset();
    });
  }

  // 6. Notificaciones Toast Sutiles
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>✓</span>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 260);
    }, 2800);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
});
