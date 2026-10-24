# CareSync

**Des équipes coordonnées, un hôpital mieux organisé.**

Application de gestion des tâches et des projets hospitaliers en HTML, CSS et JavaScript natif. Le projet est organisé par écran et par responsabilité pour être modifié dans Visual Studio Code.

## Démarrer dans VS Code

1. Décompresse entièrement le ZIP.
2. Ouvre `CareSync.code-workspace` dans Visual Studio Code.
3. Appuie sur **F5**, ou choisis **CareSync — Edge** dans Exécuter et déboguer, puis clique sur le triangle vert.

Le serveur démarre et ouvre http://localhost:5173. **Node.js 22 ou supérieur** et Edge doivent être installés. La configuration **CareSync — Chrome** est également fournie.

Aucune dépendance npm n’est nécessaire pour lancer l’application. Le serveur utilise uniquement les modules intégrés à Node.js.

Garde le terminal du serveur ouvert. Pour l’arrêter, utilise **Terminal → Terminer la tâche**. Si le port 5173 est occupé, ferme le serveur précédent avant de relancer. Le bouton d’arrêt du débogueur ne ferme pas forcément la tâche serveur.

Tu peux aussi double-cliquer sur `LANCER_CARESYNC.cmd` dans l’Explorateur Windows.

## Organisation du projet

```text
CareSync/
├── public/
│   ├── index.html                # Point d’entrée HTML
│   ├── assets/                   # Illustration et favicon
│   ├── css/
│   │   ├── main.css              # Charge les autres styles dans l’ordre
│   │   ├── variables.css         # Couleurs, typographie et mesures
│   │   ├── base.css              # Règles générales
│   │   ├── layout.css            # Menu et barre supérieure
│   │   ├── components.css        # Cartes, tableaux et formulaires
│   │   └── responsive.css        # Adaptations aux petits écrans
│   └── js/
│       ├── main.js               # Démarrage de l’application
│       ├── config/               # Statuts, priorités et navigation
│       ├── core/                 # État, navigation et rendu
│       ├── data/                 # Données de démonstration
│       ├── pages/                # Un fichier par écran
│       ├── components/           # Éléments réutilisables
│       ├── forms/                # Formulaires et fenêtres de détail
│       ├── controllers/          # Actions déclenchées par les boutons
│       ├── events/               # Clics, formulaires, clavier, glisser-déposer
│       ├── services/             # Recherche, stockage et sauvegardes
│       ├── ui/                   # Fenêtres de dialogue et messages
│       └── utils/                # Dates, identifiants et outils DOM
├── docs/COMPRENDRE_LE_CODE.md
├── .vscode/                      # Configuration F5
├── server.mjs                    # Serveur local sans dépendance
├── package.json
├── CareSync.code-workspace
└── LANCER_CARESYNC.cmd
```

## Où effectuer une modification ?

| Modification souhaitée                 | Fichier                                                             |
| -------------------------------------- | ------------------------------------------------------------------- |
| Changer les couleurs                   | `public/css/variables.css`                                          |
| Modifier le menu                       | `public/js/components/layout.js` et `public/js/config/constants.js` |
| Modifier le tableau de bord            | `public/js/pages/dashboard.js`                                      |
| Modifier le Kanban                     | `public/js/pages/kanban.js`                                         |
| Modifier les champs d’une tâche        | `public/js/forms/tasks.js`                                          |
| Modifier la validation des formulaires | `public/js/events/forms.js`                                         |
| Modifier les données de départ         | `public/js/data/demo-data.js`                                       |
| Modifier la sauvegarde                 | `public/js/services/storage.js`                                     |
| Adapter le mobile                      | `public/css/responsive.css`                                         |

Après une modification, enregistre le fichier puis recharge le navigateur. Il n’est pas nécessaire de compiler ni de redémarrer le serveur pour modifier les fichiers de `public`.

## Fonctionnalités

- Vue d’ensemble avec indicateurs calculés.
- Tâches : création, modification, priorité, service, responsable et échéance.
- Kanban avec glisser-déposer et modification du statut depuis le détail.
- Commentaires et listes de contrôle.
- Projets, calendrier et événements.
- Services hospitaliers et répertoire des utilisateurs.
- Rapports CSV, notifications et journal d’audit locaux.
- Thème clair/sombre et sauvegardes JSON.

## Données

Les 48 tâches, 8 services, 9 membres et 6 projets initiaux sont fictifs. Les données sont conservées dans le navigateur sous la clé `caresync.hospital.v1`.

Les données du site hébergé et de localhost sont distinctes. Pour les transférer, utilise **Paramètres → Sauvegardes**. La clé de stockage et le format de sauvegarde restent compatibles avec la version précédente de CareSync.

Oracle, l’authentification, les permissions côté serveur et les e-mails ne sont pas connectés. Les rôles affichés appartiennent au répertoire local ; ils ne constituent pas un contrôle d’accès.

Les polices Google Fonts sont facultatives : une police système prend le relais sans Internet.
