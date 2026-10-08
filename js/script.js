'use strict';

// --- Форма заявки: generate_lead ---
const leadForm = document.querySelector('#lead-form');

if (leadForm) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        lead_source: 'contact_form'
      });
    }

    const status = document.querySelector('#form-status');
    if (status) {
      status.textContent = 'Учебная форма проверена. Данные не отправлены.';
    }
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