const Realm = require('realm-web');
const { SNOOTY_STITCH_ID } = require('../../build-constants');

const initStitch = async () => {
  // Returns an instance of an app.
  // If an app with the specified id hasn't been created,
  // a new app instance will be created.
  const stitchClient = Realm.App.getApp(SNOOTY_STITCH_ID);
  const anonymous = await stitchClient.logIn(Realm.Credentials.anonymous());
  return anonymous;
};

module.exports = { initStitch };
