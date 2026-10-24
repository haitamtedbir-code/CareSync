// Point d’entrée : brancher les interactions, puis afficher la première page.
import { registerInterfaceEvents } from './events/interface.js';
import { registerFormEvents } from './events/forms.js';
import { registerKanbanEvents } from './events/kanban.js';
import { registerKeyboardEvents } from './events/keyboard.js';
import { render } from './core/render.js';

registerInterfaceEvents();
registerFormEvents();
registerKanbanEvents();
registerKeyboardEvents();
render();
