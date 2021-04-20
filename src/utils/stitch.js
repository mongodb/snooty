import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk';

export const getStitchClient = (appId) =>
  Stitch.hasAppClient(appId) ? Stitch.getAppClient(appId) : Stitch.initializeAppClient(appId);

const fetchData = async (appId, funcName, argsList = []) => {
  const client = getStitchClient(appId);
  await client.auth.loginWithCredential(new AnonymousCredential()).catch(console.error);
  return await client.callFunction(funcName, argsList);
};

export const fetchBanner = async (appId) => {
  return await fetchData(appId, 'getBanner', []);
};

export const fetchProjectParents = async (appId, database, project) => {
  return await fetchData(appId, 'fetchProjectParents', [database, project]);
};
