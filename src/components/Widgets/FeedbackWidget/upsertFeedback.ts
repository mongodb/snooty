import { ObjectID } from 'bson';
import type { FeedbackPayload } from './context';

const FEEDBACK_USER_KEY = 'feedback_user_session';

/**
 * Generates a new anonymous user session ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gets or creates an anonymous user session ID for feedback
 */
export const getOrCreateUserId = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: generate temporary ID
    return generateUserId();
  }

  try {
    let userId = localStorage.getItem(FEEDBACK_USER_KEY);
    if (!userId) {
      userId = generateUserId();
      localStorage.setItem(FEEDBACK_USER_KEY, userId);
    }
    return userId;
  } catch (e) {
    console.error('Failed to access localStorage for feedback user', e);
    return generateUserId();
  }
};

// Feedback Widget Functions
export async function upsertFeedback({ page, user, attachment, ...rest }: FeedbackPayload): Promise<string> {
  console.log('Upsert feedback payload', page, user, attachment, rest);
  const { viewport, comment, category, rating, snootyEnv, feedback_id } = rest;

  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/feedback/upsert/`, {
    method: 'POST',
    body: JSON.stringify({
      page,
      user,
      attachment,
      viewport,
      comment,
      category,
      rating,
      snootyEnv,
      feedback_id,
    }),
  });
  const updateOneRes = await res.json();
  const objectId = new ObjectID(updateOneRes.upsertedId);
  return objectId.toString();
}
