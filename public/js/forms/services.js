// Formulaires services : affichage des champs et du détail.

import { service } from '../services/selectors.js';
import { dialog, field, submitBtn } from '../ui/dialog-template.js';

function serviceForm(id) {
  const s = service(id) || { name: '', chief: '', code: '', color: '#20acb7' };
  return dialog(
    id ? 'Modifier le service' : 'Nouveau service',
    /* HTML */ `<form id="service-form">
      ${field('Nom du service *', 'name', s.name, 'text', 'required maxlength="100" autofocus')}${field('Chef de service *', 'chief', s.chief, 'text', 'required maxlength="100"')}
      <div class="form-grid">
        ${field('Code court *', 'code', s.code, 'text', 'required maxlength="6"')}${field('Couleur', 'color', s.color, 'color', 'style="height:42px;padding:5px"')}
      </div>
    </form>`,
    submitBtn('service-form', id ? 'Enregistrer' : 'Créer le service'),
  );
}

export { serviceForm };
