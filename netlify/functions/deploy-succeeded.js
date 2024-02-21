import fs from 'fs';
import path from 'path';

export async function handler(event) {
  console.log('This is the Netlify deploy-succeeded trigger function');
  // Go back a directory since this is where included files are added
  const testData = fs.readFileSync(path.resolve(__dirname, '../build-hook.txt'));
  const incomingHookBody = process.env.INCOMING_HOOK_BODY;
  console.log({ event, incomingHookBody, testData });
}
