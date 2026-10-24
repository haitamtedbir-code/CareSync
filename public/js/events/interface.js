// Écoute les clics, la recherche et les changements de filtres sur toute l’interface.

import { actions } from '../controllers/actions.js';
import { render, renderContent } from '../core/render.js';
import { viewState } from '../core/state.js';
import { task } from '../services/selectors.js';
import { setTaskStatus } from '../services/tasks.js';
import { audit, save } from '../services/workspace.js';
import { renderModal } from '../ui/modals.js';
import { selectAll } from '../utils/dom.js';

function registerInterfaceEvents() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (el) {
      actions[el.dataset.action]?.(el, e);
      return;
    }
    if (viewState.profile && !e.target.closest('.profile-menu')) {
      viewState.profile = false;
      render();
    }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'global-search') {
      viewState.search = e.target.value;
      viewState.taskPage = 1;
      if (
        viewState.search &&
        !['tasks', 'kanban', 'projects', 'services', 'users', 'audit'].includes(viewState.page)
      ) {
        viewState.page = 'tasks';
        selectAll('.nav button').forEach((b) => {
          b.classList.toggle('active', b.dataset.page === 'tasks');
          if (b.dataset.page === 'tasks') b.setAttribute('aria-current', 'page');
          else b.removeAttribute('aria-current');
        });
      }
      renderContent();
    }
  });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.filter) {
      viewState[el.dataset.filter] = el.value;
      viewState.taskPage = 1;
      renderContent();
    }
    if (el.dataset.taskStatus) setTaskStatus(el.dataset.taskStatus, el.value);
    if (el.dataset.checklist) {
      const t = task(el.dataset.task),
        item = t?.checklist.find((c) => c.id === el.dataset.checklist);
      if (item) {
        item.done = el.checked;
        audit(
          'Modification',
          'Tâche',
          'Étape ' + (item.done ? 'terminée' : 'réouverte') + ' : ' + item.title,
        );
        save();
        renderModal();
      }
    }
  });
}

export { registerInterfaceEvents };
