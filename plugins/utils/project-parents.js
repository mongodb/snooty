const { siteMetadata } = require('../../src/utils/site-metadata');

const projectParentType = `ProjectParent`;

const createProjectParentNodes = async ({ db, createNode, createNodeId, createContentDigest, getNodesByType }) => {
  const { database, project } = siteMetadata;
  const metadataNodes = getNodesByType('SnootyMetadata');
  await Promise.all(
    [...metadataNodes.map((md) => md.project), project]
      .filter((project) => project)
      .map(async (project) => {
        const projectParents = await db.fetchProjectParents(database, project);
        createNode({
          children: [],
          id: createNodeId(`ProjectParent-${project}`),
          internal: {
            contentDigest: createContentDigest(projectParents),
            type: projectParentType,
          },
          parent: null,
          parents: projectParents,
          project: project,
        });
      })
  );
};

module.exports = {
  createProjectParentNodes,
  projectParentType,
};
