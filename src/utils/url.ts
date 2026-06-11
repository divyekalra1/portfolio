// Prefix a root-relative path with the configured base (e.g. '/portfolio').
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const url = (path: string) => `${base}${path}`;
