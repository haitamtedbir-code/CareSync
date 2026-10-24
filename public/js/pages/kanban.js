// Écran kanban : prépare le HTML à partir des données et des filtres.

import { avatar, pill } from '../components/badges.js';
import { heading, newTaskBtn, selectOptions } from '../components/common.js';
import { icon } from '../components/icons.js';
import { PRIORITY, STATUS } from '../config/constants.js';
import { database, viewState } from '../core/state.js';
import { filteredTasks, overdue, service } from '../services/selectors.js';
import { formatDate } from '../utils/dates.js';
import { escapeHtml, sanitizeColor } from '../utils/dom.js';

function kanban() {
  const ts = filteredTasks();
  return (
    heading(
      'Tableau Kanban',
      'Une vue claire pour faire avancer chaque activité.',
      /* HTML */ `<button class="btn" data-action="toggle-filters">
          ${icon('filter', 13)} Filtres
          ${[viewState.service, viewState.priority, viewState.person].filter(Boolean).length ? '<span class="active-filter-count">' + [viewState.service, viewState.priority, viewState.person].filter(Boolean).length + '</span>' : ''}</button
        >${newTaskBtn()}`,
      'ORGANISATION DES ÉQUIPES',
    ) +
    (viewState.filters ? filters() : '') +
    /* HTML */ `<div class="board-wrap">
      <div class="board">
        ${Object.entries(STATUS)
          .map(
            ([id, s]) =>
              /* HTML */ `<section
                class="kanban-col"
                data-drop-status="${id}"
                aria-label="${s.label}"
              >
                <h2 class="kanban-head">
                  <span><i style="--c:${s.color}"></i>${s.label}</span
                  ><small>${ts.filter((t) => t.status === id).length}</small>
                </h2>
                ${ts
                  .filter((t) => t.status === id)
                  .map((t) => kanbanCard(t))
                  .join('')}<button class="kanban-add" data-action="new-task" data-status="${id}">
                  ${icon('plus', 13)} Ajouter une tâche
                </button>
              </section>`,
          )
          .join('')}
      </div>
    </div>`
  );
}

function kanbanCard(t) {
  return /* HTML */ `<article
    class="kanban-card"
    draggable="true"
    data-drag-task="${escapeHtml(t.id)}"
  >
    <button class="card-name" data-action="open-task" data-id="${escapeHtml(t.id)}">
      ${escapeHtml(t.title)}</button
    >${pill(t.priority)}
    <div class="card-service">
      <span style="color:${sanitizeColor(service(t.service)?.color)}">${icon('hospital', 11)}</span
      >${escapeHtml(service(t.service)?.name || 'Sans service')}
    </div>
    <div class="card-foot">
      <span class="${overdue(t) ? 'red-text' : ''}">${icon('clock', 10)}${formatDate(t.due)}</span>
      <div class="counts">
        <span>${icon('message', 10)}${t.comments?.length || 0}</span>${avatar(t.assignee, 'small')}
      </div>
    </div>
  </article>`;
}

function filters() {
  return /* HTML */ `<div class="filters-box">
    <select data-filter="service" aria-label="Filtrer par service">
      ${selectOptions(database.services, viewState.service, 'Tous les services')}</select
    ><select data-filter="priority" aria-label="Filtrer par priorité">
      ${selectOptions(
        Object.entries(PRIORITY).map(([id, p]) => ({ id, name: p.label })),
        viewState.priority,
        'Toutes les priorités',
      )}</select
    ><select data-filter="person" aria-label="Filtrer par responsable">
      ${selectOptions(database.members, viewState.person, 'Tous les responsables')}</select
    ><button class="btn small ghost" data-action="clear-filters">Réinitialiser</button
    ><span class="muted-note">${filteredTasks().length} tâches</span>
  </div>`;
}

export { kanban, kanbanCard, filters };
