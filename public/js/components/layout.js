// Structure principale : menu latéral, barre de recherche et zone de contenu.

import { avatar } from './badges.js';
import { brand, icon } from './icons.js';
import { navItems } from '../config/constants.js';
import { database, viewState } from '../core/state.js';
import { renderPage } from '../pages/router.js';
import { member, unread } from '../services/selectors.js';
import { escapeHtml } from '../utils/dom.js';

function shell() {
  return /* HTML */ `<div class="layout ${viewState.menu ? 'menu-open' : ''}">
    <button class="scrim" data-action="close-menu" aria-label="Fermer le menu"></button>
    <aside class="sidebar">
      <button
        class="brand"
        data-action="navigate"
        data-page="dashboard"
        aria-label="CareSync, accueil"
      >
        ${brand()}<span>CareSync<small>HOSPITAL WORKSPACE</small></span>
      </button>
      <div class="nav-label">VOTRE ESPACE</div>
      <nav class="nav" aria-label="Navigation principale">
        ${navItems.map(([page, label, ic], i) => `${i === 7 ? '<div class="nav-label" style="padding-top:22px">PILOTAGE</div>' : ''}<button class="${viewState.page === page ? 'active' : ''}" data-action="navigate" data-page="${page}" ${viewState.page === page ? 'aria-current="page"' : ''}>${icon(ic)}${label}${page === 'notifications' && unread() ? `<span class="count">${unread()}</span>` : ''}</button>`).join('')}
      </nav>
      <div class="sidebar-bottom">
        <button class="demo-label" data-action="demo-info">
          ${icon('info', 13)} Espace de démonstration
        </button>
        <div class="org-block">
          <span class="org-icon">${icon('hospital', 18)}</span>
          <div>
            <strong>${escapeHtml(database.hospital.name)}</strong
            ><span>Administration hospitalière</span>
          </div>
        </div>
      </div>
    </aside>
    <main class="main">
      <header class="topbar">
        <button class="iconbtn mobile-menu" data-action="toggle-menu" aria-label="Ouvrir le menu">
          ${icon('menu')}</button
        ><label class="search-box"
          >${icon('search', 16)}<input
            id="global-search"
            aria-label="Rechercher une tâche, un projet, un service"
            placeholder="Rechercher une tâche, un projet, un service…"
            value="${escapeHtml(viewState.search)}"
          /><kbd>⌘ K</kbd></label
        >
        <div class="topbar-right">
          <button
            class="iconbtn"
            data-action="navigate"
            data-page="notifications"
            aria-label="Notifications"
          >
            ${icon('bell', 19)}${unread() ? '<span class="notification-dot"></span>' : ''}</button
          ><span class="divider"></span
          ><button class="profile" data-action="profile" aria-expanded="${viewState.profile}">
            ${avatar('u1')}<span
              ><strong>${escapeHtml(member('u1')?.name || 'Haitam Tedbir')}</strong
              ><small>Administrateur</small></span
            >${icon('down', 12)}</button
          ><button class="iconbtn" data-action="profile" aria-label="Options du compte">
            ${icon('more', 17)}
          </button>
        </div>
        ${
          viewState.profile
            ? /* HTML */ `<div class="profile-menu">
                <p>MON ESPACE CARESYNC</p>
                <button data-action="navigate" data-page="settings">
                  ${icon('settings', 16)} Paramètres de l’espace</button
                ><button data-action="toggle-theme">
                  ${icon(database.theme === 'dark' ? 'sun' : 'moon', 16)} Mode
                  ${database.theme === 'dark' ? 'clair' : 'sombre'}</button
                ><button data-action="export-backup">
                  ${icon('download', 16)} Exporter une sauvegarde</button
                ><button data-action="login-preview">
                  ${icon('logout', 16)} Écran de connexion
                </button>
              </div>`
            : ''
        }
      </header>
      <div class="content" id="main-content">
        ${renderPage()}
        <footer class="app-footer">
          <span>CareSync · Des équipes coordonnées, un hôpital mieux organisé.</span
          ><span class="live">Sauvegarde locale dans ce navigateur</span>
        </footer>
      </div>
    </main>
  </div>`;
}

export { shell };
