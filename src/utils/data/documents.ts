import type { Document, Filter, FindOptions } from 'mongodb';
import type { MetadataDatabaseName, ReposDatabaseName } from '../../types/data';

type Projection<T> = Pick<T, Extract<keyof T, string | number>> | Record<string, 0 | 1>;

export const fetchDocument = async <T extends Document>(
  dbName: ReposDatabaseName | MetadataDatabaseName,
  collectionName: string,
  query: Filter<T>,
  projectionOptions?: Projection<T>,
  sortOptions?: FindOptions<T>
) => {
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

export const fetchDocumentSorted = async <T extends Document>(
  dbName: ReposDatabaseName | MetadataDatabaseName,
  collectionName: string,
  query: Filter<T>,
  sortOptions?: FindOptions<T>
) => {
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

export const fetchDocuments = async <T extends Document>(
  dbName: ReposDatabaseName | MetadataDatabaseName,
  collectionName: string,
  query: Filter<T>,
  options?: FindOptions<T>
) => {
  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/documents/`, {
    method: 'POST',
    body: JSON.stringify({
      dbName,
      collectionName,
      query: query ?? {},
      options: options ?? {},
    }),
  });
  return res.json();
};
