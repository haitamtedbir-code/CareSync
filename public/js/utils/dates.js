// Calculs de dates locales et libellés français affichés dans les écrans.

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const today = () => iso(new Date());

const offset = (n) => {
  let d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};

const formatDate = (d, options = { day: 'numeric', month: 'short' }) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', options) : 'Sans échéance';

const dateTime = (d) =>
  new Date(d).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const humanDue = (d) =>
  d === today() ? 'Aujourd’hui' : d === offset(1) ? 'Demain' : formatDate(d);

export { iso, today, offset, formatDate, dateTime, humanDue };
