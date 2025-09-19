const fetchDocument = async (dbName, collectionName, query, projectionOptions, sortOptions) => {
  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/document/`, {
    method: 'POST',
    body: JSON.stringify({
      dbName,
      collectionName,
      query: query ?? {},
      projections: projectionOptions ?? {},
      sortOptions: sortOptions ?? {},
    }),
  });
  return res.json();
};

const fetchDocumentSorted = async (dbName, collectionName, query, sortOptions) => {
  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/document/`, {
    method: 'POST',
    body: JSON.stringify({
      dbName,
      collectionName,
      query: query ?? {},
      sortOptions: sortOptions ?? {},
    }),
  });
  return res.json();
};

module.exports = {
  fetchDocument,
  fetchDocumentSorted,
};
