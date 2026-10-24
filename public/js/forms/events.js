// Formulaires events : affichage des champs et du détail.

import { icon } from '../components/icons.js';
import { database, viewState } from '../core/state.js';
import { dialog, field, selectField, submitBtn } from '../ui/dialog-template.js';
import { escapeHtml } from '../utils/dom.js';

function eventForm(id) {
  const e = database.events.find((e) => e.id === id) || {
    title: '',
    date: viewState.day,
    time: '09:00',
    service: '',
    color: '#00a8b6',
  };
  return dialog(
    id ? 'Modifier l’événement' : 'Nouvel événement',
    /* HTML */ `<form id="event-form">
      ${field('Titre de l’événement *', 'title', e.title, 'text', 'required maxlength="180" autofocus')}
      <div class="form-grid">
        ${field('Date *', 'date', e.date, 'date', 'required')}${field('Heure *', 'time', e.time, 'time', 'required')}${selectField('Service', 'service', database.services, e.service, 'Tous les services')}${field('Couleur', 'color', e.color, 'color', 'style="height:42px;padding:5px"')}
      </div>
    </form>`,
    `${id ? /* HTML */ `<button class="btn danger" style="margin-right:auto" data-action="delete-event" data-id="${escapeHtml(id)}">${icon('trash', 13)}Supprimer</button>` : ''}${submitBtn('event-form', id ? 'Enregistrer' : 'Créer l’événement')}`,
  );
}

export { eventForm };
