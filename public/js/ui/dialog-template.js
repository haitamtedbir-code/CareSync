// Structure HTML commune des fenêtres et des champs de formulaire.

import { selectOptions } from '../components/common.js';
import { icon } from '../components/icons.js';
import { escapeHtml } from '../utils/dom.js';

function field(label, name, value = '', type = 'text', options = '') {
  return /* HTML */ `<div class="field">
    <label for="f-${name}">${label}</label
    ><input
      class="input"
      id="f-${name}"
      name="${name}"
      type="${type}"
      value="${escapeHtml(value)}"
      ${options}
    />
  </div>`;
}

function selectField(
  label,
  name,
  items,
  value = '',
  placeholder = 'Sélectionner',
  required = false,
) {
  return /* HTML */ `<div class="field">
    <label for="f-${name}">${label}</label
    ><select class="input" id="f-${name}" name="${name}" ${required ? 'required' : ''}>
      ${selectOptions(items, value, placeholder)}
    </select>
  </div>`;
}

function dialog(title, body, footer = '', large = false) {
  return /* HTML */ `<div class="modal-backdrop" data-action="modal-backdrop">
    <section
      class="modal ${large ? 'large' : ''}"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <header class="modal-head">
        <h2 id="dialog-title">${title}</h2>
        <button class="iconbtn" data-action="close-modal" aria-label="Fermer">
          ${icon('close', 17)}
        </button>
      </header>
      <div class="modal-body">${body}</div>
      ${footer ? `<footer class="modal-footer">${footer}</footer>` : ''}
    </section>
  </div>`;
}

const cancelBtn = () => '<button class="btn" data-action="close-modal">Annuler</button>';

const submitBtn = (id, text = 'Enregistrer') =>
  `${cancelBtn()}<button class="btn primary" type="submit" form="${id}">${icon('check', 14)}${text}</button>`;

export { field, selectField, dialog, cancelBtn, submitBtn };
