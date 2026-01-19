document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.cursor-dot');
  const video = document.querySelector('.video-desktop');
  const effects = document.querySelector('.effects');
  const fullscreenBtn = document.querySelector('.fullscreen-btn');
const playBtn = document.querySelector('.play-btn');
const firstSlide = document.querySelector('#first');

if (video && playBtn) {
  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playBtn.textContent = 'stop';
    } else {
      video.pause();
      playBtn.textContent = 'play';
    }
  });

  // Опционально: клик по слайду
  if (firstSlide) {
    firstSlide.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playBtn.textContent = 'stop';
      } else {
        video.pause();
        playBtn.textContent = 'play';
      }
    });
  }
}

  if (!cursor || !dot) {
    console.warn("🟡 Курсор не найден — проверь .custom-cursor и .cursor-dot");
  }

  // ========================================================================
  // 2. 🖱️ КАСТОМНЫЙ КУРСОР: ПЛАВНОЕ ДВИЖЕНИЕ
  // ========================================================================
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  const ease = 0.15;

  // Переменные для магнит-эффекта
  const magnetButtons = [fullscreenBtn, playBtn].filter(Boolean);
  const magnetRadius = 120;
  const magnetStrength = 0.4;

  function animate() {
   // === МАГНИТ-ЭФФЕКТ (внутри animate) ===
let magnetized = false;
let finalX = targetX;
let finalY = targetY;

for (const btn of magnetButtons) {
  if (!btn) continue;
  const rect = btn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;

  const dx = targetX - btnCenterX;
  const dy = targetY - btnCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < magnetRadius) {
    const attractX = btnCenterX - targetX;
    const attractY = btnCenterY - targetY;
    const force = (1 - distance / magnetRadius) * magnetStrength;

    finalX = targetX + attractX * force;
    finalY = targetY + attractY * force;

    magnetized = true;
    // ❌ НЕ ДОБАВЛЯЕМ hover! Только магнит тянет
  }
}

// ✅ А вот hover — только от mouseenter/mouseleave

    if (!magnetized && cursor.classList.contains('hover')) {
      cursor.classList.remove('hover');
    }

    // === ПЛАВНОЕ ДВИЖЕНИЕ ===
    currentX += (finalX - currentX) * ease;
    currentY += (finalY - currentY) * ease;

    // Точка — следует за мышью (или магнитом)
    dot.style.transform = `translate(${finalX - 5}px, ${finalY - 5}px)`;

    // Основной курсор — плавно + масштаб при hover
    const isHovered = cursor.classList.contains('hover');
    const scale = isHovered ? 100 / 30 : 1;

cursor.style.transform = `
  translate(${currentX}px, ${currentY}px)
  translate(-50%, -50%)
  scale(${scale})
`.replace(/\s+/g, ' ').trim();;

    requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

// ========================================================================
// 4. 🎯 HOVER-ЭФФЕКТ ДЛЯ КЛИКАБЕЛЬНЫХ ЭЛЕМЕНТОВ
// ========================================================================
const hoverableSelectors = [
  'a',
  'button',
  '[role="button"]',
  '[data-hover]',
  '.btn',
  '.button',
  '.custom-cursor-hover',
  '.nav-line'
].join(', ');

document.querySelectorAll(hoverableSelectors).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
  });
});

  // ========================================================================
  // 5. 🔁 ЭФФЕКТ СДВИГА ДЛЯ .nav-line
  // ========================================================================
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

  // ========================================================================
  // 6. 📍 ПОДСВЕТКА АКТИВНОГО СЛАЙДА
  // ========================================================================
  const sections = document.querySelectorAll('.slide');
  const links = document.querySelectorAll('.nav-line');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const link = document.querySelector(`.nav-line[href="#${id}"]`);
        links.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));

  // ========================================================================
  // 7. 🖥️ ПОЛНОЭКРАННЫЙ РЕЖИМ
  // ========================================================================
  if (fullscreenBtn && video && effects && cursor && dot) {
    let isFullscreen = false;

    function toggleCustomCursor(visible) {
      if (visible) {
        cursor.style.opacity = '1';
        dot.style.opacity = '1';
        document.body.style.cursor = 'none';
      } else {
        cursor.style.opacity = '0';
        dot.style.opacity = '0';
        document.body.style.cursor = 'default';
      }
    }

    fullscreenBtn.addEventListener('click', async () => {
      const first = document.getElementById('first');
      if (!first) {
        console.error("❌ Элемент #first не найден");
        return;
      }

      if (!isFullscreen) {
        try {
          await first.requestFullscreen();
          effects.style.opacity = '0';
          fullscreenBtn.textContent = 'min';
          isFullscreen = true;
        } catch (err) {
          console.error("❌ Ошибка:", err.message);
        }
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          effects.style.opacity = '0.6';
          fullscreenBtn.textContent = 'full';
          isFullscreen = false;
        }
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        toggleCustomCursor(false);
        effects.style.opacity = '0';
        fullscreenBtn.textContent = 'min';
        isFullscreen = true;
      } else {
        toggleCustomCursor(true);
        effects.style.opacity = '0.6';
        fullscreenBtn.textContent = 'full';
        isFullscreen = false;
      }
    });
  }

  // ========================================================================
  // 8. ▶️ УПРАВЛЕНИЕ ВИДЕО
  // ========================================================================
  if (playBtn && video) {
    let isPlaying = false;

    playBtn.addEventListener('click', () => {
      if (!isPlaying) {
        video.play().catch(err => {
          console.error("❌ Ошибка воспроизведения видео:", err.message);
        });
        playBtn.textContent = 'stop';
        isPlaying = true;
      } else {
        video.pause();
        playBtn.textContent = 'play';
        isPlaying = false;
      }
    });
  }

  // ========================================================================
  // 9. 👁️ ПОЯВЛЕНИЕ КНОПОК
  // ========================================================================
  const controls = document.querySelector('.slide-controls');
  if (controls) {
    let hideTimeout;

    const showControls = () => {
      controls.classList.add('visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        controls.classList.remove('visible');
      }, 2000);
    };

    document.addEventListener('mousemove', showControls);
    controls.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    controls.addEventListener('mouseleave', showControls);
  }
});
