// Enregistrement des changements et ajout des actions au journal d’audit local.

import { database } from '../core/state.js';
import { member } from './selectors.js';
import { saveWorkspace } from './storage.js';
import { toast } from '../ui/toast.js';
import { createId } from '../utils/ids.js';

function save(message) {
  try {
    saveWorkspace(database);
  } catch {
    toast('Stockage indisponible. Exportez une sauvegarde avant de fermer.', true);
    return;
  }
  if (message) toast(message);
}

function audit(action, entity, details) {
  database.audit.unshift({
    id: createId(),
    date: new Date().toISOString(),
    user: member('u1')?.name || 'Administrateur',
    action,
    entity,
    details,
  });
}

export { save, audit };
