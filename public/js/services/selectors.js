// Recherches et calculs à partir des données. Ces fonctions ne modifient pas le DOM.

import { database, viewState } from '../core/state.js';
import { today } from '../utils/dates.js';

const service = (id) => database.services.find((s) => s.id === id);

const member = (id) => database.members.find((m) => m.id === id);

const project = (id) => database.projects.find((p) => p.id === id);

const task = (id) => database.tasks.find((t) => t.id === id);

const overdue = (t) => t.status !== 'done' && t.due && t.due < today();

const activeTasks = () => database.tasks.filter((t) => t.status !== 'done');

const unread = () => database.notifications.filter((n) => !n.read).length;

const progress = (p) => {
  let ts = database.tasks.filter((t) => t.project === p.id);
  return ts.length
    ? Math.round(
        (ts.reduce(
          (sum, t) =>
            sum + ({ todo: 0, progress: 0.5, waiting: 0.25, review: 0.85, done: 1 }[t.status] || 0),
          0,
        ) /
          ts.length) *
          100,
      )
    : 0;
};

function filteredTasks() {
  const q = viewState.search.toLocaleLowerCase();
  return database.tasks.filter(
    (t) =>
      (!viewState.service || t.service === viewState.service) &&
      (!viewState.priority || t.priority === viewState.priority) &&
      (!viewState.status || t.status === viewState.status) &&
      (!viewState.person || t.assignee === viewState.person) &&
      (!viewState.onlyMine || t.assignee === 'u1') &&
      (!viewState.project || t.project === viewState.project) &&
      (!q ||
        [
          t.title,
          service(t.service)?.name,
          member(t.assignee)?.name,
          project(t.project)?.name,
          t.description,
        ].some((v) => v?.toLocaleLowerCase().includes(q))),
  );
}

export { service, member, project, task, overdue, activeTasks, unread, progress, filteredTasks };
