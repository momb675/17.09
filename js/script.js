'use strict';
// Google Tag устанавливается отдельно в head каждой HTML-страницы.

const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Ручная отправка события form_submit в GA4
    if (typeof gtag === 'function') {
      gtag('event', 'form_submit', {
        form_id: 'contact-form',
        form_name: 'Учебная форма обратной связи'
      });
    }

    document.querySelector('#form-status').textContent =
      'Готово! Учебная форма проверена. Данные никуда не отправлены.';
    form.reset();
  });
}

// --- Кнопка "Посмотреть программу" ---
const programCta = document.querySelector('#program-cta');
const programPreview = document.querySelector('#program-preview');

if (programCta && programPreview) {
  programCta.addEventListener('click', () => {
    programPreview.hidden = !programPreview.hidden;

    if (typeof gtag === 'function') {
      gtag('event', 'cta_click', {
        button_name: 'program',
        page_section: 'hero'
      });
    }
  });
}