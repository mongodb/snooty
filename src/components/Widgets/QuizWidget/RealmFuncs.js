import { useCollection } from './hooks/useCollection';
import { dataSourceName } from './realm.json';

export function useRealmFuncs(dbName, collectionName) {
  const responseCollection = useCollection({
    cluster: dataSourceName,
    db: dbName,
    collection: collectionName,
  });

  const addResponse = async (todo) => {
    await responseCollection.insertOne(todo);
  };
  return {
    addResponse,
  };
}
