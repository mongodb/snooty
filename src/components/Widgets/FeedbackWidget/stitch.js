import React from 'react';
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import { isBrowser } from '../../../utils/is-browser';
import { getStitchClient } from '../../../utils/stitch';

const APP_ID = 'feedbackwidgetv3-dgcsv';
export const app = isBrowser ? getStitchClient(APP_ID) : { auth: {} };

// User Authentication & Management
export async function loginAnonymous() {
  if (!app.auth.user) {
    const user = await app.auth.loginWithCredential(new AnonymousCredential());
    return user;
  } else {
    return app.auth.user;
  }
}
export async function logout() {
  if (app.auth.isLoggedIn) {
    await app.auth.logoutUserWithId(app.auth.user.id);
  } else {
    console.warn('No logged in user.');
  }
}
export const useStitchUser = () => {
  const [user, setUser] = React.useState(app.auth.user);
  React.useEffect(() => {
    loginAnonymous().then(setUser);
  }, []);
  return user;
};

// Feedback Widget Functions
export async function createNewFeedback({ page, user, attachment, ...rest }) {
  const feedback = await app.callFunction('feedback_create', [{ page, user, attachment, ...rest }]);
  return feedback;
}
