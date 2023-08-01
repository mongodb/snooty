const crypto = require('crypto');

/**
 * Constructs a signature using the payload and Snooty's secret. The signature
 * can be used to help webhooks be more confident that the caller is Snooty.
 * @param {string} payloadString
 */
const constructSnootyHeader = (payloadString) =>
  crypto.createHmac('sha256', process.env.SNOOTY_SECRET).update(payloadString).digest('hex');

/**
 * Calls the post-build webhook to let the Autobuilder know that the Gatsby Cloud
 * build is complete.
 * @param {object} webhookBody - The webhook body passed to the source plugin to
 * initiate the preview build.
 * @param {string} status - The status of the build, typically "success" or "failed".
 * This value should coincide with the Autobuilder's job statuses.
 */
const callPostBuildWebhook = async (webhookBody, status) => {
  // Webhook body could be empty if the Gatsby Cloud site is doing a fresh build
  // that was not called by the preview webhook
  if (!webhookBody || !Object.keys(webhookBody).length) {
    console.log('No webhookBody found. This build will not call the post-build webhook.');
    return;
  }

  const payload = {
    ...webhookBody,
    status,
  };
  const body = JSON.stringify(payload);
  const headers = {
    'x-snooty-signature': constructSnootyHeader(body),
  };

  console.log('Calling post-build webhook.');
  const res = await fetch(process.env.AUTOBUILDER_POST_BUILD_WEBHOOK, { method: 'POST', body, headers });
  // Calling the webhook from this function should assume we are fulfilling the requirements of the call.
  // Any error thrown here is definitely unexpected.
  if (!res.ok) {
    const errMessage = await res.text();
    throw new Error(
      `There was an issue calling the Autobuilder post-build webhook. Please have the DOP team check CloudWatch logs. ${errMessage}`
    );
  }
  console.log('Post-build webhook was successfully called!');
};

module.exports = { callPostBuildWebhook };
