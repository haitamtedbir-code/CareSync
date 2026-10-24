// Met à jour le DOM à partir de l’état courant de l’application.

import { shell } from '../components/layout.js';
import { navItems } from '../config/constants.js';
import { database, viewState } from './state.js';
import { loginPage } from '../pages/login.js';
import { renderPage } from '../pages/router.js';
import { renderModal } from '../ui/modals.js';
import { select } from '../utils/dom.js';

function render() {
  document.body.classList.toggle('dark', database.theme === 'dark');
  document.title = `${navItems.find((n) => n[0] === viewState.page)?.[1] || 'Accueil'} · CareSync`;
  select('#app').innerHTML = viewState.auth ? loginPage() : shell();
  renderModal();
}

function renderContent() {
  document.title = `${navItems.find((n) => n[0] === viewState.page)?.[1] || 'Accueil'} · CareSync`;
  const target = select('#main-content');
  if (target) {
    target.innerHTML =
      renderPage() +
      /* HTML */ `<footer class="app-footer">
        <span>CareSync · Des équipes coordonnées, un hôpital mieux organisé.</span
        ><span class="live">Sauvegarde locale dans ce navigateur</span>
      </footer>`;
  }
}

export { render, renderContent };
