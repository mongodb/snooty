export const reportAnalytics = (eventName, data) => {
  if (!window || !window.segment) return;
  try {
    window.segment.track(eventName, data);
  } catch (err) {
    console.error(`Error reporting analytics: ${eventName}`, err);
  }
};
