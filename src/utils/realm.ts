import * as Realm from 'realm-web';
import { Filter, FindOptions, Document } from 'mongodb';
import { SNOOTY_REALM_APP_ID } from '../build-constants';
import { Docset, MetadataDatabaseName, ReposDatabaseName } from '../types/data';
import { currentRealmUsersCleanup } from './realm-user-management';

type Projection<T> = Pick<T, Extract<keyof T, string | number>> | Record<string, 0 | 1>;

const app = new Realm.App({ id: SNOOTY_REALM_APP_ID });

// acts as a singleton to prevent multiple login
// attempts.

let loginDefer: null | Promise<Realm.User>;

const loginAnonymous = async () => {
  if (loginDefer) {
    return loginDefer;
  }

  // Clears realm users from localStorage if there are more than
  // n number of users.
  // n = second param
  currentRealmUsersCleanup(app, 5);

  // Avoid creating multiple users if one already exists
  if (app.currentUser) {
    return;
  }

  loginDefer = new Promise(async (res, rej) => {
    try {
      const credentials = Realm.Credentials.anonymous();
      const user = await app.logIn(credentials);
      res(user);
    } catch (err) {
      console.error('Failed to login', err);
    }
  });

  return loginDefer.finally(() => {
    loginDefer = null;
  });
};

const callAuthenticatedFunction = async (funcName: string, ...argsList: unknown[]) => {
  try {
    await loginAnonymous();
    return await (app.currentUser as Realm.User).functions[funcName](...argsList);
  } catch (err) {
    console.error(`Failed to call function: ${funcName}`);
  }
};

export const fetchOASFile = async (apiName: string, database: MetadataDatabaseName) => {
  return callAuthenticatedFunction('fetchOASFile', apiName, database);
};

export const fetchDocument = async <T extends Document>(
  database: ReposDatabaseName | MetadataDatabaseName,
  collectionName: string,
  query: Filter<T>,
  projections?: Projection<T>,
  findOptions?: FindOptions<T>
): Promise<T | null> => {
  return callAuthenticatedFunction('fetchDocumentSorted', database, collectionName, query, projections, findOptions);
};

export const fetchDocset = async <T extends Document>(
  database: ReposDatabaseName,
  matchConditions: Filter<T>
): Promise<Docset> => {
  return callAuthenticatedFunction('fetchDocset', database, matchConditions);
};

export const fetchDocuments = async <T extends Document>(
  database: ReposDatabaseName | MetadataDatabaseName,
  collectionName: string,
  query: string,
  projections?: Projection<T>,
  options?: FindOptions<T>
): Promise<T[]> => {
  return callAuthenticatedFunction('fetchDocuments', database, collectionName, query, projections, options);
};

export const fetchDocsets = async (database: ReposDatabaseName): Promise<Array<Docset>> => {
  return callAuthenticatedFunction('fetchDocsets', database);
};
