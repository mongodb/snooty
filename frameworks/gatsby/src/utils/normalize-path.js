// Remove duplicate slashes in path string
const normalizePath = (path) => path.replace(/\/+/g, `/`);

module.exports.normalizePath = normalizePath;
