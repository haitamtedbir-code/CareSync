// Liste compacte des tâches utilisée sur le dashboard et dans le détail d’un projet.

import { icon } from './icons.js';
import { overdue, service } from '../services/selectors.js';
import { humanDue } from '../utils/dates.js';
import { escapeHtml } from '../utils/dom.js';

function taskRows(ts) {
  return ts
    .map(
      (t) =>
        /* HTML */ `<button
          class="urgent-row"
          style="--c:${t.priority === 'urgent' ? '#ec6477' : t.priority === 'high' ? '#f1a052' : '#0aabb4'}"
          data-action="open-task"
          data-id="${escapeHtml(t.id)}"
        >
          <div>
            <span class="task-name">${escapeHtml(t.title)}</span
            ><span class="sub"
              >${icon('hospital', 10)}
              ${escapeHtml(service(t.service)?.name || 'Sans service')}</span
            >
          </div>
          <span class="due ${overdue(t) ? 'red-text' : ''}">${humanDue(t.due)}</span>
        </button>`,
    )
    .join('');
}

export { taskRows };
