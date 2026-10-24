// Identifiants des nouveaux enregistrements : tâche, projet, commentaire ou événement.

const createId = () =>
  globalThis.crypto?.randomUUID?.() ||
  Date.now().toString(36) + Math.random().toString(36).slice(2);

export { createId };
