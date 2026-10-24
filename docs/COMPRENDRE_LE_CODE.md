# Comprendre le code de CareSync

## Commencer par le point d’entrée

`public/index.html` charge `css/main.css` et `js/main.js`.

Le fichier `js/main.js` branche les événements de l’interface, puis appelle `render()` pour afficher le premier écran. Il ne contient pas la logique de toutes les pages.

## Distinguer les données de l’écran affiché

Dans `js/core/state.js` :

- `database` contient les tâches, services, projets, membres et paramètres.
- `viewState` contient la page sélectionnée, les filtres, la recherche et la fenêtre ouverte.

Changer un filtre modifie `viewState`. Ajouter une tâche modifie `database`.

`setDatabase()` permet de remplacer l’espace entier lors de l’import d’une sauvegarde, tout en conservant la référence partagée entre les modules.

## Suivre une action depuis le bouton

Chaque bouton porte un attribut `data-action`. Par exemple, le bouton de création d’une tâche utilise `data-action="new-task"`.

1. `events/interface.js` écoute le clic.
2. `controllers/actions.js` retrouve l’action `new-task`.
3. `ui/modals.js` ouvre la fenêtre.
4. `forms/tasks.js` affiche les champs.
5. `events/forms.js` traite la soumission.
6. `services/workspace.js` enregistre les données et le journal d’audit.
7. `core/render.js` actualise l’affichage.

La délégation des événements permet aux nouveaux boutons de fonctionner après le remplacement du HTML d’une page.

## Comprendre une page

Les fichiers de `js/pages/` préparent et retournent une chaîne HTML. Ils utilisent les données et les filtres, mais ne branchent pas eux-mêmes les clics.

Les fonctions de `js/components/` servent à réutiliser un même affichage : badges, tableaux compacts, cartes d’indicateurs, graphique ou structure principale.

Le commentaire `/* HTML */` indique qu’une chaîne JavaScript contient du HTML. Les expressions `${...}` insèrent les valeurs dans ce HTML.

## Ajouter une information sans mélanger les responsabilités

Pour ajouter un champ à une tâche :

1. Ajoute le champ au formulaire dans `forms/tasks.js`.
2. Vérifie la saisie dans `events/forms.js` si nécessaire.
3. Prévois sa valeur initiale dans `data/demo-data.js`.
4. Affiche-le dans la page concernée.
5. Si le champ est obligatoire dans les sauvegardes, adapte aussi `services/backups.js` en conservant la compatibilité avec les anciens exports.

Les valeurs saisies par l’utilisateur passent par `escapeHtml()` avant d’être insérées dans le HTML. Garde cette protection quand tu ajoutes un nouveau champ.

## Comprendre le stockage

`services/storage.js` lit et écrit les données avec `localStorage`. Les pages n’écrivent pas directement dans le stockage : elles passent par les services.

Si tu modifies les données de démonstration, un navigateur ayant déjà un espace enregistré gardera ses données actuelles. Pour voir les nouveaux exemples, exporte d’abord une sauvegarde, puis utilise la réinitialisation dans les paramètres.

## Travailler en trinôme

Pour limiter les conflits, vous pouvez répartir les zones de travail :

- Une personne : structure générale, CSS et adaptation mobile.
- Une personne : pages des tâches, Kanban et formulaires.
- Une personne : projets, calendrier, services, rapports et sauvegardes.

Convenez ensemble des champs et identifiants partagés avant de modifier les mêmes modèles. Vérifiez régulièrement les parcours dans le navigateur.

## Préparer une évolution vers un backend

Le serveur `server.mjs` sert seulement les fichiers du frontend. Il ne contient pas d’API métier.

L’ajout d’un backend impliquera de remplacer la sauvegarde locale par des appels HTTP et de traiter l’authentification, les validations et les permissions sur le serveur. Une modification du rôle dans le navigateur ne doit jamais suffire à obtenir des permissions réelles.
