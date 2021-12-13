const Realm = require('realm-web');
const { SNOOTY_REALM_APP_ID } = require('../build-constants');

const app = new Realm.App({ id: SNOOTY_REALM_APP_ID });

async function loginAnonymous() {
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  }
  return app.currentUser;
}

async function callAuthenticatedFunction(funcName, argsList) {
  try {
    await loginAnonymous();
  } catch (err) {
    console.error(`Failed to authenticate`);
  }
  try {
    return await app.currentUser.functions[funcName](...argsList);
  } catch (err) {
    console.error(`Failed to call function: ${funcName}`);
  }
}

module.exports = {
  callAuthenticatedFunction,
};
