import React from 'react';
import * as Realm from 'realm-web';
import { ObjectID } from 'bson';
import { isBrowser } from '../../../utils/is-browser';
import { removeAllRealmUsersFromLocalStorage } from '../../../utils/realm-user-management';
import { FeedbackPayload } from './context';

const APP_ID = 'feedbackwidgetv3-dgcsv';
export const app = isBrowser ? Realm.App.getApp(APP_ID) : { auth: {} };
const isRealmApp = (app: unknown): app is Realm.App => {
  return !!app && typeof (app as Realm.App).logIn === 'function';
};

/**
 * Deletes localStorage data for all users
 * allUsers is only available when app is a real Realm app (when `isBrowser` is true)
 */
function deleteLocalStorageData() {
  if (isRealmApp(app)) {
    removeAllRealmUsersFromLocalStorage(app.allUsers);
  }
}

// User Authentication & Management
export async function loginAnonymous() {
  if (!isRealmApp(app)) return null;
  if (!app.currentUser) {
    const user = await app.logIn(Realm.Credentials.anonymous());
    return user;
  }
  return app.currentUser;
}

export async function logout() {
  if (!isRealmApp(app) || !app.currentUser) {
    console.warn('No logged in user.');
    return;
  }
  await app.currentUser.logOut();
}

export const useRealmUser = () => {
  const [user, setUser] = React.useState(isRealmApp(app) ? app.currentUser : null);

  async function reassignCurrentUser() {
    if (!isRealmApp(app)) return null;
    const oldUser = app.currentUser;
    if (oldUser) {
      try {
        await app.removeUser(oldUser);
      } catch (e) {
        console.error(e);
      }
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
export async function upsertFeedback({ page, user, attachment, ...rest }: FeedbackPayload) {
  if (!isRealmApp(app) || !app.currentUser) return;
  const updateOneRes = await app.currentUser.callFunction<{ upsertedId: string }>('feedback_upsert', {
    page,
    user,
    attachment,
    ...rest,
  });
  const objectId = new ObjectID(updateOneRes.upsertedId);
  return objectId.toString();
}
