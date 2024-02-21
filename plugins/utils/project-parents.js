const { siteMetadata } = require('../../src/utils/site-metadata');

const projectParentType = `ProjectParent`;

const createProjectParentNodes = async ({ db, createNode, createNodeId, createContentDigest }) => {
  const { database, project } = siteMetadata;
  console.log(`database ${database} project ${project}`);
  const projectParents = await db.fetchProjectParents(database, project);
  console.log(JSON.stringify(projectParents));
  projectParents.forEach((projectParent) => {
    createNode({
      children: [],
      id: createNodeId(`ProjectParent-${projectParent.url}`),
      internal: {
        contentDigest: createContentDigest(projectParent),
        type: projectParentType,
      },
      parent: null,
      title: projectParent.title,
      url: projectParent.url,
    });
  });
};

module.exports = {
  createProjectParentNodes,
  projectParentType,
};
