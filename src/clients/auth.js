import { OktaAuth } from '@okta/okta-auth-js';

const authClient = new OktaAuth({
  url: process.env.AUTH_BASE_URL,
  clientId: process.env.AUTH_CLIENT_ID,
  redirectUri: process.env.REDIRECT_URI,
});

export const loginWithRedirect = () => {
  const loginUrl = `${process.env.AUTH_BASE_URL}/account/login?fromURI=https%3A%2F%2Fdocs.mongodb.com`;
  window.location = loginUrl;
};

export const logoutWithRedirect = () => {
  const logoutUrl = `${process.env.AUTH_BASE_URL}/account/login?signedOut=true`;
  window.location = logoutUrl;
};

//
export const getUserProfileFromJWT = async () => {
  if (authClient.isLoginRedirect()) {
    return authClient.token.parseFromUrl().then((data) => {
      const { idToken } = data.tokens;
      authClient.tokenManager.add('idToken', idToken);
      authClient.handleLoginRedirect();
    });
  } else {
    return authClient.tokenManager.get('idToken').then((idToken) => idToken);
  }
};
