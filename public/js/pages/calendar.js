// Écran calendar : prépare le HTML à partir des données et des filtres.

import { empty, heading, panel } from '../components/common.js';
import { icon } from '../components/icons.js';
import { database, viewState } from '../core/state.js';
import { service } from '../services/selectors.js';
import { formatDate, iso, today } from '../utils/dates.js';
import { escapeHtml, sanitizeColor } from '../utils/dom.js';

function calendarPage() {
  const y = viewState.calendar.getFullYear(),
    m = viewState.calendar.getMonth(),
    first = new Date(y, m, 1),
    start = new Date(y, m, 1 - ((first.getDay() + 6) % 7)),
    month = viewState.calendar.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const items = [
    ...database.events.map((e) => ({ ...e, type: 'event' })),
    ...database.tasks
      .filter((t) => t.due && t.status !== 'done')
      .map((t) => ({
        id: t.id,
        title: t.title,
        date: t.due,
        time: '',
        service: t.service,
        type: 'task',
        color: service(t.service)?.color || '#20a5b1',
      })),
  ];
  const daily = items
    .filter((e) => e.date === viewState.day)
    .sort((a, b) => a.time.localeCompare(b.time));
  return (
    heading(
      'Calendrier',
      'Planifiez les activités et anticipez les prochaines échéances.',
      /* HTML */ `<button class="btn primary" data-action="new-event">
        ${icon('plus', 14)} Nouvel événement
      </button>`,
    ) +
    /* HTML */ `<div class="calendar-layout">
      <section class="panel">
        <div class="calendar-head">
          <div class="actions">
            <button class="btn small" data-action="cal-today">Aujourd’hui</button
            ><button class="iconbtn" data-action="cal-prev" aria-label="Mois précédent">
              <span style="transform:rotate(180deg)">${icon('chevron', 14)}</span></button
            ><button class="iconbtn" data-action="cal-next" aria-label="Mois suivant">
              ${icon('chevron', 14)}
            </button>
          </div>
          <h2>${escapeHtml(month)}</h2>
          <span class="pill blue">Vue mensuelle</span>
        </div>
        <div class="calendar-grid">
          ${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => `<div class="weekday">${d}</div>`).join('')}${Array.from(
            { length: 42 },
            (_, i) => {
              const d = new Date(start);
              d.setDate(start.getDate() + i);
              const date = iso(d),
                events = items.filter((e) => e.date === date);
              return /* HTML */ `<div
                class="day ${d.getMonth() !== m ? 'other' : ''} ${date === today() ? 'today' : ''} ${date === viewState.day ? 'selected' : ''}"
                data-action="select-day"
                data-date="${date}"
                tabindex="0"
                role="button"
                aria-label="${formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}, ${events.length} activités"
              >
                <span class="day-num">${d.getDate()}</span>${events
                  .slice(0, 2)
                  .map(
                    (e) =>
                      /* HTML */ `<button
                        class="cal-event"
                        style="--c:${sanitizeColor(e.color)}"
                        data-action="${e.type === 'task' ? 'open-task' : 'open-event'}"
                        data-id="${escapeHtml(e.id)}"
                        title="${escapeHtml(e.title)}"
                      >
                        ${escapeHtml(e.time)} ${escapeHtml(e.title)}
                      </button>`,
                  )
                  .join(
                    '',
                  )}${events.length > 2 ? /* HTML */ `<small style="font-size:8px;color:var(--muted)">+ ${events.length - 2} activités</small>` : ''}
              </div>`;
            },
          ).join('')}
        </div>
      </section>
      <div class="calendar-side">
        ${panel(
          'Programme du jour',
          /* HTML */ `<p class="muted-note" style="margin-bottom:10px">
              ${formatDate(viewState.day, { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            ${
              daily.length
                ? daily
                    .map(
                      (e) =>
                        /* HTML */ `<button
                          class="event-row"
                          data-action="${e.type === 'task' ? 'open-task' : 'open-event'}"
                          data-id="${escapeHtml(e.id)}"
                          style="text-align:left;width:100%"
                        >
                          <span style="color:${sanitizeColor(e.color)}"
                            >${escapeHtml(e.time || 'Tâche')}</span
                          >
                          <div>
                            <strong style="font-size:10px">${escapeHtml(e.title)}</strong>
                            <p>${escapeHtml(service(e.service)?.name || 'Tous les services')}</p>
                          </div>
                        </button>`,
                    )
                    .join('')
                : empty('Une journée à organiser', 'Aucune activité pour cette date.')
            }<button class="btn soft full-width" style="margin-top:18px" data-action="new-event">
              ${icon('plus', 13)} Ajouter un événement
            </button>`,
        )}
      </div>
    </div>`
  );
}

export { calendarPage };
