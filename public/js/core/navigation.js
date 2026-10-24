// Change de page et réinitialise les filtres qui concernent la vue précédente.

import { render } from './render.js';
import { viewState } from './state.js';

function navigate(page) {
  viewState.page = page;
  viewState.menu = false;
  viewState.profile = false;
  viewState.search = '';
  viewState.service = '';
  viewState.project = '';
  viewState.status = '';
  viewState.priority = '';
  viewState.onlyMine = false;
  viewState.person = '';
  viewState.taskPage = 1;
  viewState.modal = null;
  render();
  window.scrollTo({ top: 0 });
}

export { navigate };
