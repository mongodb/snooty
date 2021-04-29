import { Stitch } from 'mongodb-stitch-browser-sdk';

export const getStitchClient = (appId) =>
  Stitch.hasAppClient(appId) ? Stitch.getAppClient(appId) : Stitch.initializeAppClient(appId);
