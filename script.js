/* ==========================================================================
   Core Functionality & Interactivity: script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Menu Toggler
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  };

  hamburger.addEventListener('click', toggleMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });


  // 2. Scroll Header Styling & Navigation Active State
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Add scrolled class to header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial execution


  // 3. Dynamic Typewriter Animation
  const typedTextSpan = document.getElementById('typed-text');
  const roles = [
    "Computer Science Engineering Student",
    "Aspiring Software Developer",
    "Problem Solver",
    "Full-Stack Developer"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const type = () => {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting speed is faster
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    // Handle role typing switches
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  };

  // Start typing animation
  if (typedTextSpan) {
    setTimeout(type, 1000);
  }


  // 4. Cursor Tracker for Glowing Cards (Mouse Hover Effect)
  const glowCards = document.querySelectorAll('.glow-card');

  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position inside the card
      const y = e.clientY - rect.top;  // y position inside the card
      
      // Pass coordinates to CSS custom variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // 5. Scroll-Triggered Reveal Animations & Skill Bars
  const reveals = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-progress-bar');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // If the revealed element contains skill progress bars, animate them
        if (entry.target.id === 'skills') {
          skillBars.forEach(bar => {
            const targetPct = bar.getAttribute('data-percent');
            bar.style.width = targetPct;
          });
        }
        
        observer.unobserve(entry.target); // Play animation once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });


  // 6. Interactive High-Performance Canvas Particle System
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let particleCount = 60;
  const connectionDistance = 120;
  
  // Mouse position tracker for canvas connection lines
  let mouse = {
    x: null,
    y: null,
    radius: 150
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle resizing canvas dynamically
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Adjust density based on screen size
    if (window.innerWidth < 768) {
      particleCount = 25;
    } else {
      particleCount = 70;
    }
    initParticles();
  };

  // Particle Class blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap-around bounds or bounce
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Slight cursor attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < mouse.radius) {
          // Soft pull
          this.x += dx * 0.005;
          this.y += dy * 0.005;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.fill();
    }
  }

  const initParticles = () => {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  };

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw line to cursor if in range
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  };

  // Main animation render loop
  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    drawLines();
    requestAnimationFrame(animateParticles);
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateParticles();


  // 7. Contact Form Handler (Mock API Submission)
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const statusMsg = document.getElementById('form-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Visual feedback: submitting...
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending...';
      statusMsg.style.display = 'none';

      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;

      // Mock processing delay (1.2 seconds)
      setTimeout(() => {
        // Validation check (basic)
        if (name && email && subject && message) {
          statusMsg.className = 'form-status success';
          statusMsg.textContent = 'Thank you, Abhi! Your message was sent successfully. I will get back to you shortly.';
          contactForm.reset();
        } else {
          statusMsg.className = 'form-status error';
          statusMsg.textContent = 'Oops! Please verify that all input fields are completed correctly.';
        }

        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
      }, 1200);
    });
  }

});
