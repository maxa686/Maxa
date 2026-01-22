document.addEventListener("DOMContentLoaded", () => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      document.documentElement.classList.add('touch-device');
    } else {
      document.documentElement.classList.add('no-touch');
    }

    // === КУРСОР ===
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');

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

      // Универсальный hover через mouseover/mouseout (покрывает динамические элементы)
      document.addEventListener('mouseover', (e) => {
        const target = e.target;
        if (
          target.matches('a') ||
          target.matches('.nav-line') ||
          target.matches('.fullscreen-btn') ||
          target.matches('.play-btn') ||
          target.closest('.poem-esse') ||
          target.matches('.resume-link')
        ) {
          cursor.classList.add('hover');
          dot.classList.add('hover');
        }
      });

      document.addEventListener('mouseout', (e) => {
        const target = e.target;
        if (
          target.matches('a') ||
          target.matches('.nav-line') ||
          target.matches('.fullscreen-btn') ||
          target.matches('.play-btn') ||
          target.closest('.poem-esse') ||
          target.matches('.resume-link')
        ) {
          cursor.classList.remove('hover');
          dot.classList.remove('hover');
        }
      });
    }

    // === ПАНЕЛЬ УПРАВЛЕНИЯ ===
    const controls = document.querySelector('.slide-controls');
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
    const scrollProgress = document.querySelector('.scroll-progress');
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
    const video = document.querySelector('.video-desktop');
    const playBtn = document.querySelector('.play-btn');
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
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      const customCursor = document.querySelector('.custom-cursor');
      const cursorDot = document.querySelector('.cursor-dot');

      if (isFullscreen) {
        document.documentElement.classList.add('fullscreen-enter');
        setTimeout(() => {
          document.documentElement.classList.remove('fullscreen-enter');
          document.documentElement.classList.add('fullscreen-mode');
          if (customCursor) customCursor.style.opacity = '0';
          if (cursorDot) cursorDot.style.opacity = '0';
        }, 50);
      } else {
        document.documentElement.classList.add('fullscreen-exit');
        if (customCursor) customCursor.style.opacity = '0';
        if (cursorDot) cursorDot.style.opacity = '0';
        setTimeout(() => {
          document.documentElement.classList.remove('fullscreen-exit');
          document.documentElement.classList.remove('fullscreen-mode');
          if (customCursor) customCursor.style.opacity = '1';
          if (cursorDot) cursorDot.style.opacity = '1';
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
    const sections = document.querySelectorAll('.slide');
    const links = document.querySelectorAll('.nav-line');
    const currentSpan = document.querySelector('.slide-counter .current');
    const totalSpan = document.querySelector('.slide-counter .total');
    if (totalSpan) totalSpan.textContent = sections.length;

    // === ОБЩИЙ НАБЛЮДАТЕЛЬ ЗА СЛАЙДАМИ ===
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Навигация по активному слайду
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.nav-line[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }

        // Анимация для второго слайда
        if (entry.target.id === 'second' && entry.isIntersecting) {
          const teacherInfo = document.querySelector('.teacher-info');
          const resume = document.querySelector('.resume-link');

          if (teacherInfo) {
            setTimeout(() => {
              teacherInfo.style.transform = 'translateY(-50%) translateX(0)';
            }, 300);
          }

          if (resume) {
            setTimeout(() => {
              resume.style.transform = 'translateY(0)';
            }, 600);
          }
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));

    // === УПРАВЛЕНИЕ ЗАГОЛОВКОМ ===
    let lastScrollY = window.scrollY;
    const title = document.querySelector('.slide-title');
    if (title) {
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          if (!title.classList.contains('hidden')) {
            title.classList.add('hidden');
          }
        } else if (currentScrollY < lastScrollY) {
          if (title.classList.contains('hidden')) {
            title.classList.remove('hidden');
          }
        }
        lastScrollY = currentScrollY;
      }, { passive: true });
    }

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

    // === АНИМАЦИЯ ПРИ ЗАГРУЗКЕ ===
    window.addEventListener('load', () => {
      // Принудительный скролл в начало
      document.documentElement.classList.add('no-smooth');
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-smooth');
      });

      const overlay = document.querySelector('.loading-overlay');
      const body = document.body;

      body.classList.add('loaded');
      if (overlay) overlay.classList.add('fade-out');

      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.style.display = 'none';
        }
      }, 1500);

      // Сброс: второй слайд
      const teacherInfo = document.querySelector('.teacher-info');
      const resume = document.querySelector('.resume-link');

      if (teacherInfo) {
        teacherInfo.style.transform = 'translateY(-50%) translateX(-100vw)';
      }
      if (resume) {
        resume.style.transform = 'translateY(1000px)';
      }

      // Анимация стиха
      const poem = document.querySelector('.poem-text');
      if (poem) {
        setTimeout(() => {
          poem.style.opacity = '1';
          poem.style.transform = 'translateY(-50%) translateX(0)';
        }, 800);
      }

      const author = document.querySelector('.poem-author');
      if (author) {
        setTimeout(() => {
          author.style.opacity = '1';
          author.style.transform = 'translateY(-50%) translateX(0)';
        }, 1600);
      }

      // Анимация "эссе на тему..."
      const esse = document.querySelector('.poem-esse');
      if (esse) {
        setTimeout(() => {
          esse.classList.add('show');
        }, 2200);
      }

      // Анимация мамы
      const mamik = document.querySelector('.mamik-img');
      if (mamik) {
        setTimeout(() => {
          mamik.style.opacity = '0.9';
          mamik.style.transform = 'translateY(0)';
        }, 1000);
      }

      // Проверка: если второй слайд уже виден → запустить анимацию
      setTimeout(() => {
        const secondSlide = document.querySelector('#second');
        if (!secondSlide) return;
        const rect = secondSlide.getBoundingClientRect();
        const h = window.innerHeight;
        if (rect.top < h * 0.8 && rect.bottom > h * 0.2) {
          if (teacherInfo) {
            setTimeout(() => {
              teacherInfo.style.transform = 'translateY(-50%) translateX(0)';
            }, 300);
          }
          if (resume) {
            setTimeout(() => {
              resume.style.transform = 'translateY(0)';
            }, 600);
          }
        }
      }, 100);
    });
  });

  // === ПАРАЛЛАКС ДЛЯ MAMIK ===
document.addEventListener("DOMContentLoaded", () => {
  const mamik = document.querySelector(".mamik-img");
  if (!mamik) return;

  // Настройка: насколько сильно будет двигаться кот
  const intensity = 50; // Чем больше — тем сильнее (попробуй от 5 до 30)

  // Двигаем Mamik при движении мыши
  document.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Нормализуем позицию мыши: от -0.5 до +0.5
    const x = clientX / innerWidth - 0.5;
    const y = clientY / innerHeight - 0.5;

    // Применяем смещение с инверсией (как параллакс)
    mamik.style.transform = `
  translate(${x * -intensity}px, ${y * -intensity}px)
  rotate(${x * 5}deg)
`;

  });
});
