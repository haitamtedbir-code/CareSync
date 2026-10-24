// Écran login : prépare le HTML à partir des données et des filtres.

import { avatar } from '../components/badges.js';
import { brand, icon } from '../components/icons.js';
import { member } from '../services/selectors.js';
import { escapeHtml } from '../utils/dom.js';

function loginPage() {
  return /* HTML */ `<div class="login-layout">
    <div class="login-art">
      <img src="assets/hospital.svg" alt="Centre hospitalier" />
      <div class="login-copy">
        <div class="brand">${brand()}<span>CareSync</span></div>
        <h1>Les bonnes équipes.<br />Les bonnes priorités.<br />Au même endroit.</h1>
        <p>Des équipes coordonnées, un hôpital mieux organisé.</p>
      </div>
    </div>
    <div class="login-form-wrap">
      <div class="login-card">
        <div class="eyebrow">BIENVENUE SUR CARESYNC</div>
        <h2>Votre espace hospitalier.</h2>
        <p>Retrouvez une vue claire des tâches et des projets de votre établissement.</p>
        <div style="display:flex;gap:12px;align-items:center;margin:25px 0">
          ${avatar('u1')}
          <div>
            <strong>${escapeHtml(member('u1')?.name)}</strong>
            <p class="hint">Administrateur · Espace de démonstration</p>
          </div>
        </div>
        <button class="btn primary full-width" data-action="enter-demo">
          Accéder à la démonstration ${icon('arrow', 15)}
        </button>
        <div class="login-note">
          Cette version est une démonstration locale : aucun mot de passe n’est nécessaire.
          L’authentification et les permissions côté serveur ne sont pas encore connectées.
        </div>
      </div>
    </div>
  </div>`;
}

export { loginPage };
