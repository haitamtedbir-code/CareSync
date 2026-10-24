// Petits outils pour lire le DOM et sécuriser les valeurs insérées dans le HTML.

const select = (s) => document.querySelector(s);

const selectAll = (s) => [...document.querySelectorAll(s)];

const escapeHtml = (v) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

const sanitizeColor = (v) => (/^#[a-f\d]{3,8}$/i.test(v || '') ? v : '#139bac');

const initials = (name) =>
  name
    .replace(/^(Dr\.|Mme|M\.)\s*/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join('');

export { select, selectAll, escapeHtml, sanitizeColor, initials };
