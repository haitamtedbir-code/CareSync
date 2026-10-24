// Relie les attributs data-action du HTML aux actions métier correspondantes.

import { PRIORITY, STATUS } from '../config/constants.js';
import { navigate } from '../core/navigation.js';
import { render, renderContent } from '../core/render.js';
import { database, setDatabase, viewState } from '../core/state.js';
import { createDemoData } from '../data/demo-data.js';
import { csv, downloadFile, importBackup } from '../services/backups.js';
import { filteredTasks, member, project, service, task } from '../services/selectors.js';
import { saveWorkspace } from '../services/storage.js';
import { setTaskStatus } from '../services/tasks.js';
import { audit, save } from '../services/workspace.js';
import { closeModal, confirm, openModal } from '../ui/modals.js';
import { toast } from '../ui/toast.js';
import { today } from '../utils/dates.js';

const actions = {
  navigate: (el) => navigate(el.dataset.page),
  'toggle-menu': () => {
    viewState.menu = !viewState.menu;
    render();
  },
  'close-menu': () => {
    viewState.menu = false;
    render();
  },
  profile: () => {
    viewState.profile = !viewState.profile;
    render();
  },
  'new-task': (el) => openModal('task-form', '', { status: el.dataset.status || 'todo' }),
  'open-task': (el) => openModal('task-detail', el.dataset.id),
  'edit-task': (el) => openModal('task-form', el.dataset.id),
  'complete-task': (el) => setTaskStatus(el.dataset.id, 'done'),
  'delete-task': (el) => {
    const t = task(el.dataset.id);
    if (!t) return;
    confirm(
      'Supprimer cette tâche ?',
      `« ${t.title} » sera supprimée avec ses commentaires et sa liste de contrôle.`,
      () => {
        database.tasks = database.tasks.filter((x) => x.id !== t.id);
        database.notifications = database.notifications.filter((n) => n.task !== t.id);
        audit('Suppression', 'Tâche', t.title);
        save('Tâche supprimée');
        render();
      },
    );
  },
  'close-modal': closeModal,
  'modal-backdrop': (el, e) => {
    if (e.target === el) closeModal();
  },
  confirm: () => {
    const run = viewState.modal?.run;
    closeModal();
    run?.();
  },
  'new-project': () => openModal('project-form'),
  'open-project': (el) => openModal('project-detail', el.dataset.id),
  'edit-project': (el) => openModal('project-form', el.dataset.id),
  'delete-project': (el) => {
    const p = project(el.dataset.id);
    if (!p) return;
    confirm(
      'Supprimer le projet ?',
      `« ${p.name} » sera supprimé. Ses tâches seront conservées sans projet lié.`,
      () => {
        database.projects = database.projects.filter((x) => x.id !== p.id);
        database.tasks.filter((t) => t.project === p.id).forEach((t) => (t.project = ''));
        audit('Suppression', 'Projet', p.name);
        save('Projet supprimé');
        render();
      },
    );
  },
  'project-tasks': (el) => {
    const id = el.dataset.id;
    viewState.modal = null;
    viewState.page = 'tasks';
    viewState.search = '';
    viewState.project = id;
    viewState.taskPage = 1;
    render();
  },
  'project-view': (el) => {
    viewState.projectView = el.dataset.view;
    renderContent();
  },
  'new-service': () => openModal('service-form'),
  'edit-service': (el) => openModal('service-form', el.dataset.id),
  'service-tasks': (el) => {
    viewState.page = 'tasks';
    viewState.search = '';
    viewState.service = el.dataset.id;
    viewState.project = '';
    viewState.status = '';
    viewState.taskPage = 1;
    render();
  },
  'new-user': () => openModal('user-form'),
  'edit-user': (el) => openModal('user-form', el.dataset.id),
  'new-event': () => openModal('event-form'),
  'open-event': (el) => openModal('event-form', el.dataset.id),
  'delete-event': (el) => {
    const ev = database.events.find((e) => e.id === el.dataset.id);
    if (!ev) return;
    confirm('Supprimer cet événement ?', `« ${ev.title} » sera supprimé du calendrier.`, () => {
      database.events = database.events.filter((e) => e.id !== ev.id);
      audit('Suppression', 'Événement', ev.title);
      save('Événement supprimé');
      render();
    });
  },
  'cal-prev': () => {
    viewState.calendar = new Date(
      viewState.calendar.getFullYear(),
      viewState.calendar.getMonth() - 1,
      1,
    );
    renderContent();
  },
  'cal-next': () => {
    viewState.calendar = new Date(
      viewState.calendar.getFullYear(),
      viewState.calendar.getMonth() + 1,
      1,
    );
    renderContent();
  },
  'cal-today': () => {
    viewState.calendar = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    viewState.day = today();
    renderContent();
  },
  'select-day': (el) => {
    viewState.day = el.dataset.date;
    renderContent();
  },
  'settings-tab': (el) => {
    viewState.settings = el.dataset.tab;
    renderContent();
  },
  'show-mine': () => {
    viewState.onlyMine = true;
    viewState.taskPage = 1;
    renderContent();
  },
  'show-all': () => {
    viewState.onlyMine = false;
    viewState.project = '';
    viewState.taskPage = 1;
    renderContent();
  },
  'task-page': (el) => {
    viewState.taskPage = +el.dataset.page;
    renderContent();
  },
  'clear-filters': () => {
    viewState.service = '';
    viewState.priority = '';
    viewState.person = '';
    viewState.status = '';
    viewState.project = '';
    viewState.search = '';
    render();
  },
  'toggle-filters': () => {
    viewState.filters = !viewState.filters;
    renderContent();
  },
  'read-all': () => {
    database.notifications.forEach((n) => (n.read = true));
    save('Notifications marquées comme lues');
    render();
  },
  'read-notification': (el) => {
    const n = database.notifications.find((n) => n.id === el.dataset.id);
    if (!n) return;
    if (n.read) database.notifications = database.notifications.filter((v) => v.id !== n.id);
    else n.read = true;
    save();
    render();
  },
  'toggle-theme': () => {
    database.theme = database.theme === 'dark' ? 'light' : 'dark';
    save();
    render();
  },
  'toggle-pref': (el) => {
    const k = el.dataset.pref;
    if (k === 'app') {
      database.prefs[k] = !database.prefs[k];
      save('Préférences enregistrées');
      renderContent();
    }
  },
  'export-backup': () => {
    downloadFile(
      JSON.stringify(
        { format: 'caresync', version: 1, exportedAt: new Date().toISOString(), data: database },
        null,
        2,
      ),
      `caresync-sauvegarde-${today()}.json`,
      'application/json',
    );
    toast('Sauvegarde téléchargée');
  },
  'import-backup': importBackup,
  'export-tasks': () => {
    downloadFile(
      csv([
        ['Tâche', 'Service', 'Responsable', 'Priorité', 'Statut', 'Échéance', 'Projet'],
        ...filteredTasks().map((t) => [
          t.title,
          service(t.service)?.name,
          member(t.assignee)?.name,
          PRIORITY[t.priority].label,
          STATUS[t.status].label,
          t.due,
          project(t.project)?.name,
        ]),
      ]),
      `caresync-taches-${today()}.csv`,
      'text/csv;charset=utf-8',
    );
    toast('Rapport CSV téléchargé');
  },
  'export-audit': () => {
    downloadFile(
      csv([
        ['Date', 'Utilisateur', 'Action', 'Entité', 'Détails'],
        ...database.audit.map((a) => [a.date, a.user, a.action, a.entity, a.details]),
      ]),
      `caresync-audit-${today()}.csv`,
      'text/csv;charset=utf-8',
    );
    toast('Journal exporté');
  },
  'reset-demo': () =>
    confirm(
      'Rétablir les données de démonstration ?',
      'Cette action remplace toutes les données de cet espace. Exportez une sauvegarde avant de continuer.',
      () => {
        const fresh = createDemoData();
        try {
          saveWorkspace(fresh);
          setDatabase(fresh);
          navigate('dashboard');
          toast('Données de démonstration rétablies');
        } catch {
          toast('Stockage indisponible.', true);
        }
      },
      true,
      'Réinitialiser',
    ),
  'demo-info': () => openModal('demo'),
  'login-preview': () => {
    viewState.auth = true;
    viewState.profile = false;
    render();
  },
  'enter-demo': () => {
    viewState.auth = false;
    viewState.page = 'dashboard';
    audit('Connexion', 'Espace', 'Ouverture de l’espace de démonstration');
    save();
    render();
  },
};

export { actions };
