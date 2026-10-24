// Associe la page sélectionnée à sa fonction d’affichage.

import { viewState } from '../core/state.js';
import { auditPage } from './audit.js';
import { calendarPage } from './calendar.js';
import { dashboard } from './dashboard.js';
import { kanban } from './kanban.js';
import { notificationsPage } from './notifications.js';
import { projectsPage } from './projects.js';
import { reportsPage } from './reports.js';
import { servicesPage } from './services.js';
import { settingsPage } from './settings.js';
import { tasksPage } from './tasks.js';
import { usersPage } from './users.js';

function renderPage() {
  return (
    {
      dashboard,
      tasks: tasksPage,
      kanban,
      projects: projectsPage,
      calendar: calendarPage,
      services: servicesPage,
      users: usersPage,
      notifications: notificationsPage,
      reports: reportsPage,
      audit: auditPage,
      settings: settingsPage,
    }[viewState.page] || dashboard
  )();
}

export { renderPage };
