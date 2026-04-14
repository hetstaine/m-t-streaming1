// Set initial language from localStorage or default to 'en'
let currentLang = localStorage.getItem('lang') || 'en';

// Load translations JSON
async function loadTranslations(lang) {
  const response = await fetch(`./${lang}.json`);
  return await response.json();
}

// Localize the page
async function localizePage(lang) {
  const translations = await loadTranslations(lang);

  // TEXT & PLACEHOLDERS
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        // Set placeholder for inputs and textareas
        el.placeholder = translations[key];
      } else if (el.tagName === 'TITLE') {
        // Set page title
        document.title = translations[key];
      } else {
        el.innerText = translations[key];
      }
    } else {
      console.warn(`Missing translation for: ${key}`);
    }
  });

  // IMAGES
  document.querySelectorAll('[data-i18n-img]').forEach(img => {
    const key = img.getAttribute('data-i18n-img');
    if (translations[key]) img.src = translations[key];
  });

  // ALT TEXT
  document.querySelectorAll('[alt-key]').forEach(img => {
    const key = img.getAttribute('alt-key');
    if (translations[key]) img.alt = translations[key];
  });
  // CONTACT LOCALIZATION
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) {
      el.placeholder = translations[key];
    }
  });
}

// Fun confetti function
function spawnConfetti() {
  const confettiCount = 20;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.innerText = ['🎉', '👗', '🕶️', '💃', '👠'][Math.floor(Math.random()*5)];
    confetti.style.position = 'fixed';
    confetti.style.top = Math.random() * window.innerHeight + 'px';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.fontSize = 24 + Math.random()*16 + 'px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = 9999;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000 + Math.random()*2000);
  }
}

// Run after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initial localization
  localizePage(currentLang);

  // Language switcher
  const langSwitcher = document.getElementById('langSwitcher');
  if (langSwitcher) {
    langSwitcher.value = currentLang;
    langSwitcher.addEventListener('change', e => {
      currentLang = e.target.value;
      localStorage.setItem('lang', currentLang);
      localizePage(currentLang);
    });
  }

  // --- Easter Egg: Change all images + confetti ---
  document.addEventListener('keydown', (e) => {
    // Shift + I → trigger
    if (e.shiftKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'i') {
      const newImg = 'assets/images/fun/party.gif'; // your fun image
      document.querySelectorAll('img').forEach(img => {
        if (!img.dataset.originalSrc) img.dataset.originalSrc = img.src; // save original
        img.src = newImg;
      });
      spawnConfetti(); // fun effect
    }

    // Ctrl + Shift + R → restore original images
    if (e.shiftKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'r') {
      document.querySelectorAll('img').forEach(img => {
        if (img.dataset.originalSrc) img.src = img.dataset.originalSrc;
      });
    }
  });
});