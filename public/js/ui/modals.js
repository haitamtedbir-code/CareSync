// Ouverture, fermeture et sélection du contenu des fenêtres de dialogue.

import { icon } from '../components/icons.js';
import { viewState } from '../core/state.js';
import { eventForm } from '../forms/events.js';
import { projectDetail, projectForm } from '../forms/projects.js';
import { serviceForm } from '../forms/services.js';
import { taskDetail, taskForm } from '../forms/tasks.js';
import { userForm } from '../forms/users.js';
import { cancelBtn, dialog } from './dialog-template.js';
import { escapeHtml, select } from '../utils/dom.js';

function openModal(type, id = '', extra = {}) {
  viewState.modal = { type, id, ...extra };
  renderModal();
  requestAnimationFrame(() => {
    const target = select('#modal-root [autofocus]') || select('#modal-root .modal-head .iconbtn');
    target?.focus();
  });
}

function closeModal() {
  viewState.modal = null;
  renderModal();
}

function confirm(title, message, run, danger = true, ok = 'Confirmer') {
  openModal('confirm', '', { title, message, run, danger, ok });
}

function renderModal() {
  const m = viewState.modal;
  document.body.style.overflow = m ? 'hidden' : '';
  if (!m) {
    select('#modal-root').innerHTML = '';
    return;
  }
  let body = '';
  if (m.type === 'task-form') body = taskForm(m.id);
  if (m.type === 'task-detail') body = taskDetail(m.id);
  if (m.type === 'project-form') body = projectForm(m.id);
  if (m.type === 'project-detail') body = projectDetail(m.id);
  if (m.type === 'service-form') body = serviceForm(m.id);
  if (m.type === 'user-form') body = userForm(m.id);
  if (m.type === 'event-form') body = eventForm(m.id);
  if (m.type === 'confirm')
    body = dialog(
      escapeHtml(m.title),
      /* HTML */ `<p style="font-size:12px;line-height:1.9;color:var(--muted)">
        ${escapeHtml(m.message)}
      </p>`,
      `${cancelBtn()}<button class="btn ${m.danger ? 'danger' : 'primary'}" data-action="confirm">${escapeHtml(m.ok || 'Confirmer')}</button>`,
    );
  if (m.type === 'demo')
    body = dialog(
      'Bienvenue dans CareSync',
      /* HTML */ `<div style="display:flex;gap:12px;align-items:center;margin-bottom:18px">
          <span class="service-icon" style="--c:#0aadb7">${icon('hospital', 22)}</span
          ><strong>Des équipes coordonnées,<br />un hôpital mieux organisé.</strong>
        </div>
        <p class="muted-note">
          Cette version reprend votre maquette : tâches, Kanban, projets, calendrier, services,
          répertoire utilisateurs et rapports. Les exemples sont fictifs. Toutes vos modifications
          sont enregistrées dans le navigateur sur cet appareil.
        </p>
        <p class="muted-note" style="margin-top:15px">
          L’authentification, les permissions côté serveur, les e-mails et la synchronisation Oracle
          ne sont pas connectés. Les rôles affichés sont des données du répertoire.
        </p>
        <p class="muted-note" style="margin-top:15px">
          Exportez une sauvegarde depuis Paramètres → Sauvegardes pour conserver une copie.
        </p>`,
      /* HTML */ `<button class="btn primary" data-action="close-modal">C’est compris</button>`,
    );
  select('#modal-root').innerHTML = body;
}

export { openModal, closeModal, confirm, renderModal };
