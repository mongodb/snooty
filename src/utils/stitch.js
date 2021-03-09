/**
 * TODO: Attempt to get this working as a util function. Currently, it causes a failure when running npm run develop
 * Check to see if Stitch appId is linked to an existing connection. If not, intialize a new connection.
 */
/* export const getStitchClient = appId =>
  Stitch.hasAppClient(appId) ? Stitch.getAppClient(appId) : Stitch.initializeAppClient(appId); */

import { Stitch } from 'mongodb-stitch-browser-sdk';

export const getStitchClient = (appId) =>
  Stitch.hasAppClient(appId) ? Stitch.getAppClient(appId) : Stitch.initializeAppClient(appId);
