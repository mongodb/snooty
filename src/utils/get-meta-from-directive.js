const { getNestedValue } = require('./get-nested-value');

// Grabs the metadata values in question and returns them as an array
// for the Meta & TwitterMeta tags
const grabMetadata = (nodes, target) => {
  if (!nodes) {
    return [];
  }
  return nodes.filter((c) => {
    const lookup = c.type === 'directive' ? c.name : c.type;
    return lookup === target;
  });
};
const getMetaFromDirective = (root, nodes, target) => {
  // getting the meta from pageNodes
  // extract the section
  const section = nodes.find((node) => node.type === root);

  // get the nested values from section that will be used for the lookup
  const sectionNodes = getNestedValue(['children'], section);

  return grabMetadata(sectionNodes, target);
};

module.exports.getMetaFromDirective = getMetaFromDirective;
