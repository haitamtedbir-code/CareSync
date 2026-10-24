// Écran services : prépare le HTML à partir des données et des filtres.

import { serviceBadge } from '../components/badges.js';
import { empty, heading } from '../components/common.js';
import { icon } from '../components/icons.js';
import { database, viewState } from '../core/state.js';
import { escapeHtml } from '../utils/dom.js';

function servicesPage() {
  const q = viewState.search.toLowerCase(),
    ss = database.services.filter((s) =>
      [s.name, s.chief].some((v) => v.toLowerCase().includes(q)),
    );
  return (
    heading(
      'Services hospitaliers',
      'Des services connectés, une meilleure coordination.',
      /* HTML */ `<button class="btn primary" data-action="new-service">
        ${icon('plus', 14)} Nouveau service
      </button>`,
    ) +
    /* HTML */ `<div class="service-cards">
        ${database.services
          .slice(0, 4)
          .map(
            (s) =>
              /* HTML */ `<button
                class="panel service-summary"
                data-action="service-tasks"
                data-id="${escapeHtml(s.id)}"
              >
                ${serviceBadge(s.id)}<span
                  ><strong>${escapeHtml(s.name)}</strong
                  ><small
                    >${database.tasks.filter((t) => t.service === s.id && t.status !== 'done').length}
                    tâches en cours</small
                  ></span
                >
              </button>`,
          )
          .join('')}
      </div>
      <section class="panel table-panel">
        <table class="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Chef de service</th>
              <th>Tâches</th>
              <th>Projets</th>
              <th>Membres</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${ss
              .map(
                (s) =>
                  /* HTML */ `<tr>
                    <td>
                      <button
                        class="name-cell"
                        data-action="service-tasks"
                        data-id="${escapeHtml(s.id)}"
                      >
                        ${serviceBadge(s.id)}${escapeHtml(s.name)}
                      </button>
                    </td>
                    <td class="muted">${escapeHtml(s.chief)}</td>
                    <td>${database.tasks.filter((t) => t.service === s.id).length}</td>
                    <td>${database.projects.filter((p) => p.service === s.id).length}</td>
                    <td>${database.members.filter((m) => m.service === s.id).length}</td>
                    <td><span class="pill green dot">Actif</span></td>
                    <td>
                      <button
                        class="iconbtn"
                        data-action="edit-service"
                        data-id="${escapeHtml(s.id)}"
                        aria-label="Modifier ${escapeHtml(s.name)}"
                      >
                        ${icon('edit', 13)}
                      </button>
                    </td>
                  </tr>`,
              )
              .join('')}
          </tbody>
        </table>
        ${ss.length ? '' : empty('Aucun service trouvé')}
      </section>`
  );
}

export { servicesPage };
