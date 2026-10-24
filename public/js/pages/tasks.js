// Écran tasks : prépare le HTML à partir des données et des filtres.

import { avatar, pill, statusPill } from '../components/badges.js';
import { empty, heading, newTaskBtn, selectOptions } from '../components/common.js';
import { icon } from '../components/icons.js';
import { STATUS } from '../config/constants.js';
import { database, viewState } from '../core/state.js';
import { filteredTasks, member, overdue, service } from '../services/selectors.js';
import { humanDue } from '../utils/dates.js';
import { escapeHtml } from '../utils/dom.js';

function tasksPage() {
  let ts = filteredTasks();
  const pageSize = 12,
    count = Math.max(1, Math.ceil(ts.length / pageSize));
  viewState.taskPage = Math.min(viewState.taskPage, count);
  return (
    heading(
      viewState.onlyMine ? 'Mes tâches' : 'Toutes les tâches',
      `${ts.length} activités · ${ts.filter(overdue).length} en retard`,
      `${newTaskBtn()}`,
      'ACTIVITÉ HOSPITALIÈRE',
    ) +
    /* HTML */ `<section class="panel">
      <div class="toolbar">
        <div class="switcher">
          <button data-action="show-all" class="${!viewState.onlyMine ? 'on' : ''}">
            Toutes les tâches</button
          ><button data-action="show-mine" class="${viewState.onlyMine ? 'on' : ''}">
            Assignées à moi
          </button>
        </div>
        <div class="actions">
          <select data-filter="service" aria-label="Service">
            ${selectOptions(database.services, viewState.service, 'Tous les services')}</select
          ><select data-filter="status" aria-label="Statut">
            ${selectOptions(
              Object.entries(STATUS).map(([id, v]) => ({ id, name: v.label })),
              viewState.status,
              'Tous les statuts',
            )}</select
          ><button class="btn small" data-action="export-tasks">
            ${icon('download', 12)} Exporter
          </button>
        </div>
      </div>
      ${ts.length ? taskTable(ts.slice((viewState.taskPage - 1) * pageSize, viewState.taskPage * pageSize)) : empty('Aucune tâche à afficher')}
      <div class="pagination">
        <span
          >${ts.length ? (viewState.taskPage - 1) * pageSize + 1 : 0}–${Math.min(viewState.taskPage * pageSize, ts.length)}
          sur ${ts.length} tâches</span
        >
        <div>
          ${Array.from({ length: count }, (_, i) => /* HTML */ `<button class="${viewState.taskPage === i + 1 ? 'active' : ''}" data-action="task-page" data-page="${i + 1}" aria-label="Page ${i + 1}">${i + 1}</button>`).join('')}
        </div>
      </div>
    </section>`
  );
}

function taskTable(ts) {
  return /* HTML */ `<div class="table-panel">
    <table class="table">
      <thead>
        <tr>
          <th style="width:37%">Tâche</th>
          <th>Service</th>
          <th>Responsable</th>
          <th>Priorité</th>
          <th>Échéance</th>
          <th>Statut</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${ts
          .map(
            (t) =>
              /* HTML */ `<tr>
                <td>
                  <button class="name-cell" data-action="open-task" data-id="${escapeHtml(t.id)}">
                    <span style="color:${t.status === 'done' ? '#12ae8a' : '#9cb2c2'}"
                      >${icon(t.status === 'done' ? 'checkcircle' : 'tasks', 15)}</span
                    >${escapeHtml(t.title)}
                  </button>
                </td>
                <td class="muted">${escapeHtml(service(t.service)?.name || '—')}</td>
                <td>
                  <span style="display:flex;align-items:center;gap:6px"
                    >${avatar(t.assignee, 'small')}<span class="muted"
                      >${escapeHtml(member(t.assignee)?.name || 'Non attribuée')}</span
                    ></span
                  >
                </td>
                <td>${pill(t.priority)}</td>
                <td class="${overdue(t) ? 'red-text' : 'muted'}">${humanDue(t.due)}</td>
                <td>${statusPill(t.status)}</td>
                <td>
                  <button
                    class="iconbtn"
                    aria-label="Modifier ${escapeHtml(t.title)}"
                    data-action="edit-task"
                    data-id="${escapeHtml(t.id)}"
                  >
                    ${icon('edit', 13)}
                  </button>
                </td>
              </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </div>`;
}

export { tasksPage, taskTable };
