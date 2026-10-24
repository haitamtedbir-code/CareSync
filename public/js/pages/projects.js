// Écran projects : prépare le HTML à partir des données et des filtres.

import { avatar } from '../components/badges.js';
import { empty, heading, selectOptions } from '../components/common.js';
import { icon } from '../components/icons.js';
import { database, viewState } from '../core/state.js';
import { member, progress, service } from '../services/selectors.js';
import { formatDate } from '../utils/dates.js';
import { escapeHtml, sanitizeColor } from '../utils/dom.js';

function projectsPage() {
  const q = viewState.search.toLowerCase();
  const ps = database.projects.filter(
    (p) =>
      (!viewState.service || p.service === viewState.service) &&
      (!q ||
        [p.name, p.description, service(p.service)?.name].some((v) =>
          v?.toLowerCase().includes(q),
        )),
  );
  const control = /* HTML */ `<div class="switcher">
      <button
        class="${viewState.projectView === 'table' ? 'on' : ''}"
        data-action="project-view"
        data-view="table"
        aria-label="Vue tableau"
      >
        ${icon('tasks', 14)}</button
      ><button
        class="${viewState.projectView === 'grid' ? 'on' : ''}"
        data-action="project-view"
        data-view="grid"
        aria-label="Vue cartes"
      >
        ${icon('grid', 14)}
      </button>
    </div>
    <button class="btn primary" data-action="new-project">
      ${icon('plus', 14)} Nouveau projet
    </button>`;
  return (
    heading('Projets', 'Des objectifs partagés, des avancées visibles.', control) +
    /* HTML */ `<div class="actions" style="margin-bottom:18px">
      <select
        class="input"
        style="width:220px;padding:9px 11px;font-size:11px"
        data-filter="service"
        aria-label="Filtrer les projets par service"
      >
        ${selectOptions(database.services, viewState.service, 'Tous les services')}</select
      ><span class="muted-note">${ps.length} projets</span>
    </div>` +
    (ps.length
      ? viewState.projectView === 'grid'
        ? /* HTML */ `<div class="project-grid">
            ${ps
              .map(
                (p) =>
                  /* HTML */ `<section
                    class="panel project-card"
                    style="--c:${sanitizeColor(p.color)}"
                  >
                    <div class="project-card-top">
                      <span class="project-icon">${icon('folder', 21)}</span
                      ><span class="pill ${p.status === 'active' ? 'blue' : 'slate'} dot"
                        >${p.status === 'active' ? 'En cours' : p.status === 'complete' ? 'Terminé' : 'Planifié'}</span
                      >
                    </div>
                    <button
                      data-action="open-project"
                      data-id="${escapeHtml(p.id)}"
                      style="text-align:left;padding:0"
                    >
                      <h3>${escapeHtml(p.name)}</h3>
                    </button>
                    <p>${escapeHtml(p.description)}</p>
                    <div class="progress-line">
                      <span class="progress-track"><span style="width:${progress(p)}%"></span></span
                      ><small>${progress(p)}%</small>
                    </div>
                    <div class="project-card-footer">
                      <span style="display:flex;gap:6px;align-items:center"
                        >${avatar(p.lead, 'small')}${escapeHtml(service(p.service)?.name || '—')}</span
                      ><span>${formatDate(p.due)}</span>
                    </div>
                  </section>`,
              )
              .join('')}
          </div>`
        : /* HTML */ `<div class="panel table-panel">
            <table class="table">
              <thead>
                <tr>
                  <th>Nom du projet</th>
                  <th>Service</th>
                  <th>Responsable</th>
                  <th>Avancement</th>
                  <th>Échéance</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${ps
                  .map(
                    (p) =>
                      /* HTML */ `<tr>
                        <td>
                          <button
                            class="name-cell"
                            data-action="open-project"
                            data-id="${escapeHtml(p.id)}"
                          >
                            <span class="service-icon" style="--c:${sanitizeColor(p.color)}"
                              >${icon('folder', 15)}</span
                            >${escapeHtml(p.name)}
                          </button>
                        </td>
                        <td class="muted">${escapeHtml(service(p.service)?.name || '—')}</td>
                        <td class="muted">${escapeHtml(member(p.lead)?.name || '—')}</td>
                        <td>
                          <div
                            class="progress-line"
                            style="--c:${sanitizeColor(p.color)};min-width:85px;margin:0"
                          >
                            <span class="progress-track"
                              ><span style="width:${progress(p)}%"></span></span
                            ><small>${progress(p)}%</small>
                          </div>
                        </td>
                        <td class="muted">${formatDate(p.due)}</td>
                        <td>
                          <span
                            class="pill ${p.status === 'active' ? 'blue' : p.status === 'complete' ? 'green' : 'slate'} dot"
                            >${p.status === 'active' ? 'En cours' : p.status === 'complete' ? 'Terminé' : 'Planifié'}</span
                          >
                        </td>
                        <td>
                          <button
                            class="iconbtn"
                            data-action="edit-project"
                            data-id="${escapeHtml(p.id)}"
                            aria-label="Modifier le projet"
                          >
                            ${icon('edit', 13)}
                          </button>
                        </td>
                      </tr>`,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>`
      : empty('Aucun projet trouvé'))
  );
}

export { projectsPage };
