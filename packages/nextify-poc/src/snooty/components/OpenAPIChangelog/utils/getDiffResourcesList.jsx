const getDiffResourcesList = (diff) => {
  const resourcesList = new Set();
  diff.forEach(({ httpMethod, path }) => resourcesList.add(`${httpMethod} ${path}`));

  return Array.from(resourcesList);
};

export default getDiffResourcesList;
