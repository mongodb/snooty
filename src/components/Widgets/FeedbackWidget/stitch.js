import React from 'react';
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import { isBrowser } from '../../../utils/is-browser';
import { getStitchClient } from '../../../utils/stitch';

const APP_ID = 'feedback-ibcyy';
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
export async function createNewFeedback({ page, user, ...rest }) {
  const feedback = app.callFunction('feedback_create', [{ page, user, ...rest }]);
  return feedback;
}

export async function updateFeedback({ feedback_id, ...fields }) {
  if (!feedback_id) {
    throw new Error('Must specify a feedback item _id to update');
  }
  const feedback = await app.callFunction('feedback_update', [{ feedback_id, ...fields }]);
  return feedback;
}

export async function submitFeedback({ feedback_id }) {
  if (!feedback_id) {
    throw new Error('Must specify a feedback item _id to submit');
  }
  const feedback = await app.callFunction('feedback_submit', [{ feedback_id }]);
  return feedback;
}

/** 
export async function abandonFeedback({ feedback_id }) {
  if (!feedback_id) {
    throw new Error('Must specify a feedback item _id to abandon');
  }
  const result = await app.callFunction('feedback_abandon', [{ feedback_id }]);
  return result.modifiedCount === 1;
}
*/

export async function addAttachment({ feedback_id, attachment }) {
  if (!feedback_id) {
    throw new Error('Must specify a feedback item _id to add an attachment to');
  }
  const result = await app.callFunction('feedback_addAttachment_updatedSDKs', [{ feedback_id, attachment }]);
  return result;
}
