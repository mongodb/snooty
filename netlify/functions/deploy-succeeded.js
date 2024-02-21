import fs from 'fs';
import path from 'path';

export async function handler(event) {
  const testData = fs.readFileSync(path.resolve(__dirname, './build-hook.txt'));
  console.log('This is the Netlify deploy-succeeded trigger function');
  const incomingHookBody = process.env.INCOMING_HOOK_BODY;
  console.log({ event, incomingHookBody, testData });
}
