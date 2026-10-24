// Changement du statut d’une tâche et actualisation des vues qui en dépendent.

import { STATUS } from '../config/constants.js';
import { render } from '../core/render.js';
import { task } from './selectors.js';
import { audit, save } from './workspace.js';

function setTaskStatus(id, status) {
  const t = task(id);
  if (!t || !STATUS[status] || status === t.status) return;
  t.status = status;
  audit('Modification', 'Tâche', t.title + ' → ' + STATUS[status].label);
  save('Statut mis à jour');
  render();
}

export { setTaskStatus };
