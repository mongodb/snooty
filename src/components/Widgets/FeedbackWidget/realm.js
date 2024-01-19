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
  }
  // return validateCurrentUser();
  return app.currentUser;
}

export async function logout() {
  if (app.auth.isLoggedIn) {
    await app.auth.logoutUserWithId(app.id);
  } else {
    console.warn('No logged in user.');
  }
}

export const useRealmUser = () => {
  const [user, setUser] = React.useState(app.currentUser);

  async function reassignCurrentUser() {
    // Attempt to remove the user so that localStorage can be cleared out
    if (app.currentUser) {
      try {
        await app.removeUser(app.currentUser);
      } catch (e) {
        console.error(e);
      }
    }

    const newUser = await app.logIn(Realm.Credentials.anonymous());
    setUser(newUser);
    return newUser;
  }

  // Initial user login
  React.useEffect(() => {
    loginAnonymous()
      .then(setUser)
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return { user, reassignCurrentUser };
};

// Feedback Widget Functions
export async function createNewFeedback({ page, user, attachment, ...rest }) {
  const feedback = await app.currentUser.callFunction('feedback_create', { page, user, attachment, ...rest });
  return feedback;
}
