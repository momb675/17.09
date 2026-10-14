'use strict';

// --- Форма заявки: отправка в Apps Script + generate_lead ---
(() => {
  const leadForm = document.querySelector('#lead-form');
  if (!leadForm) return;

  const params = new URLSearchParams(window.location.search);

  const defaults = {
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'not_set'
  };

  for (const [key, fallback] of Object.entries(defaults)) {
    const field = leadForm.elements.namedItem(key);
    if (field) {
      field.value = params.get(key)?.trim() || fallback;
    }
  }

  const requestId = leadForm.elements.namedItem('request_id');

  leadForm.addEventListener('submit', (event) => {
    const action = leadForm.getAttribute('action') || '';
    if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(action)) {
      event.preventDefault();
      document.querySelector('#form-status').textContent =
        'Сначала укажите URL веб-приложения Apps Script в атрибуте action.';
      return;
    }

    if (!requestId.value) {
      requestId.value = 'REQ-' + crypto.randomUUID().toUpperCase();
    }

    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        lead_source: 'contact_form'
      });
    }

    document.querySelector('#form-status').textContent =
      'Заявка отправлена. Номер: ' + requestId.value;
  });

  leadForm.addEventListener('reset', () => {
    setTimeout(() => {
      requestId.value = '';
      for (const [key, fallback] of Object.entries(defaults)) {
        const field = leadForm.elements.namedItem(key);
        if (field) {
          field.value = params.get(key)?.trim() || fallback;
        }
      }
      document.querySelector('#form-status').textContent = 'Можно заполнить новую заявку.';
    }, 0);
  });
})();

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

// --- Метрика 1. Клики по меню ---
const navLinks = document.querySelectorAll('nav a');

if (navLinks.length > 0) {
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'nav_click', {
          link_text: link.textContent.trim(),
          from_page: document.title
        });
      }
    });
  });
}

// --- Метрика 2. Метки кампании (UTM) ---
const urlParams = new URLSearchParams(window.location.search);

const utmSource = urlParams.get('utm_source');
const utmMedium = urlParams.get('utm_medium');
const utmCampaign = urlParams.get('utm_campaign');

if (utmSource) {
  if (typeof gtag === 'function') {
    gtag('event', 'utm_visit', {
      source: utmSource,
      medium: utmMedium || 'not_set',
      campaign: utmCampaign || 'not_set',
      landing_page: window.location.pathname
    });
  }
}

// --- Метрика 3. Полминуты на странице ---
let readCounted = false;

setTimeout(() => {
  if (!readCounted && !document.hidden) {
    readCounted = true;
    if (typeof gtag === 'function') {
      gtag('event', 'read_30s', {
        page: window.location.pathname
      });
    }
  }
}, 30000);

// --- Метрика 4. Ошибка формы ---
const leadFormForError = document.querySelector('#lead-form');

if (leadFormForError) {
  leadFormForError.addEventListener('invalid', (e) => {
    if (typeof gtag === 'function') {
      gtag('event', 'form_error', {
        field_name: e.target.name || 'unknown',
        field_type: e.target.type || 'unknown'
      });
    }
  }, true);
}