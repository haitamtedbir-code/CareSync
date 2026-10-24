// Raccourcis clavier et gestion du focus dans les fenêtres de dialogue.

import { render, renderContent } from '../core/render.js';
import { viewState } from '../core/state.js';
import { closeModal } from '../ui/modals.js';
import { select, selectAll } from '../utils/dom.js';

function registerKeyboardEvents() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (viewState.modal) closeModal();
      else if (viewState.profile || viewState.menu) {
        viewState.profile = false;
        viewState.menu = false;
        render();
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      select('#global-search')?.focus();
    }
    if (e.key === 'Enter' && e.target.matches('.day[data-action]')) {
      e.preventDefault();
      viewState.day = e.target.dataset.date;
      renderContent();
    }
    if (e.key === 'Tab' && viewState.modal) {
      const els = selectAll(
        '#modal-root button:not([disabled]),#modal-root input:not([type="hidden"]),#modal-root select,#modal-root textarea,#modal-root [tabindex="0"]',
      );
      const first = els[0],
        last = els.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  });
}

export { registerKeyboardEvents };
