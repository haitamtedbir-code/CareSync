// Glisser-déposer des cartes entre les colonnes du Kanban.

import { setTaskStatus } from '../services/tasks.js';
import { selectAll } from '../utils/dom.js';

let dragging = '';

function registerKanbanEvents() {
  document.addEventListener('dragstart', (e) => {
    const card = e.target.closest('[data-drag-task]');
    if (!card) return;
    dragging = card.dataset.dragTask;
    e.dataTransfer.setData('text/plain', dragging);
    e.dataTransfer.effectAllowed = 'move';
    card.classList.add('dragging');
  });
  document.addEventListener('dragover', (e) => {
    const col = e.target.closest('[data-drop-status]');
    if (col && dragging) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('dragover');
    }
  });
  document.addEventListener('dragleave', (e) => {
    const col = e.target.closest('[data-drop-status]');
    if (col && !col.contains(e.relatedTarget)) col.classList.remove('dragover');
  });
  document.addEventListener('drop', (e) => {
    const col = e.target.closest('[data-drop-status]');
    if (col && dragging) {
      e.preventDefault();
      setTaskStatus(dragging, col.dataset.dropStatus);
    }
    dragging = '';
    selectAll('.dragover').forEach((el) => el.classList.remove('dragover'));
  });
  document.addEventListener('dragend', () => {
    dragging = '';
    selectAll('.dragging,.dragover').forEach((el) => el.classList.remove('dragging', 'dragover'));
  });
}

export { registerKanbanEvents };
