import { useCollection } from './hooks/useCollection';
import { dataSourceName } from './realm-constants';

export function useRealmFuncs(dbName, collectionName) {
  const currentCollection = useCollection({
    cluster: dataSourceName,
    db: dbName,
    collection: collectionName,
  });

  const insertDocument = async (todo) => {
    await currentCollection.insertOne(todo);
  };
  return {
    insertDocument,
  };
}
