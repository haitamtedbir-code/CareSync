// Exports JSON/CSV et validation d’une sauvegarde avant restauration.

import { PRIORITY, STATUS } from '../config/constants.js';
import { render } from '../core/render.js';
import { setDatabase, viewState } from '../core/state.js';
import { saveWorkspace } from './storage.js';
import { confirm } from '../ui/modals.js';
import { toast } from '../ui/toast.js';

function downloadFile(content, name, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csv(rows) {
  return (
    '\uFEFF' +
    rows
      .map((row) =>
        row
          .map(
            (c) =>
              '"' +
              String(c ?? '')
                .replace(/"/g, '""')
                .replace(/^[=+@-]/, '\t$&') +
              '"',
          )
          .join(';'),
      )
      .join('\r\n')
  );
}

function backupValid(v) {
  if (v?.format !== 'caresync' || v.version !== 1 || v.data?.schema !== 1) throw Error('format');
  const d = v.data;
  for (const k of ['tasks', 'projects', 'members', 'services', 'events', 'notifications', 'audit'])
    if (!Array.isArray(d[k])) throw Error(k);
  if (!d.hospital || typeof d.hospital.name !== 'string' || !d.prefs) throw Error('hospital');
  const ids = {};
  for (const k of ['tasks', 'projects', 'members', 'services', 'events']) {
    ids[k] = new Set();
    for (const row of d[k]) {
      if (!row || typeof row.id !== 'string' || ids[k].has(row.id)) throw Error('id');
      ids[k].add(row.id);
    }
  }
  if (!ids.members.has('u1')) throw Error('owner');
  for (const t of d.tasks) {
    if (
      typeof t.title !== 'string' ||
      !STATUS[t.status] ||
      !PRIORITY[t.priority] ||
      !ids.services.has(t.service) ||
      !Array.isArray(t.comments) ||
      !Array.isArray(t.checklist)
    )
      throw Error('task');
    if (t.assignee && !ids.members.has(t.assignee)) throw Error('assignee');
    if (t.project && !ids.projects.has(t.project)) throw Error('project');
    if (t.due && !/^\d{4}-\d{2}-\d{2}$/.test(t.due)) throw Error('date');
  }
  for (const s of d.services)
    if (typeof s.name !== 'string' || typeof s.chief !== 'string') throw Error('service');
  for (const m of d.members)
    if (typeof m.name !== 'string' || typeof m.email !== 'string' || !ids.services.has(m.service))
      throw Error('member');
  for (const p of d.projects)
    if (typeof p.name !== 'string' || !ids.services.has(p.service)) throw Error('project');
  for (const e of d.events)
    if (typeof e.title !== 'string' || typeof e.date !== 'string' || typeof e.time !== 'string')
      throw Error('event');
  return d;
}

async function importBackup() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024)
      return toast('Fichier trop volumineux (10 Mo maximum).', true);
    try {
      let data = backupValid(JSON.parse(await file.text()));
      confirm(
        'Restaurer votre espace ?',
        `${data.tasks.length} tâches, ${data.projects.length} projets et ${data.services.length} services remplaceront les données actuelles. Exportez une sauvegarde avant de continuer.`,
        () => {
          try {
            saveWorkspace(data);
            setDatabase(data);
            viewState.modal = null;
            viewState.page = 'dashboard';
            viewState.service = '';
            viewState.search = '';
            render();
            toast('Sauvegarde restaurée');
          } catch {
            toast('Impossible d’enregistrer cette sauvegarde.', true);
          }
        },
        true,
        'Restaurer',
      );
    } catch {
      toast('Ce fichier n’est pas une sauvegarde CareSync valide.', true);
    }
  };
  input.click();
}

export { downloadFile, csv, backupValid, importBackup };
