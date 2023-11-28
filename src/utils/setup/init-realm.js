import Realm from 'realm-web';
import { SNOOTY_REALM_APP_ID } from '../../build-constants.js';

const initRealm = async () => {
  // Returns an instance of an app.
  // If an app with the specified id hasn't been created,
  // a new app instance will be created.
  const realmClient = Realm.App.getApp(SNOOTY_REALM_APP_ID);
  const anonymous = await realmClient.logIn(Realm.Credentials.anonymous());
  return anonymous;
};

export { initRealm };
