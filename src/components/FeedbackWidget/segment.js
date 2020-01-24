export function getSegmentUserId() {
  const user = window.analytics.user();
  const segmentId = user.id();
  return {
    isAnonymous: !Boolean(segmentId),
    id: segmentId ? segmentId.toString() : user.anonymousId().toString(),
  };
}

export function sendAnalytics(eventName, voteObj) {
  const eventObj = voteObj;
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
