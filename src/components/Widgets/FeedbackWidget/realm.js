import React from 'react';
import * as Realm from 'realm-web';
import { isBrowser } from '../../../utils/is-browser';

const APP_ID = 'feedbackwidgetv3-dgcsv';
export const app = isBrowser ? Realm.App.getApp(APP_ID) : { auth: {} };

/**
 * @param {object} storage
 * @returns The prefix for the storage key used by Realm for localStorage access
 */
function parseStorageKey(storage) {
  if (!storage.keyPart) {
    return '';
  }
  const prefix = parseStorageKey(storage.storage);
  return prefix + storage.keyPart + ':';
}

/**
 * Deletes localStorage data for all users
 */
async function deleteLocalStorageData() {
  const { allUsers } = app;
  // The accessToken and refreshToken are automatically removed if invalid, but not the following keys
  const keysToDelete = ['profile', 'providerType'];

  Object.values(allUsers).forEach((user) => {
    const storageKeyPrefix = parseStorageKey(user.storage);
    keysToDelete.forEach((key) => {
      localStorage.removeItem(storageKeyPrefix + key);
    });
  });
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
    await deleteLocalStorageData();

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
