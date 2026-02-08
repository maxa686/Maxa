document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM загружен. Запуск скрипта...');

  // === ОПРЕДЕЛЕНИЕ УСТРОЙСТВА ===
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    document.documentElement.classList.add('touch-device');
  } else {
    document.documentElement.classList.add('no-touch');
  }

  // === ОСНОВНЫЕ ЭЛЕМЕНТЫ ===
  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.cursor-dot');
  const controls = document.querySelector('.slide-controls');
  const scrollProgress = document.querySelector('.scroll-progress');
  const video = document.querySelector('.video-desktop');
  const playBtn = document.querySelector('.play-btn');
  const fullscreenBtn = document.querySelector('.fullscreen-btn');
  const mamik = document.querySelector('.mamik-img');
  const sections = document.querySelectorAll('.slide');
  const links = document.querySelectorAll('.nav-line');
  const currentSpan = document.querySelector('.slide-counter .current');
  const totalSpan = document.querySelector('.slide-counter .total');
  const title = document.querySelector('.slide-title');
  const loadingOverlay = document.querySelector('.loading-overlay');
  const body = document.body;

  // === КУРСОР ===
  if (isTouchDevice) {
    if (cursor) cursor.remove();
    if (dot) dot.remove();
  } else if (cursor && dot) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const ease = 0.15;

    const animate = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      dot.style.transform = `translate(${targetX - 5}px, ${targetY - 5}px)`;
      cursor.style.transform = `translate(${currentX - 15}px, ${currentY - 15}px)`;
      requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    // Hover эффекты
    const handleHover = (e, add) => {
      const target = e.target;
      const isInteractive = target.matches('a') ||
        target.matches('.nav-line') ||
        target.matches('.fullscreen-btn') ||
        target.matches('.play-btn') ||
        target.closest('.poem-esse') ||
        target.matches('.resume-link');

      if (isInteractive) {
        cursor.classList[add ? 'add' : 'remove']('hover');
        dot.classList[add ? 'add' : 'remove']('hover');
      }
    };

    document.addEventListener('mouseover', (e) => handleHover(e, true));
    document.addEventListener('mouseout', (e) => handleHover(e, false));
  }

  // === ПАНЕЛЬ УПРАВЛЕНИЯ ===
  if (controls && !isTouchDevice) {
    let hideTimeout;
    const showControls = () => {
      controls.classList.add('visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => controls.classList.remove('visible'), 2000);
    };
    document.addEventListener('mousemove', showControls);
  }

  // === ПРОГРЕСС-БАР ===
  if (scrollProgress) {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight === 0 ? 0 : scrollTop / docHeight;
      scrollProgress.style.height = `${scrollPercent * 100}%`;
    };
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();
  }

  // === НАВИГАЦИЯ (плавное смещение ссылок) ===
  const navLines = document.querySelectorAll('.nav-line');
  const maxTranslateX = -20;
  const threshold = 60;
  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      const { clientX: mouseX, clientY: mouseY } = e;
      navLines.forEach(line => {
        const rect = line.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        const dx = mouseX - center.x;
        const dy = mouseY - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const progress = (threshold - distance) / threshold;
        line.style.transform = distance < threshold ? `translateX(${maxTranslateX * progress}px)` : 'translateX(0)';
      });
    });
  }

  // === ВИДЕО ===
  if (video && playBtn) {
    video.pause();
    video.currentTime = 0;
    playBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playBtn.textContent = 'stop';
        video.classList.add('fade-in-video');
      } else {
        video.classList.remove('fade-in-video');
        playBtn.textContent = 'play';
        setTimeout(() => {
          video.pause();
          video.currentTime = 0;
        }, 1600);
      }
    });
    video.addEventListener('ended', () => {
      video.classList.remove('fade-in-video');
      playBtn.textContent = 'play';
      setTimeout(() => video.pause(), 100);
    });
  }

  // === ПОЛНЫЙ ЭКРАН ===
  const handleFullscreenChange = () => {
    const isFullscreen = !!document.fullscreenElement;
    if (isFullscreen) {
      document.documentElement.classList.add('fullscreen-enter');
      setTimeout(() => {
        document.documentElement.classList.remove('fullscreen-enter');
        document.documentElement.classList.add('fullscreen-mode');
        if (cursor) cursor.style.opacity = '0';
        if (dot) dot.style.opacity = '0';
      }, 50);
    } else {
      document.documentElement.classList.add('fullscreen-exit');
      if (cursor) cursor.style.opacity = '0';
      if (dot) dot.style.opacity = '0';
      setTimeout(() => {
        document.documentElement.classList.remove('fullscreen-exit');
        document.documentElement.classList.remove('fullscreen-mode');
        if (cursor) cursor.style.opacity = '1';
        if (dot) dot.style.opacity = '1';
      }, 400);
    }
  };

  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
    .forEach(event => document.addEventListener(event, handleFullscreenChange));

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.classList.add('fullscreen-enter');
        setTimeout(() => {
          document.documentElement.requestFullscreen?.() ||
            document.documentElement.webkitRequestFullscreen?.() ||
            document.documentElement.mozRequestFullScreen?.() ||
            document.documentElement.msRequestFullscreen?.();
          fullscreenBtn.textContent = 'exit';
        }, 300);
      } else {
        document.exitFullscreen?.() ||
          document.webkitExitFullscreen?.() ||
          document.mozCancelFullScreen?.() ||
          document.msExitFullscreen?.();
        fullscreenBtn.textContent = 'full';
      }
    });
  }

  // === СЧЁТЧИК И НАВИГАЦИЯ ===
  if (totalSpan) totalSpan.textContent = sections.length;

