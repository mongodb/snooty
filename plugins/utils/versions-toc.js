const { load } = require('js-toml');
const fs = require('fs/promises');

const createVersionNodes = async ({ createNode, createNodeId, createContentDigest }) => {
  // Getting data for all our versioned repos

  try {
    const tomlContents = (await fs.readFile(`${process.cwd()}/toc_data/versions.toml`)).toString();
    const repo = load(tomlContents);
    console.log('the toml contents are', repo);

    createNode({
      versionsList: repo,
      id: createNodeId('repo'),
      internal: {
        contentDigest: createContentDigest(repo),
        type: 'versionsData',
      },
      parent: null,
    });
  } catch (e) {
    console.error('error occurred when reading the versions.toml', e);
  }
};

module.exports = {
  createVersionNodes,
};
