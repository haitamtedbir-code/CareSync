// Petits éléments communs : avatar, priorité, statut et icône de service.

import { icon } from './icons.js';
import { PRIORITY, STATUS } from '../config/constants.js';
import { member, service } from '../services/selectors.js';
import { escapeHtml, initials, sanitizeColor } from '../utils/dom.js';

const avatar = (id, size = '') => {
  const m = member(id);
  return m
    ? /* HTML */ `<span
        class="avatar ${size} ${id === 'u1' ? 'me' : ''}"
        title="${escapeHtml(m.name)}"
        style="--av:${sanitizeColor(m.color)};--avbg:${sanitizeColor(m.color)}1a"
        >${escapeHtml(initials(m.name))}</span
      >`
    : `<span class="avatar ${size}" title="Non attribuée">—</span>`;
};

const pill = (p) =>
  /* HTML */ `<span class="pill ${PRIORITY[p]?.class || 'slate'}"
    >${PRIORITY[p]?.label || escapeHtml(p)}</span
  >`;

const statusPill = (s) =>
  /* HTML */ `<span
    class="pill ${s === 'done' ? 'green' : s === 'progress' ? 'blue' : s === 'waiting' ? 'orange' : s === 'review' ? 'purple' : 'slate'} dot"
    >${STATUS[s]?.label || escapeHtml(s)}</span
  >`;

const serviceBadge = (id) => {
  const s = service(id);
  return /* HTML */ `<span class="service-icon" style="--c:${sanitizeColor(s?.color)}"
    >${icon(s?.icon || 'hospital', 15)}</span
  >`;
};

export { avatar, pill, statusPill, serviceBadge };
