// Mise en page réutilisable pour les titres, les panneaux et les champs de filtre.

import { icon } from './icons.js';
import { escapeHtml } from '../utils/dom.js';

function heading(title, sub, actions = '', eyebrow = 'ESPACE HOSPITALIER') {
  return /* HTML */ `<div class="page-heading">
    <div>
      <div class="eyebrow">${escapeHtml(eyebrow)}</div>
      <h1>${title}</h1>
      ${sub ? `<p>${sub}</p>` : ''}
    </div>
    <div class="actions">${actions}</div>
  </div>`;
}

function empty(
  title = 'Aucun résultat',
  sub = 'Essayez un autre filtre ou ajoutez un nouvel élément.',
) {
  return /* HTML */ `<div class="empty">
    ${icon('search', 28)}
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(sub)}</p>
  </div>`;
}

function panel(title, body, action = '', cls = '') {
  return /* HTML */ `<section class="panel ${cls}">
    <div class="panel-head">
      <h2>${title}</h2>
      ${action}
    </div>
    <div class="panel-body">${body}</div>
  </section>`;
}

const link = (text, page) =>
  /* HTML */ `<button class="link" data-action="navigate" data-page="${page}">
    ${text}${icon('chevron', 10)}
  </button>`;

function selectOptions(items, value, placeholder) {
  return (
    `<option value="">${escapeHtml(placeholder)}</option>` +
    items
      .map(
        (s) =>
          /* HTML */ `<option value="${escapeHtml(s.id)}" ${value === s.id ? 'selected' : ''}>
            ${escapeHtml(s.name)}
          </option>`,
      )
      .join('')
  );
}

function newTaskBtn() {
  return /* HTML */ `<button class="btn primary" data-action="new-task">
    ${icon('plus', 14)} Nouvelle tâche
  </button>`;
}

export { heading, empty, panel, link, selectOptions, newTaskBtn };
