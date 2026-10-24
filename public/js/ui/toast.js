// Messages temporaires affichés après une action ou une erreur.

import { icon } from '../components/icons.js';
import { escapeHtml, select } from '../utils/dom.js';

let toastTimer;

function toast(msg, error = false) {
  clearTimeout(toastTimer);
  select('#toast').innerHTML = /* HTML */ `<div class="toast ${error ? 'error' : ''}">
    ${icon(error ? 'alert' : 'checkcircle', 17)}${escapeHtml(msg)}
  </div>`;
  toastTimer = setTimeout(() => (select('#toast').innerHTML = ''), 4400);
}

export { toast };
