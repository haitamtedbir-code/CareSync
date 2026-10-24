// Libellés communs à toute l’application. Les identifiants sont conservés dans les sauvegardes.

const STATUS = {
  todo: { label: 'À faire', color: '#5786a9' },
  progress: { label: 'En cours', color: '#3e90f3' },
  waiting: { label: 'En attente', color: '#d6a44f' },
  review: { label: 'À valider', color: '#9170c8' },
  done: { label: 'Terminées', color: '#12ae8a' },
};

const PRIORITY = {
  urgent: { label: 'Urgente', class: 'red' },
  high: { label: 'Haute', class: 'orange' },
  normal: { label: 'Normale', class: 'blue' },
  low: { label: 'Basse', class: 'green' },
};

const KEY = 'caresync.hospital.v1';

const navItems = [
  ['dashboard', 'Vue d’ensemble', 'home'],
  ['tasks', 'Mes tâches', 'tasks'],
  ['kanban', 'Tableau Kanban', 'board'],
  ['projects', 'Projets', 'folder'],
  ['calendar', 'Calendrier', 'calendar'],
  ['services', 'Services hospitaliers', 'hospital'],
  ['users', 'Utilisateurs & rôles', 'users'],
  ['notifications', 'Notifications', 'bell'],
  ['reports', 'Rapports & statistiques', 'chart'],
  ['audit', 'Journal d’audit', 'audit'],
  ['settings', 'Paramètres', 'settings'],
];

export { STATUS, PRIORITY, KEY, navItems };
