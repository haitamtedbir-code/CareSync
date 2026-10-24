// Traite la soumission des formulaires, valide les champs et enregistre les changements.

import { PRIORITY, STATUS } from '../config/constants.js';
import { render } from '../core/render.js';
import { database, viewState } from '../core/state.js';
import { member, project, service, task } from '../services/selectors.js';
import { audit, save } from '../services/workspace.js';
import { renderModal } from '../ui/modals.js';
import { toast } from '../ui/toast.js';
import { select } from '../utils/dom.js';
import { createId } from '../utils/ids.js';

function registerFormEvents() {
  document.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target,
      f = Object.fromEntries(new FormData(form)),
      id = viewState.modal?.id;
    if (form.id === 'task-form') {
      if (!f.title?.trim() || !service(f.service) || !STATUS[f.status] || !PRIORITY[f.priority])
        return toast('Vérifiez les champs obligatoires.', true);
      let t = task(id),
        isNew = !t;
      if (t) Object.assign(t, f, { title: f.title.trim() });
      else {
        t = {
          ...f,
          title: f.title.trim(),
          id: createId(),
          comments: [],
          checklist: [],
          created: new Date().toISOString(),
        };
        database.tasks.push(t);
      }
      audit(isNew ? 'Création' : 'Modification', 'Tâche', t.title);
      if (isNew && t.priority === 'urgent' && database.prefs.app)
        database.notifications.unshift({
          id: createId(),
          title: 'Nouvelle tâche urgente',
          message: t.title + ' · ' + service(t.service).name,
          task: t.id,
          read: false,
          time: new Date().toISOString(),
        });
      viewState.modal = null;
      save(isNew ? 'Tâche créée avec succès' : 'Tâche mise à jour');
      render();
    }
    if (form.id === 'project-form') {
      if (!f.name?.trim() || !service(f.service))
        return toast('Vérifiez le nom et le service.', true);
      let p = project(id),
        isNew = !p;
      if (p) Object.assign(p, f, { name: f.name.trim() });
      else {
        p = { ...f, id: createId(), name: f.name.trim() };
        database.projects.push(p);
      }
      audit(isNew ? 'Création' : 'Modification', 'Projet', p.name);
      viewState.modal = null;
      save(isNew ? 'Projet créé' : 'Projet mis à jour');
      render();
    }
    if (form.id === 'service-form') {
      if (!f.name?.trim() || !f.chief?.trim() || !f.code?.trim())
        return toast('Complétez les informations du service.', true);
      if (
        database.services.some(
          (s) => s.id !== id && s.name.toLowerCase() === f.name.trim().toLowerCase(),
        )
      )
        return toast('Un service porte déjà ce nom.', true);
      let s = service(id),
        isNew = !s;
      const values = {
        ...f,
        name: f.name.trim(),
        chief: f.chief.trim(),
        code: f.code.trim().toUpperCase(),
      };
      if (s) Object.assign(s, values);
      else {
        s = { ...values, id: createId(), icon: 'hospital' };
        database.services.push(s);
      }
      audit(isNew ? 'Création' : 'Modification', 'Service', s.name);
      viewState.modal = null;
      save(isNew ? 'Service créé' : 'Service mis à jour');
      render();
    }
    if (form.id === 'user-form') {
      if (!f.name?.trim() || !service(f.service))
        return toast('Vérifiez les informations du membre.', true);
      if (
        database.members.some((m) => m.id !== id && m.email.toLowerCase() === f.email.toLowerCase())
      )
        return toast('Cette adresse e-mail est déjà utilisée.', true);
      let m = member(id),
        isNew = !m;
      const values = {
        ...f,
        name: f.name.trim(),
        active: id === 'u1' ? true : f.active === 'true',
      };
      if (m) Object.assign(m, values);
      else {
        m = { ...values, id: createId(), color: '#1b9bab' };
        database.members.push(m);
      }
      audit(isNew ? 'Création' : 'Modification', 'Utilisateur', m.name);
      viewState.modal = null;
      save(isNew ? 'Membre ajouté au répertoire' : 'Profil mis à jour');
      render();
    }
    if (form.id === 'event-form') {
      if (!f.title?.trim() || !f.date || !f.time)
        return toast('Complétez le titre, la date et l’heure.', true);
      let ev = database.events.find((x) => x.id === id),
        isNew = !ev;
      if (ev) Object.assign(ev, f, { title: f.title.trim() });
      else {
        ev = { ...f, title: f.title.trim(), id: createId() };
        database.events.push(ev);
      }
      audit(isNew ? 'Création' : 'Modification', 'Événement', ev.title);
      viewState.modal = null;
      save(isNew ? 'Événement créé' : 'Événement mis à jour');
      render();
    }
    if (form.id === 'hospital-form') {
      database.hospital = { name: f.name.trim(), address: f.address, timezone: f.timezone };
      audit('Modification', 'Établissement', 'Informations de l’établissement mises à jour');
      save('Informations enregistrées');
      render();
    }
    if (form.id === 'comment-form') {
      const t = task(id);
      if (t && f.text?.trim()) {
        t.comments.push({
          id: createId(),
          user: 'u1',
          text: f.text.trim(),
          date: new Date().toISOString(),
        });
        audit('Commentaire', 'Tâche', t.title);
        save('Commentaire ajouté');
        renderModal();
      }
    }
    if (form.id === 'checklist-form') {
      const t = task(id);
      if (t && f.title?.trim()) {
        t.checklist.push({ id: createId(), title: f.title.trim(), done: false });
        audit('Modification', 'Tâche', 'Nouvelle étape : ' + t.title);
        save();
        renderModal();
        select('#checklist-form input')?.focus();
      }
    }
  });
}

export { registerFormEvents };
