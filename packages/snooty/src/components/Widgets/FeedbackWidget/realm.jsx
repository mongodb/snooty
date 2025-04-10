import React from 'react';
import * as Realm from 'realm-web';
import { ObjectID } from 'bson';
import { isBrowser } from '../../../utils/is-browser';
import { removeAllRealmUsersFromLocalStorage } from '../../../utils/realm-user-management';

const APP_ID = 'feedbackwidgetv3-dgcsv';
export const app = isBrowser ? Realm.App.getApp(APP_ID) : { auth: {} };

/**
 * Deletes localStorage data for all users
 */
function deleteLocalStorageData() {
  const { allUsers } = app;
  removeAllRealmUsersFromLocalStorage(allUsers);
}

// User Authentication & Management
export async function loginAnonymous() {
  if (!app.currentUser) {
    const user = await app.logIn(Realm.Credentials.anonymous());
    return user;
  }
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
    const oldUser = app.currentUser;
    try {
      await app.removeUser(oldUser);
    } catch (e) {
      console.error(e);
    }

    // Clean up invalid data from local storage to avoid bubbling up local storage sizes for broken user credentials
    // This should be safe since only old users' data would be deleted, and we make a new user right after
    deleteLocalStorageData();

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
export async function upsertFeedback({ page, user, attachment, ...rest }) {
  const updateOneRes = await app.currentUser.callFunction('feedback_upsert', { page, user, attachment, ...rest });
  const objectId = new ObjectID(updateOneRes.upsertedId);
  return objectId.toString();
}
