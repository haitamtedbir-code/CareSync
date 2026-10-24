// Formulaires tasks : affichage des champs et du détail.

import { avatar, pill } from '../components/badges.js';
import { empty } from '../components/common.js';
import { icon } from '../components/icons.js';
import { PRIORITY, STATUS } from '../config/constants.js';
import { database, viewState } from '../core/state.js';
import { member, overdue, project, service, task } from '../services/selectors.js';
import { dialog, field, selectField, submitBtn } from '../ui/dialog-template.js';
import { dateTime, formatDate, today } from '../utils/dates.js';
import { escapeHtml } from '../utils/dom.js';

function taskForm(id) {
  const t = task(id) || {
    title: '',
    service: viewState.service || database.services[0]?.id || '',
    assignee: 'u1',
    priority: 'normal',
    status: viewState.modal.status || 'todo',
    due: viewState.day || today(),
    description: '',
    project: viewState.project || '',
  };
  return dialog(
    id ? 'Modifier la tâche' : 'Nouvelle tâche',
    /* HTML */ `<form id="task-form">
      <div class="field">
        <label for="f-title">Intitulé de la tâche *</label
        ><input
          class="input"
          id="f-title"
          name="title"
          required
          maxlength="180"
          autofocus
          placeholder="Ex. Planifier la maintenance du scanner"
          value="${escapeHtml(t.title)}"
        />
      </div>
      <div class="form-grid">
        ${selectField('Service *', 'service', database.services, t.service, 'Choisir un service', true)}${selectField(
          'Responsable',
          'assignee',
          database.members.filter((m) => m.active || m.id === t.assignee),
          t.assignee,
          'Non attribuée',
        )}${selectField(
          'Priorité',
          'priority',
          Object.entries(PRIORITY).map(([id, v]) => ({ id, name: v.label })),
          t.priority,
          'Choisir',
          true,
        )}${selectField(
          'Statut',
          'status',
          Object.entries(STATUS).map(([id, v]) => ({ id, name: v.label })),
          t.status,
          'Choisir',
          true,
        )}${field('Échéance', 'due', t.due || '', 'date')}${selectField('Projet lié', 'project', database.projects, t.project, 'Aucun projet')}
        <div class="field full">
          <label for="f-description">Description</label
          ><textarea
            class="input"
            id="f-description"
            name="description"
            maxlength="5000"
            placeholder="Précisez le contexte et le résultat attendu…"
          >
${escapeHtml(t.description)}</textarea>
        </div>
      </div>
    </form>`,
    submitBtn('task-form', id ? 'Enregistrer' : 'Créer la tâche'),
  );
}

function taskDetail(id) {
  let t = task(id);
  if (!t) return dialog('Tâche introuvable', empty('Cette tâche a été supprimée'));
  return dialog(
    'Détail de la tâche',
    /* HTML */ `<div class="task-detail-header">
        ${pill(t.priority)}<span class="muted-note"
          >${escapeHtml(service(t.service)?.name || 'Sans service')}</span
        ><span class="muted-note" style="margin-left:auto"
          >#${escapeHtml(t.id.slice(0, 7).toUpperCase())}</span
        >
      </div>
      <h2 class="task-detail-title">${escapeHtml(t.title)}</h2>
      <p style="font-size:12px;color:var(--muted);line-height:1.9;white-space:pre-wrap">
        ${escapeHtml(t.description || 'Aucune description renseignée.')}
      </p>
      <div class="detail-meta">
        <div>
          <small>Responsable</small
          ><strong style="display:flex;gap:7px;align-items:center"
            >${avatar(t.assignee, 'small')}${escapeHtml(member(t.assignee)?.name || 'Non attribuée')}</strong
          >
        </div>
        <div>
          <small>Échéance</small
          ><strong class="${overdue(t) ? 'red-text' : ''}"
            >${formatDate(t.due, { day: 'numeric', month: 'long', year: 'numeric' })}</strong
          >
        </div>
        <div>
          <small>Statut</small
          ><select
            class="input"
            data-task-status="${escapeHtml(t.id)}"
            aria-label="Statut de la tâche"
            style="font-size:11px;padding:7px"
          >
            ${Object.entries(STATUS)
              .map(
                ([id, s]) =>
                  `<option value="${id}" ${t.status === id ? 'selected' : ''}>${s.label}</option>`,
              )
              .join('')}
          </select>
        </div>
        <div>
          <small>Projet lié</small
          ><strong>${escapeHtml(project(t.project)?.name || 'Aucun projet')}</strong>
        </div>
      </div>
      <section class="task-section">
        <h3>
          ${icon('tasks', 14)}Liste de contrôle
          <span class="muted-note"
            >${(t.checklist || []).filter((c) => c.done).length}/${t.checklist?.length || 0}</span
          >
        </h3>
        ${(t.checklist || []).map((c) => /* HTML */ `<label class="checklist-row ${c.done ? 'done' : ''}"><input type="checkbox" data-checklist="${escapeHtml(c.id)}" data-task="${escapeHtml(t.id)}" ${c.done ? 'checked' : ''} /><span>${escapeHtml(c.title)}</span></label>`).join('')}
        <form id="checklist-form" class="inline-form">
          <input
            class="input"
            name="title"
            required
            maxlength="200"
            placeholder="Ajouter une étape…"
            aria-label="Nouvelle étape"
          /><button class="btn" type="submit" aria-label="Ajouter une étape">
            ${icon('plus', 15)}
          </button>
        </form>
      </section>
      <section class="task-section">
        <h3>
          ${icon('message', 14)}Commentaires
          <span class="muted-note">${t.comments?.length || 0}</span>
        </h3>
        ${(t.comments || [])
          .map(
            (c) =>
              /* HTML */ `<div class="comment">
                ${avatar(c.user || 'u1', 'small')}
                <div>
                  <strong>${escapeHtml(member(c.user || 'u1')?.name || 'Collaborateur')}</strong
                  ><small>${dateTime(c.date)}</small>
                  <p>${escapeHtml(c.text)}</p>
                </div>
              </div>`,
          )
          .join('')}
        <form id="comment-form" class="inline-form">
          <input
            class="input"
            name="text"
            required
            maxlength="2000"
            placeholder="Partager une information avec l’équipe…"
            aria-label="Nouveau commentaire"
          /><button class="btn primary" type="submit">Envoyer</button>
        </form>
      </section>`,
    /* HTML */ `<div class="task-footer">
      <button class="btn danger" data-action="delete-task" data-id="${escapeHtml(t.id)}">
        ${icon('trash', 13)}Supprimer
      </button>
      <div class="actions">
        <button class="btn" data-action="edit-task" data-id="${escapeHtml(t.id)}">
          ${icon('edit', 13)}Modifier</button
        >${t.status !== 'done' ? /* HTML */ `<button class="btn primary" data-action="complete-task" data-id="${escapeHtml(t.id)}">${icon('check', 13)}Terminer</button>` : ''}
      </div>
    </div>`,
    true,
  );
}

export { taskForm, taskDetail };
