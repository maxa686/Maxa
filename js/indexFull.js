document.addEventListener("DOMContentLoaded", () => {
  // === ПРОВЕРКА: тач-устройство? ===
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Скрываем кастомный курсор на мобильных
  if (isTouchDevice) {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    if (cursor) cursor.style.display = 'none';
    if (cursorDot) cursorDot.style.display = 'none';

    // Разрешаем нативный курсор
    document.body.style.cursor = 'default';

    // Можно скрыть и навигацию, если мешает
    const navigation = document.querySelector('.navigation');
    if (navigation) navigation.style.display = 'none';

    // Также можно скрыть .slide-controls на таче — они появятся при движении
    const controls = document.querySelector('.slide-controls');
    if (controls) {
      // Показываем на короткое время при касании
      document.addEventListener('touchstart', () => {
        controls.classList.add('visible');
        setTimeout(() => controls.classList.remove('visible'), 3000);
      }, { passive: true });
    }

    // Прерываем дальнейшую инициализацию курсора
    initDesktopOnlyFeatures(); // Вызовем только на десктопах
    return;
  }

  // === Если НЕ тач — запускаем десктопный функционал ===
  initDesktopOnlyFeatures();

  // ===================================
  // ФУНКЦИЯ: только для десктопа
  // ===================================
  function initDesktopOnlyFeatures() {
    // === 1. Кастомный курсор (остальной код) ===
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    const controls = document.querySelector('.slide-controls');

    // Показ/скрытие кнопок при движении мыши
    if (controls) {
      let hideTimeout;
      const showControls = () => {
        controls.classList.add('visible');
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => controls.classList.remove('visible'), 2000);
      };
      document.addEventListener('mousemove', showControls);
    }

    if (!cursor || !dot) {
      console.error("🔴 Курсор не найден!");
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    const ease = 0.15;

    function animate() {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      dot.style.transform = `translate(${targetX - 5}px, ${targetY - 5}px)`;

      const isHovered = cursor.classList.contains('hover');
      const scale = isHovered ? 60 / 30 : 1;

      cursor.style.transform = `
        translate(${currentX - 15}px, ${currentY - 15}px)
        scale(${scale})
      `.replace(/\s+/g, ' ').trim();

      requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    // Ховер-эффект на интерактивных элементах
    document.querySelectorAll('.nav-line, .fullscreen-btn, .play-btn').forEach(link => {
      link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // === 2. Эффект сдвига навигации === (только десктоп)
    const navLines = document.querySelectorAll('.nav-line');
    const maxTranslateX = -20;
    const threshold = 60;

    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      navLines.forEach(line => {
        const rect = line.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        const dx = mouseX - center.x;
        const dy = mouseY - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          const progress = (threshold - distance) / threshold;
          const translateX = maxTranslateX * progress;
          line.style.transform = `translateX(${translateX}px)`;
        } else {
          line.style.transform = 'translateX(0)';
        }
      });
    });

    // === 3. Отслеживание слайдов ===
    const sections = document.querySelectorAll('.slide');
    const links = document.querySelectorAll('.nav-line');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`.nav-line[href="#${id}"]`);

        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    // === 4. Управление видео и полноэкранным режимом ===
    const video = document.querySelector('.video-desktop');
    const playBtn = document.querySelector('.play-btn');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const firstSection = document.querySelector('#first');
    const overlay = document.querySelector('.fullscreen-overlay');

    if (video && playBtn && fullscreenBtn && firstSection && overlay) {
      // Play/Pause
      playBtn.addEventListener('click', () => {
        video[video.paused ? 'play' : 'pause']();
      });

      video.addEventListener('play', () => playBtn.textContent = 'pause');
      video.addEventListener('pause', () => playBtn.textContent = 'play');

      // Fullscreen с плавным переходом
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          // Вход: показываем overlay → fullscreen
          overlay.classList.add('active');
          setTimeout(() => {
            firstSection.requestFullscreen?.() ||
            firstSection.webkitRequestFullscreen?.() ||
            firstSection.mozRequestFullScreen?.() ||
            firstSection.msRequestFullscreen?.();
            fullscreenBtn.textContent = 'normal';
          }, 300);
        } else {
          // Выход: выходим из fullscreen
          document.exitFullscreen?.() ||
          document.webkitExitFullscreen?.() ||
          document.mozCancelFullScreen?.() ||
          document.msExitFullscreen?.();
          fullscreenBtn.textContent = 'full';

          // Плавное затухание
          overlay.classList.add('active');
          setTimeout(() => {
            overlay.classList.remove('active');
          }, 10);
        }
      });

      // Синхронизация текста кнопки и оверлея
      ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => {
        document.addEventListener(event, () => {
          fullscreenBtn.textContent = document.fullscreenElement ? 'normal' : 'full';
          if (!document.fullscreenElement) {
            // Убираем оверлей плавно после выхода
            setTimeout(() => {
              overlay.classList.remove('active');
            }, 400);
          }
        });
      });
    }
    // ← Конец if (video && ...)
  }
  // ← Конец initDesktopOnlyFeatures()
});
// ← Конец DOMContentLoaded
