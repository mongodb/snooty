import fs from 'fs';
import path from 'path';
// import { callPostBuildWebhook } from '../../plugins/gatsby-source-snooty-preview/utils/post-build';

export async function handler(event, _context) {
  console.log('This is the Netlify deploy-succeeded trigger function');
  // This file does not currently exist, but should be created on Netlify builds. The INCOMING_HOOK_BODY env var
  // is not automatically passed along, so we use a txt file to save it
  const buildHookDataString = fs.readFileSync(path.resolve(__dirname, '../../build-hook.txt'), 'utf-8');
  const buildHookData = JSON.parse(buildHookDataString);
  const { payload } = event;
  console.log({ event, buildHookData, payload });
  console.log(Object.keys(event));

  // callPostBuildWebhook(parsedTestData);
}
