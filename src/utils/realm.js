import * as Realm from 'realm-web';
import { SNOOTY_REALM_APP_ID } from '../build-constants';

const app = new Realm.App({ id: SNOOTY_REALM_APP_ID });

// acts as a singleton to prevent multiple login
// attempts.

let loginDefer;

const loginAnonymous = async () => {
  if (loginDefer) {
    return loginDefer;
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

const callAuthenticatedFunction = async (funcName, ...argsList) => {
  try {
    await loginAnonymous();
    return await app.currentUser.functions[funcName](...argsList);
  } catch (err) {
    console.error(`Failed to call function: ${funcName}`);
  }
};

export const fetchBanner = async (snootyEnv) => {
  return callAuthenticatedFunction('getBanner', snootyEnv === 'development');
};

export const fetchProjectParents = async (database, project) => {
  return callAuthenticatedFunction('fetchProjectParents', database, project);
};

export const fetchSearchPropertyMapping = async (snootyEnv) => {
  return callAuthenticatedFunction('fetchSearchPropertyMapping', snootyEnv);
};

export const fetchOASFile = async (apiName, database) => {
  return callAuthenticatedFunction('fetchOASFile', apiName, database);
};

export const fetchDocument = async (database, collectionName, query, projections) => {
  return callAuthenticatedFunction('fetchDocument', database, collectionName, query, projections);
};

export const fetchDocuments = async (database, collectionName, query, projections, options) => {
  return callAuthenticatedFunction('fetchDocuments', database, collectionName, query, projections, options);
};

export const fetchDocsets = async (database) => {
  return callAuthenticatedFunction('fetchDocsets', database);
};

export const fetchOADiff = async (runId, diffString, snootyEnv) => {
  return callAuthenticatedFunction('fetchOADiff', runId, diffString, snootyEnv);
};
