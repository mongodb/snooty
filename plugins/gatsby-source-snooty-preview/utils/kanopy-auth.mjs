/**
 * Checks if the configuration property exists, and throws an error otherwise.
 * @param configProp
 * @param configType
 */
const validateConfigType = (configProp, configType) => {
  if (!configProp) {
    throw new Error(`Missing ${configType} for Snooty Data API access`);
  }
};

/**
 * Generates the authZ token needed for requesting an access token to Kanopy.
 */
const getClientCredentialsHeader = () => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  validateConfigType(clientId, 'client ID');
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  validateConfigType(clientSecret, 'client secret');
  return Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64');
};

/**
 * Generates a new access token to allow for authentication against Kanopy services.
 */
const generateNewAccessToken = async () => {
  const grantType = process.env.OAUTH_GRANT_TYPE;
  validateConfigType(grantType, 'grant type');
  const scope = process.env.OAUTH_SCOPE;
  validateConfigType(scope, 'scope');
  const authUrl = process.env.OAUTH_TOKEN_AUTH_URL;
  validateConfigType(authUrl, 'auth token url');

  // Request a new access token from Kanopy's token authentication endpoint
  const authRequestUrl = `${authUrl}?grant_type=${grantType}&scope=${scope}`;
  const headers = {
    authorization: `Basic ${getClientCredentialsHeader()}`,
    accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'cache-control': 'no-cache',
  };
  const res = await fetch(authRequestUrl, { method: 'POST', headers });
  if (!res.ok) {
    throw new Error('Error trying to request new access token');
  }

  const data = await res.json();
  const token = data['access_token'];
  if (!token) {
    throw new Error('Could not find new access token');
  }

  return token;
};

/**
 * Returns a valid client access token that can be used for machine-machine communication
 * between a client and a service hosted on Kanopy.
 * See: https://kanopy.corp.mongodb.com/docs/development/authentication_and_authorization/
 * @param prevToken
 */
const fetchClientAccessToken = async (prevToken) => {
  if (!prevToken) {
    return generateNewAccessToken();
  }
  // Decoded value is the JSON object representation of the token string, with token's expiration date
  const decodedValue = JSON.parse(Buffer.from(prevToken.split('.')[1], 'base64').toString('ascii'));
  // Check if token is expired, or near expiration
  if (decodedValue.exp < Date.now() / 1000) {
    return generateNewAccessToken();
  }
  return prevToken;
};

export default fetchClientAccessToken;
