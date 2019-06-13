export const reportAnalytics = (eventName, data) => {
  if (!window || !window.analytics) return;
  try {
    window.analytics.track(eventName, data);
  } catch (err) {
    console.error(`Error reporting analytics: ${eventName}`, err);
  }
};
