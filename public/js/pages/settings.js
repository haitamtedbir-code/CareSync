// Écran settings : prépare le HTML à partir des données et des filtres.

import { heading } from '../components/common.js';
import { icon } from '../components/icons.js';
import { database, viewState } from '../core/state.js';
import { escapeHtml } from '../utils/dom.js';

function settingsPage() {
  const tabs = [
    ['general', 'Général', 'hospital'],
    ['appearance', 'Apparence', 'sun'],
    ['notifications', 'Notifications', 'bell'],
    ['backup', 'Sauvegardes', 'download'],
  ];
  let body = '';
  if (viewState.settings === 'general')
    body = /* HTML */ `<h2>Informations de l’établissement</h2>
      <p>Personnalisez les informations affichées dans votre espace.</p>
      <form id="hospital-form">
        <div class="form-grid">
          <div class="field full">
            <label for="hospital-name">Nom de l’établissement</label
            ><input
              class="input"
              id="hospital-name"
              name="name"
              required
              maxlength="100"
              value="${escapeHtml(database.hospital.name)}"
            />
          </div>
          <div class="field">
            <label for="hospital-address">Adresse</label
            ><input
              class="input"
              id="hospital-address"
              name="address"
              maxlength="180"
              value="${escapeHtml(database.hospital.address)}"
            />
          </div>
          <div class="field">
            <label for="hospital-zone">Fuseau horaire de l’établissement</label
            ><select class="input" id="hospital-zone" name="timezone">
              ${['Africa/Casablanca', 'Europe/Paris', 'UTC'].map((z) => `<option ${database.hospital.timezone === z ? 'selected' : ''}>${z}</option>`).join('')}
            </select>
          </div>
        </div>
        <p class="hint" style="margin-bottom:20px">
          Le calendrier utilise les dates locales de votre navigateur. Le fuseau est enregistré à
          titre d’information.
        </p>
        <button class="btn primary" type="submit">
          ${icon('check', 14)} Enregistrer les modifications
        </button>
      </form>`;
  if (viewState.settings === 'appearance')
    body = /* HTML */ `<h2>Un espace à votre rythme</h2>
      <p>Choisissez l’apparence qui vous convient.</p>
      <div class="setting-row">
        <div>
          <h3>Mode sombre</h3>
          <p>Un contraste doux pour vos sessions en soirée.</p>
        </div>
        <button
          class="toggle ${database.theme === 'dark' ? 'on' : ''}"
          data-action="toggle-theme"
          role="switch"
          aria-checked="${database.theme === 'dark'}"
          aria-label="Mode sombre"
        ></button>
      </div>
      <div style="padding-top:25px">
        <span class="eyebrow">IDENTITÉ CARESYNC</span>
        <h3 style="font-size:18px;margin:10px 0">
          Des équipes coordonnées,<br />un hôpital mieux organisé.
        </h3>
        <div style="display:flex;gap:8px;margin-top:20px">
          ${['#102e42', '#00a8b6', '#418de8', '#16b18b', '#ed6576'].map((c) => /* HTML */ `<span style="width:35px;height:35px;border-radius:9px;background:${c}" title="${c}"></span>`).join('')}
        </div>
      </div>`;
  if (viewState.settings === 'notifications')
    body = /* HTML */ `<h2>Vos préférences</h2>
      <p>Réglez les informations affichées dans votre espace de démonstration.</p>
      <div class="setting-row">
        <div>
          <h3>Notifications dans l’application</h3>
          <p>Créer un rappel local pour les nouvelles tâches urgentes.</p>
        </div>
        <button
          class="toggle ${database.prefs.app ? 'on' : ''}"
          data-action="toggle-pref"
          data-pref="app"
          role="switch"
          aria-checked="${database.prefs.app}"
          aria-label="Notifications dans l’application"
        ></button>
      </div>
      <div class="setting-row">
        <div>
          <h3>Notifications par e-mail</h3>
          <p>
            L’envoi d’e-mails nécessitera le futur backend. Aucun e-mail n’est envoyé depuis cette
            version.
          </p>
        </div>
        <span class="pill slate">À venir</span>
      </div>`;
  if (viewState.settings === 'backup')
    body = /* HTML */ `<h2>Gardez une copie de votre espace</h2>
      <p>
        Vos données sont stockées dans ce navigateur. Exportez-les pour les transférer vers un autre
        appareil.
      </p>
      <div class="setting-row">
        <div>
          <h3>Exporter une sauvegarde</h3>
          <p>Tâches, projets, services, utilisateurs et paramètres en JSON.</p>
        </div>
        <button class="btn" data-action="export-backup">${icon('download', 14)} Exporter</button>
      </div>
      <div class="setting-row">
        <div>
          <h3>Importer une sauvegarde</h3>
          <p>Remplace l’espace actuel après confirmation.</p>
        </div>
        <button class="btn" data-action="import-backup">
          ${icon('folder', 14)} Choisir un fichier
        </button>
      </div>
      <div class="setting-row">
        <div>
          <h3>Données de démonstration</h3>
          <p>Rétablir les exemples efface les changements de cet espace.</p>
        </div>
        <button class="btn danger" data-action="reset-demo">Réinitialiser</button>
      </div>`;
  return (
    heading('Paramètres', 'Un espace adapté à votre établissement.') +
    /* HTML */ `<div class="settings-grid">
      <nav class="settings-nav" aria-label="Paramètres">
        ${tabs.map(([id, n, ic]) => /* HTML */ `<button class="${viewState.settings === id ? 'on' : ''}" data-action="settings-tab" data-tab="${id}">${icon(ic, 15)}${n}</button>`).join('')}
      </nav>
      <section class="panel settings-section">${body}</section>
    </div>`
  );
}

export { settingsPage };
