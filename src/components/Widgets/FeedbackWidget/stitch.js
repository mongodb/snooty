import React from 'react';
import * as Realm from 'realm-web';
import { isBrowser } from '../../../utils/is-browser';

const APP_ID = 'feedbackwidgetv3-dgcsv';
export const app = isBrowser ? Realm.App.getApp(APP_ID) : { auth: {} };

// User Authentication & Management
export async function loginAnonymous() {
  if (!app.currentUser) {
    const user = await app.logIn(Realm.Credentials.anonymous());
    return user;
  } else {
    return app;
  }
}
export async function logout() {
  if (app.auth.isLoggedIn) {
    await app.auth.logoutUserWithId(app.id);
  } else {
    console.warn('No logged in user.');
  }
}
export const useStitchUser = () => {
  const [user, setUser] = React.useState(app.currentUser);
  React.useEffect(() => {
    loginAnonymous().then(setUser);
  }, []);
  return user;
};

// Feedback Widget Functions
export async function createNewFeedback({ page, user, attachment, ...rest }) {
  const feedback = await app.currentUser.callFunction('feedback_create', { page, user, attachment, ...rest });
  return feedback;
}
