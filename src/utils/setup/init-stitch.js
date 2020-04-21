const { Stitch, AnonymousCredential } = require('mongodb-stitch-server-sdk');
const { SNOOTY_STITCH_ID } = require('../../build-constants');

const initStitch = async () => {
  const stitchClient = Stitch.hasAppClient(SNOOTY_STITCH_ID)
    ? Stitch.getAppClient(SNOOTY_STITCH_ID)
    : Stitch.initializeAppClient(SNOOTY_STITCH_ID);
  await stitchClient.auth.loginWithCredential(new AnonymousCredential()).catch(console.error);
  return stitchClient;
};

module.exports = { initStitch };
