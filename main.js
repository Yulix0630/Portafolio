/**
 * Interactive Portfolio & Landing Page Master Controller
 * Personalizado para Carlos Arturo Molina Tomases
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles Engine
  let particleEngine = null;
  if (window.ParticleEngine) {
    particleEngine = new window.ParticleEngine('particles-canvas');
  }

  // 2. Mouse Spotlight Tracker
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });

  // 3. Web Audio Synthesizer (Zero external dependencies)
  class SoundSynth {
    constructor() {
      this.ctx = null;
      this.enabled = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.init();
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playTone(freq, type = 'sine', duration = 0.08, gain = 0.05) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gainNode.gain.setValueAtTime(gain, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (err) {
        console.warn('Audio synthesis error:', err);
      }
    }

    click() {
      this.playTone(850, 'sine', 0.04, 0.03);
    }

    hover() {
      this.playTone(480, 'triangle', 0.03, 0.015);
    }

    success() {
      if (!this.enabled || !this.ctx) return;
      this.playTone(523.25, 'sine', 0.1, 0.04);
      setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.04), 80);
      setTimeout(() => this.playTone(783.99, 'sine', 0.15, 0.05), 160);
    }

    terminalKey() {
      const freqs = [380, 420, 460, 510];
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      this.playTone(f, 'sine', 0.025, 0.02);
    }
  }

  const sound = new SoundSynth();
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      if (isEnabled) {
        audioIcon.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>`;
        sound.success();
        showToast('Efectos de sonido activados 🔊', 'info');
      } else {
        audioIcon.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>`;
        showToast('Efectos de sonido silenciados 🔇', 'info');
      }
    });
  }

  // Add click/hover sounds to interactive elements
  document.querySelectorAll('button, .btn, .nav-links a, .tilt-card, .contact-method, .timeline-card').forEach(el => {
    el.addEventListener('mouseenter', () => sound.hover());
    el.addEventListener('click', () => sound.click());
  });

  // 4. Typewriter Effect
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const roles = [
      'Ingeniería de Sistemas — Universidad CEIPA',
      'Desarrollador Full Stack (Python + React)',
      'Especialista en Bases de Datos SQL & Docker',
      'Soporte Técnico de TICs & Infraestructura',
      'Arquitecto de Soluciones Web & APIs REST'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeWriterLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1900; // Pause at full text
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 350;
      }

      setTimeout(typeWriterLoop, typingSpeed);
    }

    typeWriterLoop();
  }

  // 5. 3D Card Tilt Engine with Dynamic Specular Glare
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = ((y - centerY) / centerY) * -10;
      const tiltY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 6. Theme Switcher System
  const themeBtn = document.getElementById('theme-picker-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeOptions = document.querySelectorAll('.theme-option');

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      themeMenu.classList.remove('show');
    });

    themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedTheme = opt.getAttribute('data-set-theme');
        applyTheme(selectedTheme);
        themeMenu.classList.remove('show');
      });
    });
  }

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('carlos_portfolio_theme', themeName);

    themeOptions.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-set-theme') === themeName);
    });

    if (particleEngine) {
      particleEngine.setTheme(themeName);
    }

    sound.success();
    showToast(`Tema visual: ${themeName.toUpperCase()}`, 'info');
  }

  const savedTheme = localStorage.getItem('carlos_portfolio_theme') || 'quantum';
  applyTheme(savedTheme);

  // 7. Interactive Terminal Emulator for Carlos Molina
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.querySelector('.terminal-body');
  let commandHistory = [];
  let historyPointer = -1;

  const terminalCommands = {
    help: () => `
Comandos disponibles en la consola de Carlos Molina:
  • <span class="terminal-line-accent">about</span>       - Biografía, formación y enfoque profesional
  • <span class="terminal-line-accent">skills</span>      - Competencias en Frontend, Backend, Bases de Datos y TICs
  • <span class="terminal-line-accent">projects</span>    - Proyectos (Quantum Core, Help Desk, Módulos POO)
  • <span class="terminal-line-accent">experience</span>  - Historial laboral y académico (CEIPA, Todo Eléctrico Tavo, etc.)
  • <span class="terminal-line-accent">contact</span>     - Correo, WhatsApp, LinkedIn y GitHub
  • <span class="terminal-line-accent">theme</span> [nom] - Cambiar tema: quantum | cyberpunk | matrix | solar
  • <span class="terminal-line-accent">matrix</span>      - Protocolo de transmisión digital
  • <span class="terminal-line-accent">clear</span>       - Limpiar pantalla
  • <span class="terminal-line-accent">date</span>        - Fecha y hora actual del sistema`,

    about: () => `
<span class="terminal-line-accent">PERFIL PROFESIONAL DE CARLOS MOLINA:</span>
Estudiante en curso de Ingeniería de Sistemas en la Universidad CEIPA con excelente
rendimiento académico. Apasionado por el desarrollo de software y la gestión de bases
de datos relacionales. Cuenta con más de 5 años de experiencia práctica en soporte técnico
de TICs, infraestructura y gestión contable/administrativa.

Enfocado en crear aplicaciones web funcionales y optimizar procesos mediante Python,
React y bases de datos SQL.
<span class="terminal-line-success">> Estado actual: Disponible para prácticas profesionales y proyectos freelance.</span>`,

    skills: () => `
<span class="terminal-line-accent">CONOCIMIENTOS TÉCNICOS:</span>
  • Frontend:       React 19, Vite, JavaScript ESNext, Tailwind CSS, HTML5, CSS3
  • Backend:        Python 3, Flask, APIs REST, Node.js, Java, POO & SOLID
  • Bases de Datos: SQL, MySQL, SQLite, Prisma ORM, Modelado de Datos
  • Infraestructura:Docker, Linux, Windows, Redes, Help Desk, Hardware
  • Gestión:        Excel Avanzado, Registro Contable, Metodologías Ágiles, Git`,

    projects: () => `
<span class="terminal-line-accent">PROYECTOS DESTACADOS:</span>
  1. <span class="terminal-line-success">Quantum Core</span>:
     Sistema transaccional de 3 capas independientes (React + Flask + MySQL en Docker).
     Repositorio: <a href="https://github.com/Yulix0630" target="_blank" style="color:var(--accent-primary)">github.com/Yulix0630</a>

  2. <span class="terminal-line-success">Sistema de Gestión Help Desk</span>:
     Plataforma web para administración de tickets, tableros con tiempos de respuesta y categorización.
     Stack: Python, SQL, HTML/CSS, Lógica/Análisis.

  3. <span class="terminal-line-success">Módulos de Validación & Datos</span>:
     Control de transacciones financieras con validación robusta y encapsulamiento POO.`,

    experience: () => `
<span class="terminal-line-accent">HISTORIAL LABORAL Y ACADÉMICO:</span>
  • 2025 - Act:   Ingeniería de Sistemas — Universidad CEIPA
  • 2019 - Act:   Auxiliar Contable y Técnico en Sistemas — Todo Eléctrico Tavo
  • 2018:         Auxiliar de TIC's (Prácticas) — SuperBrix S.A.
  • 2016:         Técnico en Documentación y Registro Contable — SENA
  • 2015 - 2017:  Auxiliar de Sistemas — Education HUB`,

    contact: () => `
<span class="terminal-line-accent">CANALES DE CONTACTO:</span>
  • Correo:    <a href="mailto:carlosmt67@gmail.com" style="color:var(--accent-primary)">carlosmt67@gmail.com</a>
  • Teléfono:  +57 323 331 8962 (<a href="https://wa.me/573233318962" target="_blank" style="color:var(--accent-primary)">Abrir en WhatsApp</a>)
  • LinkedIn:  <a href="https://linkedin.com/in/carlos-arturo-molina-tomases-a8856a124/" target="_blank" style="color:var(--accent-primary)">linkedin.com/in/carlos-arturo-molina-tomases-a8856a124/</a>
  • GitHub:    <a href="https://github.com/Yulix0630" target="_blank" style="color:var(--accent-primary)">github.com/Yulix0630</a>`,

    matrix: () => {
      setTimeout(() => runMatrixRain(), 100);
      return `<span class="terminal-line-success">Iniciando protocolo de transmisión cuántica...</span>`;
    },

    date: () => `<span class="terminal-line-accent">${new Date().toLocaleString('es-ES')}</span>`,

    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    },

    sudo: () => `<span class="terminal-line-error">Acceso no autorizado: Contacta a Carlos Molina para permisos de root.</span>`
  };

  function executeCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyPointer = commandHistory.length;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : null;

    let response = '';

    if (cmd === 'theme') {
      if (['quantum', 'cyberpunk', 'matrix', 'solar'].includes(arg)) {
        applyTheme(arg);
        response = `<span class="terminal-line-success">Tema cambiado exitosamente a [${arg}].</span>`;
      } else {
        response = `<span class="terminal-line-warning">Uso: theme [quantum | cyberpunk | matrix | solar]</span>`;
      }
    } else if (terminalCommands[cmd]) {
      response = terminalCommands[cmd]();
    } else {
      response = `<span class="terminal-line-error">Comando no reconocido: '${cmd}'. Escribe <span class="terminal-line-accent">help</span> para consultar los comandos disponibles.</span>`;
    }

    if (cmd !== 'clear') {
      const row = document.createElement('div');
      row.className = 'terminal-output-line';
      row.innerHTML = `
        <div style="margin-top: 0.6rem;">
          <span style="color: var(--terminal-prompt);">carlos@quantum:~$</span>
          <span style="color: var(--text-main); font-weight:600;"> ${escapeHtml(trimmed)}</span>
        </div>
        ${response ? `<div style="margin-top: 0.25rem;">${response}</div>` : ''}
      `;
      terminalOutput.appendChild(row);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function runMatrixRain() {
    let count = 0;
    const interval = setInterval(() => {
      const randomBits = Array.from({ length: 48 }, () => Math.random() > 0.5 ? '1' : '0').join('');
      const line = document.createElement('div');
      line.style.color = 'var(--accent-primary)';
      line.style.fontSize = '0.78rem';
      line.textContent = `0x${(Math.random()*0xFFFFFF<<0).toString(16).padStart(6, '0')} >> ${randomBits}`;
      terminalOutput.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      count++;
      if (count > 12) {
        clearInterval(interval);
        const done = document.createElement('div');
        done.className = 'terminal-line-success';
        done.style.marginTop = '0.4rem';
        done.textContent = '>> Flujo completado. Bienvenido al núcleo de Carlos Molina.';
        terminalOutput.appendChild(done);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    }, 90);
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      sound.terminalKey();

      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeCommand(val);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyPointer > 0) {
          historyPointer--;
          terminalInput.value = commandHistory[historyPointer] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyPointer < commandHistory.length - 1) {
          historyPointer++;
          terminalInput.value = commandHistory[historyPointer] || '';
        } else {
          historyPointer = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });

    // Quick Command Badges
    document.querySelectorAll('.terminal-badge-cmd').forEach(badge => {
      badge.addEventListener('click', () => {
        const cmd = badge.getAttribute('data-cmd');
        if (cmd) {
          terminalInput.value = cmd;
          executeCommand(cmd);
        }
      });
    });
  }

  // 8. Skill Progress Bars Animation on Scroll
  const skillSection = document.getElementById('habilidades');
  if (skillSection) {
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            const width = bar.getAttribute('data-target-width') || '85%';
            bar.style.width = width;
          });
        }
      });
    }, { threshold: 0.15 });

    observer.observe(skillSection);
  }

  // 9. Contact Form Feedback & Mailto
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre')?.value || '';
      const email = document.getElementById('email')?.value || '';
      const mensaje = document.getElementById('mensaje')?.value || '';

      sound.success();
      showToast('¡Abriendo cliente de correo para Carlos Molina!', 'success');

      // Trigger mailto directly
      const subject = encodeURIComponent(`Contacto desde Portafolio Web - ${nombre}`);
      const body = encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`);
      window.location.href = `mailto:carlosmt67@gmail.com?subject=${subject}&body=${body}`;

      contactForm.reset();
    });
  }

  // 10. Copy Email Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'carlosmt67@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        sound.success();
        showToast(`Correo copiado: ${email} 📋`, 'success');
      }).catch(() => {
        showToast('Email: carlosmt67@gmail.com', 'info');
      });
    });
  }

  // 11. Mobile Navigation Toggle
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

  // Helper Toast Notification
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = '⚡';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span>${icon}</span>
      <span style="font-weight: 500;">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
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
