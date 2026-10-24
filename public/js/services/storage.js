// Lecture et écriture de l’espace dans localStorage. Aucun serveur de données n’est utilisé.

import { KEY } from '../config/constants.js';
import { createDemoData } from '../data/demo-data.js';

function loadWorkspace() {
  try {
    let data = JSON.parse(localStorage.getItem(KEY));
    if (
      data?.schema === 1 &&
      Array.isArray(data.tasks) &&
      Array.isArray(data.services) &&
      Array.isArray(data.members) &&
      Array.isArray(data.projects)
    )
      return data;
  } catch {}
  return createDemoData();
}

function saveWorkspace(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export { loadWorkspace, saveWorkspace };
