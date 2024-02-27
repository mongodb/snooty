import fs from 'fs';
import path from 'path';

/**
 * Parses build hook data from the expected temporary location
 * @returns {object | undefined}
 */
const parseBuildHookData = () => {
  // This file does not currently exist, but should be created on Netlify builds as part of `npm run build:netlify`.
  // The INCOMING_HOOK_BODY env var is not automatically passed along to functions, so we use a txt file to save it
  const relativeFilePath = '../build-hook.txt';
  const buildHookDataString = fs.readFileSync(path.resolve(__dirname, relativeFilePath), 'utf-8');
  if (!buildHookDataString) {
    console.log('No build hook data found.');
    return;
  }
  return JSON.parse(buildHookDataString);
};

export const constructResPayload = (event) => {
  const buildHookData = parseBuildHookData();
  const parsedEventBody = JSON.parse(event.body);
  // This is Netlify's default post-deployment payload. We include it with our custom data in case
  // we want to process any information
  const netlifyPayload = parsedEventBody.payload;
  return {
    netlifyPayload,
    ...buildHookData,
  };
};
