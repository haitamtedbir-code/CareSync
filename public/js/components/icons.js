// Bibliothèque SVG utilisée par les boutons, le menu et les cartes.

const paths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-8h6v8"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  tasks:
    '<rect x="4" y="4" width="16" height="17" rx="2"/><path d="m8 10 2 2 4-4M8 16h8M9 2h6v4H9z"/>',
  board:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m6-16v16M5.5 8h1M11 8h2m4-1h2M5.5 12h1m4.5 0h2"/>',
  folder:
    '<path d="M3 7V5a2 2 0 0 1 2-2h4l3 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M3 10h18"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-13 4h2m4 0h2m-8 3h2"/>',
  hospital: '<path d="M6 21V3h12v18M3 21h18M9 7h6m-3-3v6m-3 4h1m4 0h1m-6 3h1m4 0h1m-4 4v-3h2v3"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-16a3 3 0 0 1 0 6m4 10v-3a6 6 0 0 0-4-5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-11 12a2 2 0 0 0 4 0"/>',
  chart: '<path d="M3 3v18h18M7 16v-5m5 5V6m5 10V9"/>',
  audit: '<path d="M4 21V3h12l4 4v14zM14 3v6h6M8 13h8m-8 4h6"/>',
  settings:
    '<path d="m10 3-1 3-3 1-3-1-1 4 2 2-1 4 3 1 2 3 4-1 3 1 2-3 3-1-1-4 2-2-1-4-3 1-3-1-1-3z"/><circle cx="11" cy="12" r="3"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  checkcircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 3v1"/>',
  filter: '<path d="M3 4h18l-7 8v7l-4 2v-9z"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  up: '<path d="m5 16 6-6 4 4 6-10m-6 0h6v6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  message: '<path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/>',
  clip: '<path d="m8 13 6-6a3 3 0 0 1 4 4L9 20a5 5 0 0 1-7-7L12 3"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  edit: '<path d="m14 5 5 5M3 21l2-7L17 2l5 5L10 19z"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
  logout: '<path d="M9 3H3v18h6m5-5 5-4-5-4m-8 4h14"/>',
  moon: '<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-11v1"/>',
  link: '<path d="m10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0"/>',
};

const icon = (name, size = 18) =>
  /* HTML */ `<svg
    width="${size}"
    height="${size}"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${paths[name] || paths.tasks}
  </svg>`;

const brand = () =>
  /* HTML */ `<svg class="brand-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="38" height="38" rx="12" fill="#0fb5bf" fill-opacity=".16" />
    <path d="M16 7h8v9h9v8h-9v9h-8v-9H7v-8h9z" stroke="#55e6de" stroke-width="1.5" />
    <path
      d="M3 20h10l4-8 6 17 4-9h10"
      stroke="#55e6de"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </svg>`;

export { icon, brand };
