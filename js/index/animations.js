// ======================================
// ANIMATIONS.JS — Все анимации сайта
// ======================================

// === ГЛОБАЛЬНЫЕ ССЫЛКИ НА ЭЛЕМЕНТЫ ===
const body = document.body;
const loadingOverlay = document.querySelector('.loading-overlay');
const mamik = document.querySelector('.mamik-img');
const sections = document.querySelectorAll('.slide');

// === АНИМАЦИЯ ПРИ ЗАГРУЗКЕ ===
window.addEventListener('load', () => {
  // Плавная прокрутка при загрузке
  document.documentElement.classList.add('no-smooth');
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('no-smooth');
  });

  // Убираем overlay, показываем контент
  body.classList.add('loaded');
  if (loadingOverlay) {
    loadingOverlay.classList.add('fade-out');
    setTimeout(() => {
      if (loadingOverlay.parentNode) {
        loadingOverlay.style.display = 'none';
      }
    }, 1500);
  }

  // Сброс позиций элементов
  const teacherInfo = document.querySelector('.teacher-info');
  const resume = document.querySelector('.resume-link');
  const poem = document.querySelector('.poem-text');
  const author = document.querySelector('.poem-author');
  const esse = document.querySelector('.poem-esse');

  if (teacherInfo) {
    teacherInfo.style.transform = 'translateY(-50%) translateX(-100vw)';
  }
  if (resume) {
    resume.style.transform = 'translateY(1000px)';
  }

  if (poem) {
    setTimeout(() => {
      poem.style.opacity = '1';
      poem.style.transform = 'translateY(-50%) translateX(0)';
    }, 800);
  }

  if (author) {
    setTimeout(() => {
      author.style.opacity = '1';
      author.style.transform = 'translateY(-50%) translateX(0)';
    }, 1600);
  }

  if (esse) {
    setTimeout(() => {
      esse.classList.add('show');
    }, 2200);
  }

  if (mamik) {
    setTimeout(() => {
      mamik.style.opacity = '0.9';
      mamik.style.transform = 'translateY(0)';
    }, 1000);
  }

  // Подстраховка: если второй слайд уже в поле зрения
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

// === ОБЩИЙ НАБЛЮДАТЕЛЬ ЗА СЛАЙДАМИ ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Анимация для второго слайда
    if (entry.target.id === 'second' && entry.isIntersecting) {
      const teacherInfo = entry.target.querySelector('.teacher-info');
      const resume = entry.target.querySelector('.resume-link');

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

    // Анимация заголовка на третьем слайде
    if (entry.target.id === 'third' && entry.isIntersecting) {
      const title = entry.target.querySelector('.slide-creative-title');
      if (title && !title.classList.contains('visible')) {
        setTimeout(() => {
          title.classList.add('visible');
        }, 500);
      }
    }
  });
}, { threshold: 0.5 });

// Наблюдаем за всеми слайдами
sections.forEach(s => observer.observe(s));

// ======================================
// ANIMATIONS.JS — Все анимации сайта
// ======================================

// === АНИМАЦИЯ ГЕРОЕВ НА ТРЕТЬЕМ СЛАЙДЕ ===
document.addEventListener('DOMContentLoaded', () => {
  const thirdSlide = document.querySelector('#third');
  const characters = [
    document.querySelector('.fairy-img'),
    document.querySelector('.tiger-img'),
    document.querySelector('.squirrel-img'),
    document.querySelector('.frog-img')
  ];

  console.log('🎭 Герои третьего слайда:', characters);

  if (!thirdSlide) {
    console.warn('⚠️ #third не найден');
    return;
  }

  if (!characters.every(img => img)) {
    console.warn('⚠️ Не все изображения найдены:', characters);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    console.log('👁️ Видимость #third:', entry.isIntersecting, '—', entry.intersectionRatio);

    if (entry.isIntersecting) {
      // Сбрасываем класс, если был
      characters.forEach(img => img.classList.remove('animate-in'));

      // Добавляем с задержкой — эффект "волны"
      characters.forEach((img, i) => {
        setTimeout(() => {
          img.classList.add('animate-in');
        }, 150 * i);
      });

      // Один раз — больше не наблюдаем
      observer.unobserve(thirdSlide);
    }
  }, { threshold: 0.5 });

  observer.observe(thirdSlide);
});
