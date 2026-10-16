// Pastel backgrounds that rotate across products so every grid feels colourful.
const tints = [
  'bg-rose-50',
  'bg-amber-50',
  'bg-sky-50',
  'bg-violet-50',
  'bg-emerald-50',
  'bg-orange-50',
  'bg-fuchsia-50',
  'bg-teal-50',
];

export function tintFor(id: number) {
  return tints[id % tints.length];
}
