# Installs npm dependencies for the Netlify build, authenticating to CodeArtifact
# for the @mdb scope first when running on Netlify.
#
# Netlify's own automatic "Install dependencies" step runs `npm install` BEFORE our
# `command` (see netlify.toml) ever executes, and it has no hook for injecting auth
# beforehand. We neutralize that step with NPM_FLAGS=--dry-run (see
# netlify.toml [build.environment]) and do the real install here instead, as the
# first part of `command`, so this script's `export`s are visible to the `npm
# install` it runs (both happen in the same shell process).
#
# Not pipefail: Netlify runs `command` with sh/dash, which doesn't support it.
set -eu

if [ -n "${NPM_AWS_KEY:-}" ]; then
  export AWS_ACCESS_KEY_ID="${NPM_AWS_KEY}"
  export AWS_SECRET_ACCESS_KEY="${NPM_AWS_SECRET:-}"
  export AWS_DEFAULT_REGION=us-east-1

  # Netlify's build image has no AWS CLI, so mint the token with a throwaway copy of
  # the SDK client instead of adding it as a real project dependency.
  AUTH_DIR=$(mktemp -d)
  trap 'rm -rf "$AUTH_DIR"' EXIT
  npm install --prefix "$AUTH_DIR" --silent --no-audit --no-fund @aws-sdk/client-codeartifact@3 >/dev/null 2>&1

  NPM_AWS_AUTH="$(NODE_PATH="$AUTH_DIR/node_modules" node -e '
    const { CodeartifactClient, GetAuthorizationTokenCommand } = require("@aws-sdk/client-codeartifact");
    (async () => {
      const client = new CodeartifactClient({ region: "us-east-1" });
      const out = await client.send(new GetAuthorizationTokenCommand({
        domain: "mongodb",
        domainOwner: "271346171620",
      }));
      process.stdout.write(out.authorizationToken || "");
    })().catch((e) => { console.error(e); process.exit(1); });
  ')"
  export NPM_AWS_AUTH

  [ -n "$NPM_AWS_AUTH" ] || { echo "netlify-install: CodeArtifact returned an empty authorization token" >&2; exit 1; }
fi

# NPM_AWS_KEY unset (e.g. local SSO users) falls through here and relies on
# NPM_AWS_AUTH already being exported in the calling shell.
npm install --legacy-peer-deps
