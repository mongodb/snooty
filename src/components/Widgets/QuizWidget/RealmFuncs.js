import { useCollection } from './hooks/useCollection';
import { dataSourceName } from './realm.json';

export function useRealmFuncs() {
  const responseCollection = useCollection({
    cluster: dataSourceName,
    db: 'quiz_test',
    collection: 'responses',
  });

  const addResponse = async (todo) => {
    await responseCollection.insertOne(todo);
  };
  return {
    addResponse,
  };
}
