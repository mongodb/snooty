import fs from 'fs';
import path from 'path';

/**
 * Parses build hook data from the expected temporary location
 * @returns {object | undefined}
 */
const parseBuildHookData = () => {
  // This file does not currently exist, but should be created on Netlify builds as part of `npm run build:netlify`.
  // The INCOMING_HOOK_BODY env var is not automatically passed along to functions, so we use a txt file to save it
  const relativeFilePath = '../../build-hook.txt';
  const buildHookDataString = fs.readFileSync(path.resolve(__dirname, relativeFilePath), 'utf-8');
  if (!buildHookDataString) {
    console.log('No build hook data found.');
    return;
  }
  return JSON.parse(buildHookDataString);
};

/**
 * Returns the URL to the Netlify log for the build
 * @param {*} event
 * @returns {string}
 */
const getNetlifyBuildLog = (event) => {
  const { id: buildId, name: netlifySiteName } = event.body.payload;
  const logSiteBaseUrl = 'https://app.netlify.com/sites';
  return `${logSiteBaseUrl}/${netlifySiteName}/deploys/${buildId}`;
};

export const constructResPayload = (event) => {
  const buildHookData = parseBuildHookData();
  return {
    netlifyBuildLog: getNetlifyBuildLog(event),
    ...buildHookData,
  };
};
