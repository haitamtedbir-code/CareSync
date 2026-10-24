// Formulaires projects : affichage des champs et du détail.

import { empty } from '../components/common.js';
import { icon } from '../components/icons.js';
import { taskRows } from '../components/task-list.js';
import { database } from '../core/state.js';
import { member, progress, project, service } from '../services/selectors.js';
import { dialog, field, selectField, submitBtn } from '../ui/dialog-template.js';
import { formatDate, offset } from '../utils/dates.js';
import { escapeHtml, sanitizeColor } from '../utils/dom.js';

function projectForm(id) {
  let p = project(id) || {
    name: '',
    service: database.services[0]?.id || '',
    lead: 'u1',
    due: offset(30),
    status: 'active',
    description: '',
    color: '#00a8b6',
  };
  return dialog(
    id ? 'Modifier le projet' : 'Nouveau projet',
    /* HTML */ `<form id="project-form">
      ${field('Nom du projet *', 'name', p.name, 'text', 'required maxlength="180" autofocus')}
      <div class="form-grid">
        ${selectField('Service *', 'service', database.services, p.service, 'Choisir', true)}${selectField('Responsable', 'lead', database.members, p.lead, 'Non attribué')}${field('Échéance', 'due', p.due || '', 'date')}${selectField(
          'Statut',
          'status',
          [
            { id: 'planned', name: 'Planifié' },
            { id: 'active', name: 'En cours' },
            { id: 'complete', name: 'Terminé' },
          ],
          p.status,
          'Choisir',
          true,
        )}
      </div>
      <div class="field">
        <label for="f-description">Description</label
        ><textarea class="input" id="f-description" name="description" maxlength="5000">
${escapeHtml(p.description)}</textarea>
      </div>
      ${field('Couleur du projet', 'color', p.color, 'color', 'style="height:42px;padding:5px"')}
    </form>`,
    submitBtn('project-form', id ? 'Enregistrer' : 'Créer le projet'),
  );
}

function projectDetail(id) {
  const p = project(id);
  if (!p) return dialog('Projet introuvable', empty());
  const ts = database.tasks.filter((t) => t.project === id);
  return dialog(
    'Suivi du projet',
    /* HTML */ `<span class="pill blue"
        >${escapeHtml(service(p.service)?.name || 'Tous les services')}</span
      >
      <h2 class="task-detail-title" style="margin-top:13px">${escapeHtml(p.name)}</h2>
      <p style="font-size:12px;color:var(--muted);line-height:1.9">
        ${escapeHtml(p.description || 'Aucune description.')}
      </p>
      <div class="detail-meta">
        <div>
          <small>Responsable</small
          ><strong>${escapeHtml(member(p.lead)?.name || 'Non attribué')}</strong>
        </div>
        <div><small>Échéance</small><strong>${formatDate(p.due)}</strong></div>
      </div>
      <div class="progress-line" style="--c:${sanitizeColor(p.color)};margin-block:20px">
        <span class="progress-track"><span style="width:${progress(p)}%"></span></span
        ><small>${progress(p)}%</small>
      </div>
      <h3 style="font-size:13px;margin-bottom:12px">Tâches du projet (${ts.length})</h3>
      <div class="recent-task-list">
        ${taskRows(ts.slice(0, 8)) || empty('Aucune tâche', 'Ajoutez votre première tâche à ce projet.')}
      </div>`,
    /* HTML */ `<div class="task-footer">
      <button
        class="btn danger"
        data-action="delete-project"
        data-id="${escapeHtml(id)}"
        aria-label="Supprimer le projet"
      >
        ${icon('trash', 13)}
      </button>
      <div class="actions">
        <button class="btn" data-action="edit-project" data-id="${escapeHtml(id)}">
          ${icon('edit', 13)}Modifier</button
        ><button class="btn primary" data-action="project-tasks" data-id="${escapeHtml(id)}">
          Voir les tâches ${icon('arrow', 13)}
        </button>
      </div>
    </div>`,
    true,
  );
}

export { projectForm, projectDetail };
