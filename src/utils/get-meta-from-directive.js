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
const getMetaFromDirective = (type, nodes, target) => {
  let collectionOfMetadata = [];
  // check the root level first
  // and collect the metadata
  collectionOfMetadata = [...collectionOfMetadata, ...grabMetadata(nodes, target)];
  // getting the meta from pageNodes
  // extract the section to look for the metadata in the second layer
  const section = nodes.find((node) => node.type === type);

  // get the nested values from section
  // and look for the metadata to collect
  const sectionNodes = getNestedValue(['children'], section);
  collectionOfMetadata = [...collectionOfMetadata, ...grabMetadata(sectionNodes, target)];

  return collectionOfMetadata;
};

module.exports.getMetaFromDirective = getMetaFromDirective;
