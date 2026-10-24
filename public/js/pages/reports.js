// Écran reports : prépare le HTML à partir des données et des filtres.

import { serviceBadge } from '../components/badges.js';
import { donut, metrics } from '../components/charts.js';
import { heading, panel } from '../components/common.js';
import { icon } from '../components/icons.js';
import { database } from '../core/state.js';
import { overdue } from '../services/selectors.js';
import { formatDate, today } from '../utils/dates.js';
import { escapeHtml, sanitizeColor } from '../utils/dom.js';

function reportsPage() {
  const services = database.services;
  const max = Math.max(
    1,
    ...services.map((s) => database.tasks.filter((t) => t.service === s.id).length),
  );
  const projects = [
    {
      label: 'En cours',
      value: database.projects.filter((p) => p.status === 'active').length,
      color: '#0db7b7',
    },
    {
      label: 'Planifiés',
      value: database.projects.filter((p) => p.status === 'planned').length,
      color: '#8d78cf',
    },
    {
      label: 'Terminés',
      value: database.projects.filter((p) => p.status === 'complete').length,
      color: '#13af8c',
    },
  ];
  return (
    heading(
      'Rapports & statistiques',
      'Transformez l’activité de vos équipes en indicateurs utiles.',
      /* HTML */ `<button class="btn" data-action="export-tasks">
        ${icon('download', 14)} Exporter le rapport CSV
      </button>`,
      'PILOTAGE DE L’ÉTABLISSEMENT',
    ) +
    metrics() +
    /* HTML */ `<div class="reports-grid">
        ${panel(
          'Activité par service',
          /* HTML */ `<p class="muted-note">Répartition actuelle des tâches par statut</p>
            <div class="bar-chart">
              ${services
                .map((s) => {
                  let ts = database.tasks.filter((t) => t.service === s.id);
                  return /* HTML */ `<div class="bar-group">
                    ${[
                      ['done', '#16b99f'],
                      ['progress', '#38a0e6'],
                      ['late', '#f07886'],
                    ]
                      .map(([st, c]) => {
                        let n = ts.filter((t) =>
                          st === 'late' ? overdue(t) : t.status === st,
                        ).length;
                        return /* HTML */ `<span
                          style="--c:${c};height:${(n / max) * 100}%;"
                          title="${escapeHtml(s.name)} : ${n} ${st === 'done' ? 'terminées' : st === 'progress' ? 'en cours' : 'en retard'}"
                          ><i>${n || ''}</i></span
                        >`;
                      })
                      .join('')}<label>${escapeHtml(s.code)}</label>
                  </div>`;
                })
                .join('')}
            </div>
            <div class="chart-legend">
              <span><i style="--c:#16b99f"></i>Terminées</span
              ><span><i style="--c:#38a0e6"></i>En cours</span
              ><span><i style="--c:#f07886"></i>En retard</span>
            </div>`,
        )}${panel(
          'Répartition des projets',
          /* HTML */ `<div class="donut-wrap" style="padding-block:30px">
              ${donut(projects, database.projects.length, 'Projets')}
              <div class="legend">
                ${projects.map((p) => /* HTML */ `<div class="legend-row"><i class="legend-dot" style="background:${p.color}"></i><span class="legend-label">${p.label}</span><b>${p.value}</b></div>`).join('')}
              </div>
            </div>
            <p class="muted-note">
              Les indicateurs sont calculés à partir des données de votre espace.
            </p>`,
        )}
      </div>
      <section class="panel" style="margin-top:22px">
        <div class="panel-head">
          <h2>Suivi de la charge par service</h2>
          <span class="muted-note"
            >${formatDate(today(), { day: 'numeric', month: 'long', year: 'numeric' })}</span
          >
        </div>
        <div class="table-panel">
          <table class="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Total</th>
                <th>En cours</th>
                <th>Terminées</th>
                <th>En retard</th>
                <th>Taux de réalisation</th>
              </tr>
            </thead>
            <tbody>
              ${services
                .map((s) => {
                  let ts = database.tasks.filter((t) => t.service === s.id);
                  let done = ts.filter((t) => t.status === 'done').length;
                  return /* HTML */ `<tr>
                    <td>
                      <span class="name-cell">${serviceBadge(s.id)}${escapeHtml(s.name)}</span>
                    </td>
                    <td>${ts.length}</td>
                    <td>${ts.filter((t) => t.status === 'progress').length}</td>
                    <td class="green-text">${done}</td>
                    <td class="red-text">${ts.filter(overdue).length}</td>
                    <td>
                      <div
                        class="progress-line"
                        style="--c:${sanitizeColor(s.color)};max-width:130px"
                      >
                        <span class="progress-track"
                          ><span
                            style="width:${ts.length ? (done / ts.length) * 100 : 0}%"
                          ></span></span
                        ><small>${ts.length ? Math.round((done / ts.length) * 100) : 0}%</small>
                      </div>
                    </td>
                  </tr>`;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </section>`
  );
}

export { reportsPage };
