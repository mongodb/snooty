const { load } = require('js-toml');
const fs = require('fs/promises');

const createTocNodes = async ({ createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav

  try {
    const tomlContents = (await fs.readFile(`${process.cwd()}/toc_data/toc.toml`)).toString();
    const toc = load(tomlContents);

    createNode({
      tocTree: toc,
      id: createNodeId('toc'),
      internal: {
        contentDigest: createContentDigest(toc),
        type: 'TOC',
      },
      parent: null,
    });
  } catch (e) {
    console.error('error occurred when reading the toc.toml', e);
  }
};

module.exports = {
  createTocNodes,
};
