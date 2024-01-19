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

/**
 * Attempts to remove the current user in place of a new anonymous user
 * @returns A new anonymous user
 */
async function reassignCurrentUser() {
  const oldUser = app.currentUser;
  try {
    await app.removeUser(oldUser);
  } catch (e) {
    console.error(e);
    // Clean up invalid data from local storage to avoid bubbling up local storage sizes for unused users
    await deleteLocalStorageData();
  }

  const newUser = await app.logIn(Realm.Credentials.anonymous());
  return newUser;
}

/**
 * Makes a call to the Feedback Widget App Service to ensure the current user can succesfully
 * call out to the app. Otherwise, a new user is created in case credentials are completely invalid.
 * @returns A valid user
 */
async function validateCurrentUser() {
  try {
    await app.currentUser.refreshAccessToken();
    // Ideally, this would only error in the event that current anonymous credentials are messed up beyond repair
    const success = await app.currentUser.callFunction('validateConnection');
    if (!success) {
      return reassignCurrentUser();
    }
    return app.currentUser;
  } catch (e) {
    console.error(e);
    return reassignCurrentUser();
  }
}

// User Authentication & Management
export async function loginAnonymous() {
  if (!app.currentUser) {
    const user = await app.logIn(Realm.Credentials.anonymous());
    return user;
  }
  return validateCurrentUser();
  // return app.currentUser;
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
  React.useEffect(() => {
    loginAnonymous()
      .then(setUser)
      .catch((e) => {
        console.error(e);
      });
  }, []);
  return user;
};

// Feedback Widget Functions
export async function createNewFeedback({ page, user, attachment, ...rest }) {
  const feedback = await app.currentUser.callFunction('feedback_create', { page, user, attachment, ...rest });
  return feedback;
}
