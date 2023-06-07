// Grabs the metadata values in question and returns them as an array
// for the Meta & TwitterMeta tags
const grabMetaFromDirective = (nodes, target) => {
  if (!nodes) {
    return [];
  }
  return nodes.filter((c) => {
    const lookup = c.type === 'directive' ? c.name : c.type;
    return lookup === target;
  });
};

module.exports.grabMetaFromDirective = grabMetaFromDirective;
