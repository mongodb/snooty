/**
 * Mints a short-lived CodeArtifact authorization token for the @mdb npm scope and
 * writes it into the project .npmrc.
 *
 * Netlify's build order is:
 *   1. Detect `command` from netlify.toml (does NOT run it yet)
 *   2. Install dependencies  <- runs `npm install` automatically, before build.sh
 *   3. Run `command` (build.sh), which does not itself run `npm install`
 *
 * That means auth needs to be in place before step 2, and putting it only in
 * build.sh (step 3) is too late. This script runs as `preinstall`, so it executes
 * at the start of Netlify's automatic `npm install`.
 *
 * A preinstall script is a subprocess of the npm install it's part of, so it can't
 * hand an env var back to the parent npm process. Instead it writes the resolved
 * token directly into .npmrc (via `npm config set --location=project`), which is
 * what the @mdb registry line in .npmrc is read from for the rest of that install.
 *
 * No-op when NPM_AWS_KEY isn't set (e.g. local development, where developers already
 * run `aws sso login` and export NPM_AWS_AUTH themselves - see README).
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DOMAIN = 'mongodb';
const DOMAIN_OWNER = '271346171620';
const REGION = 'us-east-1';
const REGISTRY_AUTH_KEY = `//${DOMAIN}-${DOMAIN_OWNER}.d.codeartifact.${REGION}.amazonaws.com/npm/npm-local/:_authToken`;

const getAuthorizationToken = (authDir) => {
  // Netlify's build image doesn't have the AWS CLI, so install a throwaway copy of
  // just the SDK client we need rather than adding it as a real project dependency.
  execFileSync(
    'npm',
    ['install', '--prefix', authDir, '--silent', '--no-audit', '--no-fund', '@aws-sdk/client-codeartifact@3'],
    { stdio: ['ignore', 'ignore', 'inherit'] }
  );

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { CodeartifactClient, GetAuthorizationTokenCommand } = require(path.join(
    authDir,
    'node_modules',
    '@aws-sdk',
    'client-codeartifact'
  ));

  const client = new CodeartifactClient({ region: REGION });
  return client
    .send(new GetAuthorizationTokenCommand({ domain: DOMAIN, domainOwner: DOMAIN_OWNER }))
    .then((res) => res.authorizationToken);
};

const main = async () => {
  const { NPM_AWS_KEY, NPM_AWS_SECRET } = process.env;

  if (!NPM_AWS_KEY) {
    return;
  }

  process.env.AWS_ACCESS_KEY_ID = NPM_AWS_KEY;
  process.env.AWS_SECRET_ACCESS_KEY = NPM_AWS_SECRET || '';
  process.env.AWS_DEFAULT_REGION = REGION;

  const authDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codeartifact-auth-'));
  let token;
  try {
    token = await getAuthorizationToken(authDir);
  } finally {
    fs.rmSync(authDir, { recursive: true, force: true });
  }

  if (!token) {
    throw new Error('CodeArtifact returned an empty authorization token');
  }

  process.env.NPM_AWS_AUTH = token;
  execFileSync('npm', ['config', 'set', REGISTRY_AUTH_KEY, token, '--location=project'], {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
};

main().catch((err) => {
  console.error('[netlify-codeartifact-auth] failed to mint CodeArtifact token:', err.message || err);
  process.exit(1);
});
