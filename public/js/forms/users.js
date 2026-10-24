// Formulaires users : affichage des champs et du détail.

import { database } from '../core/state.js';
import { member } from '../services/selectors.js';
import { dialog, field, selectField, submitBtn } from '../ui/dialog-template.js';

function userForm(id) {
  const m = member(id) || {
    name: '',
    email: '',
    role: 'Collaborateur',
    service: database.services[0]?.id || '',
    active: true,
  };
  return dialog(
    id ? 'Modifier l’utilisateur' : 'Nouvel utilisateur',
    /* HTML */ `<p class="tooltip-hint">
        Ce profil est un membre du répertoire local. Aucun compte serveur ni invitation par e-mail
        n’est créé.
      </p>
      <form id="user-form">
        ${field('Nom complet *', 'name', m.name, 'text', 'required maxlength="120" autofocus')}${field('Adresse e-mail *', 'email', m.email, 'email', 'required maxlength="180"')}
        <div class="form-grid">
          ${selectField(
            'Rôle *',
            'role',
            ['Administrateur', 'Chef de service', 'Responsable', 'Collaborateur'].map((n) => ({
              id: n,
              name: n,
            })),
            m.role,
            'Choisir',
            true,
          )}${selectField('Service *', 'service', database.services, m.service, 'Choisir', true)}${
            id === 'u1'
              ? '<input name="active" type="hidden" value="true">'
              : selectField(
                  'Statut',
                  'active',
                  [
                    { id: 'true', name: 'Actif' },
                    { id: 'false', name: 'Inactif' },
                  ],
                  String(m.active),
                  'Choisir',
                  true,
                )
          }
        </div>
      </form>`,
    submitBtn('user-form', id ? 'Enregistrer' : 'Ajouter au répertoire'),
  );
}

export { userForm };
