module.exports = {
  ci: {
    upload: {
      target: 'lhci',
      serverBaseUrl: process.env.LIGHTHOUSE_SERVER_URL,
      token: process.env.LIGHTHOUSE_BUILD_TOKEN,
    },
  },
};
