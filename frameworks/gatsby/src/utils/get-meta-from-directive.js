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

/**
 * @param type the key to look for in the within the n + 2 levels of the nodes
 * @param nodes the children of the type found (i.e. section)
 * @param target the lookup value that we are looking for
 */
const getMetaFromDirective = (type, nodes, target) => {
  // check the root level first
  // and collect the metadata
  let collectionOfMetadata = grabMetadata(nodes, target);
  // getting the meta from pageNodes
  // extract the section to look for the metadata in the second layer
  const section = nodes.find((node) => node.type === type);

  // get the nested values from section
  // and look for the metadata to collect
  const sectionNodes = getNestedValue(['children'], section);
  collectionOfMetadata.push(...grabMetadata(sectionNodes, target));

  return collectionOfMetadata;
};

module.exports.getMetaFromDirective = getMetaFromDirective;
