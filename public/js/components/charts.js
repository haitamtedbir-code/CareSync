// Indicateurs et graphiques calculés depuis les données de l’espace.

import { icon } from './icons.js';
import { database } from '../core/state.js';
import { overdue } from '../services/selectors.js';

function metrics() {
  const vals = [
    [
      'Total des tâches',
      database.tasks.length,
      'tasks',
      '#0aa5b0',
      'Toutes les activités de l’établissement',
    ],
    [
      'En cours',
      database.tasks.filter((t) => t.status === 'progress').length,
      'clock',
      '#468fee',
      'Les équipes sont à l’œuvre',
    ],
    [
      'En retard',
      database.tasks.filter(overdue).length,
      'alert',
      '#f16b7b',
      'À prioriser avec les services',
    ],
    [
      'Terminées',
      database.tasks.filter((t) => t.status === 'done').length,
      'checkcircle',
      '#11b18b',
      'Des avancées concrètes, ensemble',
    ],
  ];
  return /* HTML */ `<div class="metrics">
    ${vals
      .map(
        ([label, value, ic, c, desc]) =>
          /* HTML */ `<div class="metric" style="--c:${c}">
            <div class="metric-icon">${icon(ic, 18)}</div>
            <div class="metric-content">
              <span class="metric-label">${label}</span>
              <div class="metric-top">
                <strong class="metric-value">${value}</strong
                ><span class="metric-ratio"
                  >${database.tasks.length ? Math.round((value / database.tasks.length) * 100) : 0}%</span
                >
              </div>
              <p class="metric-detail">${desc}</p>
            </div>
          </div>`,
      )
      .join('')}
  </div>`;
}

function donut(items, total, label = 'Tâches') {
  let n = 0;
  const stops = items
    .filter((i) => i.value > 0)
    .map((i) => {
      let start = n;
      n += (i.value / (total || 1)) * 100;
      return `${i.color} ${start}% ${n}%`;
    })
    .join(',');
  return /* HTML */ `<div
    class="donut"
    style="background:conic-gradient(${stops || '#e4edf3 0% 100%'})"
  >
    <div class="donut-text"><strong>${total}</strong><small>${label}</small></div>
  </div>`;
}

export { metrics, donut };
