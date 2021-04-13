const getDatabase = (env) => {
  const dbMap = new Map([
    ['development', 'snooty_dev'],
    ['staging', 'snooty_stage'],
    ['production', 'snooty_prod'],
  ]);

  if (dbMap.has(env)) {
    return dbMap.get(env);
  }

  throw new Error('Invalid env argument supplied');
};

const getWriteOperations = (iatree, parentPaths, slugToTitle) => {
  const getTitle = (slug) => slugToTitle[slug] || [];

  const makeUrl = (slug) => {
    const baseUrl = `https://docs.mongodb.com`;
    return `${baseUrl}/${slug}/`;
  };

  const makeUpdateOperation = (projectName, parents) => {
    const filter = { projectName };
    const update = { $set: { parents } };
    return {
      updateOne: { filter, update },
    };
  };

  const getProjects = (tree) => {
    const dive = (obj) => {
      if (obj['project_name']) {
        projectNames.push(obj['project_name']);
      }

      if (obj.children) {
        return obj.children.forEach(dive);
      }
    };

    const projectNames = [];
    dive(tree);
    return projectNames;
  };

  const getWrites = (projectNames) =>
    projectNames.map((project) => {
      const projectParents = parentPaths[project] || [];
      const parentEntries = projectParents.map((parent) => ({
        title: getTitle(parent),
        url: makeUrl(parent),
      }));
      return makeUpdateOperation(project, parentEntries);
    });

  const projects = getProjects(iatree);
  return getWrites(projects);
};

const serviceName = 'mongodb-atlas';

const getMetadataDoc = async (dbName, collectionName, query) => {
  const collection = context.services.get(serviceName).db(dbName).collection(collectionName);
  return await collection.findOne(query);
};

const bulkWrite = async (dbName, collectionName, data) => {
  const collection = context.services.get(serviceName).db(dbName).collection(collectionName);
  return await collection.bulkWrite(data);
};

const updateNav = async (env, query) => {
  const db = getDatabase(env);
  const sourceCollection = 'metadata';
  const destinationCollection = 'navigation';

  const metadataDoc = await getMetadataDoc(db, sourceCollection, query);
  if (!metadataDoc) {
    throw new Error(`Query ${JSON.stringify(query)} in ${db}.${sourceCollection} did not return any documents.`);
  }

  const { iatree, parentPaths, slugToTitle } = metadataDoc;
  if (!iatree) {
    throw new Error(
      `Metadata document ${JSON.stringify(
        query
      )} in ${db}.${sourceCollection} did not contain an iatree. Please ensure that this project uses "ia" directives.`
    );
  }

  const writes = getWriteOperations(iatree, parentPaths, slugToTitle);

  return await bulkWrite(db, destinationCollection, writes);
};

/**
 * Write data from a property's IA tree to snooty's navigation collection
 * @param {Object} arg
 * @param {string} [arg.env=development] - Database environment in which to apply the function. Must equal development, staging, or production
 * @param {Object} [arg.query={page_id: 'landing/docsworker-xlarge/master'}] - MongoDB query object used to find root IA tree
 * @returns {Promise} Promise object represents the result of the bulkWrite operation
 */
exports = async function (arg = {}) {
  const defaultEnv = 'development';
  const defaultQuery = { page_id: 'landing/docsworker-xlarge/master' };

  const { env = defaultEnv, query = defaultQuery } = arg;
  return await updateNav(env, query);
};
