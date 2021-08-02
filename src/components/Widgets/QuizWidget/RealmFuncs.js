import { useEffect } from 'react';
import { useCollection } from './hooks/useCollection';
import { dataSourceName } from './realm.json';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';

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
