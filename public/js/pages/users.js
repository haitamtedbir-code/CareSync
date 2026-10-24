// Écran users : prépare le HTML à partir des données et des filtres.

import { avatar } from '../components/badges.js';
import { empty, heading, selectOptions } from '../components/common.js';
import { icon } from '../components/icons.js';
import { database, viewState } from '../core/state.js';
import { service } from '../services/selectors.js';
import { escapeHtml } from '../utils/dom.js';

function usersPage() {
  const ms = database.members.filter(
    (m) =>
      (!viewState.service || m.service === viewState.service) &&
      (!viewState.userRole || m.role === viewState.userRole) &&
      (!viewState.search ||
        [m.name, m.email, m.role].some((v) =>
          v.toLowerCase().includes(viewState.search.toLowerCase()),
        )),
  );
  return (
    heading(
      'Utilisateurs & rôles',
      'Identifiez les responsables et structurez vos équipes.',
      /* HTML */ `<button class="btn primary" data-action="new-user">
        ${icon('plus', 14)} Nouvel utilisateur
      </button>`,
    ) +
    /* HTML */ `<section class="panel">
      <div class="toolbar">
        <span class="muted-note">${ms.length} membres de l’établissement</span>
        <div class="actions">
          <select data-filter="userRole" aria-label="Rôle">
            ${selectOptions(
              ['Administrateur', 'Chef de service', 'Responsable', 'Collaborateur'].map((n) => ({
                id: n,
                name: n,
              })),
              viewState.userRole,
              'Tous les rôles',
            )}</select
          ><select data-filter="service" aria-label="Service">
            ${selectOptions(database.services, viewState.service, 'Tous les services')}
          </select>
        </div>
      </div>
      <div class="table-panel">
        <table class="table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>E-mail</th>
              <th>Rôle</th>
              <th>Service</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${ms
              .map(
                (m) =>
                  /* HTML */ `<tr>
                    <td><span class="name-cell">${avatar(m.id)}${escapeHtml(m.name)}</span></td>
                    <td class="muted">${escapeHtml(m.email)}</td>
                    <td>
                      <span
                        class="pill ${m.role === 'Administrateur' ? 'blue' : m.role === 'Chef de service' ? 'green' : 'purple'}"
                        >${escapeHtml(m.role)}</span
                      >
                    </td>
                    <td class="muted">${escapeHtml(service(m.service)?.name || '—')}</td>
                    <td>
                      <span class="pill ${m.active ? 'green' : 'slate'} dot"
                        >${m.active ? 'Actif' : 'Inactif'}</span
                      >
                    </td>
                    <td>
                      <button
                        class="iconbtn"
                        data-action="edit-user"
                        data-id="${escapeHtml(m.id)}"
                        aria-label="Modifier ${escapeHtml(m.name)}"
                      >
                        ${icon('edit', 13)}
                      </button>
                    </td>
                  </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>
      ${!ms.length ? empty('Aucun utilisateur trouvé') : ''}
    </section>`
  );
}

export { usersPage };
