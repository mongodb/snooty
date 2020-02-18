export function getSegmentUserId() {
  const user = window.analytics.user();
  // Get the user's persistent Segment ID, if they have one
  const segmentId = user.id();
  return {
    // If the user doesn't have a persistent Segment ID then they're anonymous
    isAnonymous: !Boolean(segmentId),
    // Return the Persistent ID or Anonymous ID as a string
    id: segmentId ? segmentId.toString() : user.anonymousId().toString(),
  };
}

export function sendAnalytics(eventName, eventObj) {
  try {
    const { id, isAnonymous } = getSegmentUserId();
    if (isAnonymous) {
      eventObj.segmentAnonymousID = id;
    } else {
      eventObj.segmentUID = id;
    }
    window.analytics.track(eventName, eventObj);
  } catch (err) {
    console.error(err);
  }
  return eventObj;
}
