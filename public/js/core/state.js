// État partagé : database contient les données, viewState décrit l’écran affiché.

import { loadWorkspace } from '../services/storage.js';
import { today } from '../utils/dates.js';

let database = loadWorkspace();

const viewState = {
  page: 'dashboard',
  search: '',
  service: '',
  priority: '',
  status: '',
  person: '',
  project: '',
  onlyMine: false,
  filters: false,
  projectView: 'table',
  userRole: '',
  calendar: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  day: today(),
  settings: 'general',
  menu: false,
  profile: false,
  modal: null,
  auth: false,
  taskPage: 1,
};

function setDatabase(nextDatabase) {
  database = nextDatabase;
}

export { database, viewState, setDatabase };
