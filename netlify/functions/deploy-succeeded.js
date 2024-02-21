export async function handler(event, context) {
  console.log('This is the Netlify deploy-succeeded trigger function');
  console.log({ event, context });
}