// === НАБЛЮДАТЕЛЬ ДЛЯ АНИМАЦИЙ ЗАГОЛОВКОВ ===
const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const target = entry.target;

    if (entry.isIntersecting) {
      // Удаляем класс для перезапуска анимации
      target.classList.remove('visible');
      // Форсируем перерисовку
      void target.offsetWidth;
      // Добавляем обратно — анимация запустится
      target.classList.add('visible');
    } else {
      target.classList.remove('visible');
    }
  });
}, { threshold: 0.5 });

// Наблюдаем все нужные заголовки
document.querySelectorAll('.slide-photoalbum-title, .slide-creative-title, .slide-1september-title, .slide-title').forEach(title => {
  titleObserver.observe(title);
});

  // Общая навигация и анимации
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-line[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }

      // Анимации при пересечении
      if (entry.target.id === 'second' && entry.isIntersecting) {
        const teacherInfo = entry.target.querySelector('.teacher-info');
        const resume = entry.target.querySelector('.resume-link');
        if (teacherInfo) setTimeout(() => teacherInfo.style.transform = 'translateY(-50%) translateX(0)', 300);
        if (resume) setTimeout(() => resume.style.transform = 'translateY(0)', 600);
      }

      if (entry.target.id === 'third' && entry.isIntersecting) {
        const title = entry.target.querySelector('.slide-creative-title');
        if (title && !title.classList.contains('visible')) {
          setTimeout(() => title.classList.add('visible'), 500);
        }
      }
    });
  }, { threshold: 0.5 });
  // Начинаем наблюдать за всеми слайдами
    sections.forEach(section => observer.observe(section)); 


  // === СЧЁТЧИК СЛАЙДОВ ===
  const updateSlideCounter = () => {
    const h = window.innerHeight;
    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect();
      if (r.top < h * 0.5 && r.bottom > h * 0.5) {
        if (currentSpan) currentSpan.textContent = i + 1;
        break;
      }
    }
  };
  updateSlideCounter();
  window.addEventListener('scroll', updateSlideCounter);

  // === ПАРАЛЛАКС MAMIK ===
  if (mamik) {
    const intensity = 50;
    document.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = clientX / innerWidth - 0.5;
      const y = clientY / innerHeight - 0.5;
      mamik.style.transform = `translate(${x * -intensity}px, ${y * -intensity}px) rotate(${x * 5}deg)`;
    });
  }

  // === ПОЛНОЭКРАННАЯ ПРОКРУТКА ===
  const slideCount = sections.length;
  let isScrolling = false;
  let currentSlide = 0;

  function getSlidePositions() {
    return Array.from(sections).map(s => {
      const rect = s.getBoundingClientRect();
      return window.scrollY + rect.top;
    });
  }

  function goToSlide(index) {
    if (index < 0 || index >= slideCount || isScrolling) return;
    isScrolling = true;
    currentSlide = index;
    window.scrollTo(0, getSlidePositions()[index]);
    setTimeout(() => isScrolling = false, 200);
  }

  // Колесо мыши
  document.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) < 50) return;
    if (isScrolling) {
      e.preventDefault();
      return;
    }
    const direction = e.deltaY > 0 ? 1 : -1;
    const nextSlide = currentSlide + direction;
    if (nextSlide >= 0 && nextSlide < slideCount) {
      e.preventDefault();
      goToSlide(nextSlide);
    }
  }, { passive: false });

  // Тач-жесты
  let touchStartY = 0;
  let touchEndY = 0;

  document.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchmove', (e) => { touchEndY = e.touches[0].clientY; }, { passive: true });

  document.addEventListener('touchend', () => {
    if (isScrolling) return;
    const threshold = 40;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) < threshold) return;
    const direction = diff > 0 ? 1 : -1;
    const nextSlide = currentSlide + direction;
    if (nextSlide >= 0 && nextSlide < slideCount) {
      goToSlide(nextSlide);
    }
  });

  // Обновление текущего слайда при скролле
  function updateCurrentSlide() {
    const scrollY = window.scrollY + window.innerHeight / 2;
    const positions = getSlidePositions();
    let closest = 0;
    let minDist = Infinity;
    positions.forEach((pos, i) => {
      const dist = Math.abs(pos - scrollY);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    currentSlide = closest;
  }

  window.addEventListener('scroll', updateCurrentSlide, { passive: true });
  updateCurrentSlide();

  // === НАВИГАЦИЯ ПО КЛИКУ (ТОЛЬКО ОДИН ОБРАБОТЧИК!) ===
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetSlide = document.getElementById(targetId);
      if (!targetSlide) return;
      const slideIndex = Array.from(sections).indexOf(targetSlide);
      goToSlide(slideIndex);
    });
  });

  console.log('✅ Всё работает: курсор, прокрутка, анимации, герои сказки');
});
