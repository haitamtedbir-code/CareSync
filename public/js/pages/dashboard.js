// Écran dashboard : prépare le HTML à partir des données et des filtres.

import { donut, metrics } from '../components/charts.js';
import { empty, link, panel } from '../components/common.js';
import { icon } from '../components/icons.js';
import { taskRows } from '../components/task-list.js';
import { database } from '../core/state.js';
import { activeTasks, member, progress, service } from '../services/selectors.js';
import { formatDate, humanDue, today } from '../utils/dates.js';
import { escapeHtml, sanitizeColor } from '../utils/dom.js';

function dashboard() {
  const urgents = activeTasks()
    .sort(
      (a, b) =>
        ({ urgent: 0, high: 1, normal: 2, low: 3 })[a.priority] -
          { urgent: 0, high: 1, normal: 2, low: 3 }[b.priority] ||
        (a.due || '9999').localeCompare(b.due || '9999'),
    )
    .slice(0, 5);
  let events = database.events
    .filter((e) => e.date >= today())
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return /* HTML */ `<div class="hero">
      <img src="assets/hospital.svg" alt="Illustration du centre hospitalier" />
      <div class="hero-copy">
        <div class="eyebrow">BIENVENUE DANS VOTRE ESPACE DE TRAVAIL</div>
        <h1>Bonjour ${escapeHtml((member('u1')?.name || 'Haitam').split(' ')[0])}<span>.</span></h1>
        <p>
          Voici un aperçu de l’activité de votre établissement aujourd’hui. Ensemble, gardons le
          cap.
        </p>
      </div>
      <span class="hero-tag">${icon('shield', 12)} Au service de votre organisation</span>
    </div>
    ${metrics()}
    <div class="dashboard-grid">
      <div class="column">
        ${panel(`Tâches prioritaires <span class="badge-count">${database.tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length}</span>`, /* HTML */ `<div class="urgent-list">${taskRows(urgents) || empty('Aucune tâche prioritaire')}</div>`, link('Voir tout', 'tasks'))}${panel(
          'Prochains événements',
          /* HTML */ `<div class="mini-events">
            ${
              events
                .slice(0, 3)
                .map(
                  (e) =>
                    /* HTML */ `<button
                      class="event-mini"
                      style="--c:${sanitizeColor(e.color)};text-align:left"
                      data-action="open-event"
                      data-id="${escapeHtml(e.id)}"
                    >
                      <strong>${escapeHtml(e.title)}</strong
                      ><small>${humanDue(e.date)} · ${escapeHtml(e.time)}</small>
                    </button>`,
                )
                .join('') || '<p class="muted-note">Aucun événement à venir.</p>'
            }
          </div>`,
          link('Calendrier', 'calendar'),
        )}
      </div>
      <div class="column">
        ${panel('Tâches par service', serviceChart())}${panel(
          'Au programme aujourd’hui',
          /* HTML */ `<div class="event-list">
            ${
              events
                .filter((e) => e.date === today())
                .map(
                  (e) =>
                    /* HTML */ `<button
                      class="event-row"
                      data-action="open-event"
                      data-id="${escapeHtml(e.id)}"
                      style="text-align:left"
                    >
                      <span class="event-date"
                        ><b>${escapeHtml(e.time.split(':')[0])}</b
                        ><small>H ${escapeHtml(e.time.split(':')[1])}</small></span
                      >
                      <div>
                        <strong>${escapeHtml(e.title)}</strong>
                        <p>${escapeHtml(service(e.service)?.name || 'Tous les services')}</p>
                      </div>
                    </button>`,
                )
                .join('') || '<p class="muted-note">Votre calendrier est libre aujourd’hui.</p>'
            }
          </div>`,
          link('Voir calendrier', 'calendar'),
        )}
      </div>
      <div class="column">
        ${panel('Projets en cours', projectProgressList(), link('Voir tout', 'projects'))}
        <div class="panel date-panel">
          <span>${icon('calendar', 22)}</span>
          <div>
            <strong
              >${formatDate(today(), { weekday: 'long', day: 'numeric', month: 'long' })}</strong
            ><small
              >${database.events.filter((e) => e.date === today()).length} événements programmés
              aujourd’hui</small
            >
          </div>
        </div>
        <div class="welcome-note">
          ${icon('spark', 19)}
          <div>
            <strong>Une organisation qui fait du bien.</strong>Des équipes coordonnées, un hôpital
            mieux organisé.
          </div>
        </div>
      </div>
    </div>`;
}

function serviceChart() {
  const items = database.services
    .map((s) => ({
      label: s.name,
      value: database.tasks.filter((t) => t.service === s.id).length,
      color: s.color,
    }))
    .filter((s) => s.value > 0);
  return /* HTML */ `<div class="donut-wrap">
      ${donut(items, database.tasks.length)}
      <div class="legend">
        ${items.map((s) => /* HTML */ `<div class="legend-row"><i class="legend-dot" style="background:${sanitizeColor(s.color)}"></i><span class="legend-label">${escapeHtml(s.label)}</span><b class="legend-value">${s.value}</b></div>`).join('')}
      </div>
    </div>
    <div class="legend-total">
      <span>${database.services.length} services coordonnés</span><span>Tous les statuts</span>
    </div>`;
}

function projectProgressList() {
  return /* HTML */ `<div class="progress-list">
    ${database.projects
      .filter((p) => p.status === 'active')
      .slice(0, 4)
      .map(
        (p) =>
          /* HTML */ `<button
            class="project-row"
            style="--c:${sanitizeColor(p.color)}"
            data-action="open-project"
            data-id="${escapeHtml(p.id)}"
          >
            <span class="project-icon">${icon('folder', 14)}</span>
            <div class="project-info">
              <strong>${escapeHtml(p.name)}</strong>
              <div class="progress-line">
                <span class="progress-track"><span style="width:${progress(p)}%"></span></span
                ><small>${progress(p)}%</small>
              </div>
            </div>
          </button>`,
      )
      .join('')}
  </div>`;
}

export { dashboard, serviceChart, projectProgressList };
