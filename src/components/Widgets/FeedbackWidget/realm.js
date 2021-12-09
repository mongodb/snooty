import React from 'react';
import * as Realm from 'realm-web';

const app = new Realm.App({ id: 'feedback-ibcyy' });

// User Authentication & Management
async function loginAnonymous() {
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  }
  return app.currentUser;
}

export async function logout() {
  await app.currentUser?.logOut();
}

export const useRealmUser = () => {
  const [user, setUser] = React.useState(app.currentUser);
  React.useEffect(() => {
    loginAnonymous().then((u) => setUser(u));
  }, []);
  return user;
};

// Feedback Widget Functions
export async function createNewFeedback({ page, user, ...rest }) {
  const feedback = await app.currentUser.callFunction('feedback_create', [{ page, user, ...rest }]);
  return feedback;
}

export async function updateFeedback({ feedback_id, ...fields }) {
  if (!feedback_id) {
    throw new Error('Must specify a feedback item _id to update');
  }
  const feedback = await app.currentUser.callFunction('feedback_update', [{ feedback_id, ...fields }]);
  return feedback;
}

export async function submitFeedback({ feedback_id }) {
  if (!feedback_id) {
    throw new Error('Must specify a feedback item _id to submit');
  }
  const feedback = await app.currentUser.callFunction('feedback_submit', [{ feedback_id }]);
  return feedback;
}

export async function abandonFeedback({ feedback_id }) {
  if (!feedback_id) {
    throw new Error('Must specify a feedback item _id to abandon');
  }
  const result = await app.currentUser.callFunction('feedback_abandon', [{ feedback_id }]);
  return result.modifiedCount === 1;
}

export async function addAttachment({ feedback_id, attachment }) {
  if (!feedback_id) {
    throw new Error('Must specify a feedback item _id to add an attachment to');
  }
  const result = await app.currentUser.callFunction('feedback_addAttachment', [{ feedback_id, attachment }]);
  return result;
}
