import * as Realm from 'realm-web';
import { SNOOTY_STITCH_ID } from '../build-constants';

const config = {
  id: SNOOTY_STITCH_ID,
};
const app = new Realm.App(config);

const loginAnonymous = async () => {
  const credentials = Realm.Credentials.anonymous();
  try {
    const user = await app.logIn(credentials);
    return user;
  } catch (err) {
    console.error('Failed to log in', err);
  }
};

const fetchData = async (funcName, ...argsList) => {
  if (!app.currentUser) {
    await loginAnonymous();
  }
  return await app.currentUser.callFunction(funcName, ...argsList);
};

export const fetchBanner = async (snootyEnv) => {
  return await fetchData('getBanner', snootyEnv === 'development');
};

export const fetchProjectParents = async (database, project) => {
  return await fetchData('fetchProjectParents', database, project);
};

export const fetchSearchPropertyMapping = async (snootyEnv) => {
  return await fetchData('fetchSearchPropertyMapping', snootyEnv);
};

export const fetchOASFile = async (apiName, database) => {
  return await fetchData('fetchOASFile', apiName, database);
};
