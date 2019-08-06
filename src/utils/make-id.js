/*
 * Simplified implementation of docutils's make_id() function.
 * Reference: http://code.nabla.net/doc/docutils/api/docutils/nodes/docutils.nodes.make_id.html
 *
 * Convert a string into a lowercase kebab-case slug.
 */
export const makeId = string =>
  string
    .toLowerCase()
    .replace(/\W+$/, '')
    .replace(/\W+/g, '-');
