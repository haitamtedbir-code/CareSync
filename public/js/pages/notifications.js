// Écran notifications : prépare le HTML à partir des données et des filtres.

import { empty, heading } from '../components/common.js';
import { icon } from '../components/icons.js';
import { database } from '../core/state.js';
import { dateTime } from '../utils/dates.js';
import { escapeHtml } from '../utils/dom.js';

function notificationsPage() {
  return (
    heading(
      'Notifications',
      'Gardez une vue sur les informations importantes.',
      /* HTML */ `<button class="btn" data-action="read-all">
        ${icon('check', 14)} Tout marquer comme lu
      </button>`,
    ) +
    /* HTML */ `<section class="panel">
      <div class="notifications-list">
        ${
          database.notifications
            .map(
              (n) =>
                /* HTML */ `<article class="notif ${!n.read ? 'unread' : ''}">
                  <span class="service-icon" style="--c:${n.task ? '#e86b7a' : '#0aa9b4'}"
                    >${icon(n.task ? 'alert' : 'bell', 16)}</span
                  >
                  <div>
                    <h3>${escapeHtml(n.title)}</h3>
                    <p>${escapeHtml(n.message)}</p>
                    <small>${dateTime(n.time)}</small>
                  </div>
                  <div class="notif-actions">
                    ${n.task ? /* HTML */ `<button class="btn small" data-action="open-task" data-id="${escapeHtml(n.task)}">Voir la tâche</button>` : ''}<button
                      class="iconbtn"
                      data-action="read-notification"
                      data-id="${escapeHtml(n.id)}"
                      aria-label="${n.read ? 'Supprimer' : 'Marquer comme lu'}"
                    >
                      ${icon(n.read ? 'close' : 'check', 14)}
                    </button>
                  </div>
                </article>`,
            )
            .join('') || empty('Vous êtes à jour', 'Les nouvelles notifications apparaîtront ici.')
        }
      </div>
    </section>`
  );
}

export { notificationsPage };
