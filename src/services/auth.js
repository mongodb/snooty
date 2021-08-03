import { OktaAuth } from '@okta/okta-auth-js';
import { isBrowser } from '../utils/is-browser';

let authClient;
if (isBrowser) {
  authClient = new OktaAuth({
    url: process.env.AUTH_BASE_URL,
    clientId: process.env.AUTH_CLIENT_ID,
    redirectUri: process.env.REDIRECT_URI,
    issuer: process.env.AUTH_BASE_URL,
    tokenManager: {
      storage: 'cookie',
    },
  });
}

export const signupWithRedirect = () => {
  const signupUrl = `${process.env.AUTH_BASE_URL}/account/login?fromURI=https%3A%2F%2Fdocs.mongodb.com`;
  window.location = signupUrl;
};

export const loginWithRedirect = () => {
  const loginUrl = `${process.env.AUTH_BASE_URL}/account/login?fromURI=https%3A%2F%2Fdocs.mongodb.com`;
  window.location = loginUrl;
};

export const logoutWithRedirect = () => {
  const logoutUrl = `${process.env.AUTH_BASE_URL}/account/login?signedOut=true`;
  window.location = logoutUrl;
};

// Handles retrieving an IDP session and initializing an id token to the token manager
// This is the preferred authentication method when a user is logged in and an Okta IDP session is present
// but the login did not originate from a docs property, and no application session is present
const ensureOktaApplicationSession = async () => {
  return authClient.token
    .getWithoutPrompt({
      responseType: 'id_token',
      scopes: ['openid', 'email', 'profile'],
    })
    .then((res) => {
      authClient.tokenManager.setTokens(res?.tokens);
    });
};

// Handles parsing and storage of idTokens when authenticating via redirectUri pattern
// This is the preferred authentication method when handling login origination from docs properties
// If or when access tokens are needed, highly consider adding them
// to the token manager within this function
const authorize = async () => {
  return authClient.token.parseFromUrl().then((data) => {
    const { idToken } = data.tokens;
    authClient.tokenManager.add('idToken', idToken);
    authClient.handleLoginRedirect();
  });
};

const clearApplicationSession = async () => {
  await authClient.tokenManager.remove('idToken');
};

//Checks for an existing IDP session and attempts to retrieve idToken.
//If no idToken is set but an IDP session is present, attempts to ensure
//that we can instantatiate a new token for the application session
const checkOktaSession = async () => {
  return authClient.session.exists().then(async (exists) => {
    if (exists) {
      const idToken = await authClient.tokenManager.get('idToken');
      if (idToken) return idToken;
      await ensureOktaApplicationSession();
      return authClient.tokenManager.get('idToken');
    } else {
      console.log('logged out - clear tokens after this message');
      await clearApplicationSession();
      return {};
    }
  });
};

//Entry point to get a user's profile data from a JWT.
export const getUserProfileFromJWT = async () => {
  if (isBrowser && authClient) {
    if (authClient.isLoginRedirect()) {
      return authorize();
    } else {
      return checkOktaSession();
    }
  }
};
