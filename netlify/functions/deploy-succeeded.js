import fs from 'fs';
import path from 'path';

export async function handler(event) {
  console.log('This is the Netlify deploy-succeeded trigger function');
  // Has to be relative to where included_file originates from
  const testData = fs.readFileSync(path.resolve(__dirname, '../../build-hook.txt'), 'utf-8');
  const parsedTestData = JSON.parse(testData);
  const incomingHookBody = process.env.INCOMING_HOOK_BODY;
  console.log({ event, incomingHookBody, parsedTestData });
}
