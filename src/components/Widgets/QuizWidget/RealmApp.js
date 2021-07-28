import React, { useEffect } from 'react';
import * as Realm from 'realm-web';
import { baseUrl } from './realm.json';

function createRealmApp(id) {
  return new Realm.App({ id, baseUrl });
}
const RealmAppContext = React.createContext(null);

export function RealmAppProvider({ appId, children }) {
  // Store Realm.App in React state. If appId changes, all children will rerender and use the new realmApp.
  const [realmApp, setRealmApp] = React.useState(createRealmApp(appId));
  React.useEffect(() => {
    setRealmApp(createRealmApp(appId));
    logIn();
  }, [appId, logIn]);

  const [currentUser, setCurrentUser] = React.useState(realmApp.currentUser);
  // Wrap the base logIn function to save the logged in user in state
  const logIn = React.useCallback(async () => {
    await realmApp.logIn(Realm.Credentials.anonymous());
    setCurrentUser(realmApp.currentUser);
    console.log('logged in', realmApp);
  }, [realmApp]);
  // Override the App's currentUser & logIn properties + include the app-level logout function
  const realmAppContext = React.useMemo(() => {
    return { ...realmApp, currentUser, logIn };
  }, [realmApp, currentUser, logIn]);

  return <RealmAppContext.Provider value={realmAppContext}>{children}</RealmAppContext.Provider>;
}

export function useRealmApp() {
  const realmApp = React.useContext(RealmAppContext);
  if (!realmApp) {
    throw new Error(`No Realm App found. Make sure to call useRealmApp() inside of a <RealmAppProvider />.`);
  }
  return realmApp;
}
