// Écran audit : prépare le HTML à partir des données et des filtres.

import { heading } from '../components/common.js';
import { icon } from '../components/icons.js';
import { database, viewState } from '../core/state.js';
import { dateTime } from '../utils/dates.js';
import { escapeHtml } from '../utils/dom.js';

function auditPage() {
  const logs = database.audit.filter(
    (a) =>
      !viewState.search ||
      [a.user, a.action, a.entity, a.details].some((v) =>
        v.toLowerCase().includes(viewState.search.toLowerCase()),
      ),
  );
  return (
    heading(
      'Journal d’audit',
      'Retrouvez les actions effectuées dans votre espace.',
      /* HTML */ `<button class="btn" data-action="export-audit">
        ${icon('download', 14)} Exporter
      </button>`,
      'TRAÇABILITÉ DES ACTIVITÉS',
    ) +
    /* HTML */ `<section class="panel">
      <div class="toolbar">
        <span class="muted-note">${logs.length} actions enregistrées localement</span
        ><span class="pill blue">Historique de l’espace</span>
      </div>
      <div class="table-panel">
        <table class="table">
          <thead>
            <tr>
              <th>Date / heure</th>
              <th>Utilisateur</th>
              <th>Action</th>
              <th>Entité</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            ${logs
              .slice(0, 100)
              .map(
                (a) =>
                  /* HTML */ `<tr>
                    <td class="muted">${dateTime(a.date)}</td>
                    <td>${escapeHtml(a.user)}</td>
                    <td>
                      <span
                        class="pill ${a.action === 'Suppression' ? 'red' : a.action === 'Création' ? 'green' : a.action === 'Connexion' ? 'blue' : 'purple'}"
                        >${escapeHtml(a.action)}</span
                      >
                    </td>
                    <td>${escapeHtml(a.entity)}</td>
                    <td class="muted" style="white-space:normal;min-width:200px">
                      ${escapeHtml(a.details)}
                    </td>
                  </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>`
  );
}

export { auditPage };
