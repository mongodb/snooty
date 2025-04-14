// Remove duplicate slashes in path string
export const normalizePath = (path) => path.replace(/\/+/g, `/`);
