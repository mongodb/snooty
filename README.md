# MongoDB Documentation Front-End

Uses [Gatsby](https://www.gatsbyjs.org/) to build static site.

## Installation

```shell
npm install
```

If this is your first time running the site you'll need the static directory:

```shell
make static
```

### .env file setup

You'll need to set some environment variables in two separate files at the root of this directory for separate production/development environments.

#### `.env.production`

Snooty's `build` and `serve` stages use the `production` environment. Your `.env.production` file should be as follows:

```
GATSBY_SITE=<SITE>
GATSBY_PARSER_USER=<USER>
GATSBY_PARSER_BRANCH=<BRANCH>
GATSBY_SNOOTY_DEV=true
```

#### `.env.development`

Snooty's `develop` stage uses the `development` environment. Your `.env.development` file should be as follows:

```
GATSBY_SITE=<SITE>
GATSBY_PARSER_USER=<USER>
GATSBY_PARSER_BRANCH=<BRANCH>
GATSBY_SNOOTY_DEV=true
```

The `GATSBY_SNOOTY_DEV` variable is what allows Gatsby to know that when the application is built it should use the snooty branch name as part of the file paths. When not set, the file paths will use the value of `GATSBY_PARSER_BRANCH`.

It should be set to `true` when working on snooty locally.

## Running locally

```shell
npm run develop
```

To build and serve the site, run the following commands:

```shell
$ npm run build
$ npm run serve
```

## Staging

Install [mut](https://github.com/mongodb/mut) and ensure that you have properly configured your Giza/AWS keys. Then, from root, run:

```shell
make stage
```

## Releasing

We have configured an automatic release process using [GitHub Actions](https://github.com/features/actions) that is triggered by [npm-version](https://docs.npmjs.com/cli/version). To release a version, run `npm version [major | minor | patch]`, using [Semantic Versioning](https://semver.org) guidelines to correctly increment the version number. GitHub Actions will create a new git tag and push it to GitHub. To complete the process, update the release notes using the automatically generated [CHANGELOG.md](https://github.com/mongodb/snooty/blob/master/CHANGELOG.md) and publish the release.

## Testing

Tests can be run using:

```shell
npm test  # alias for npm run test
```

Note that this will run unit _and_ regression tests, which have a long runtime. It is more likely that you want to run only unit tests.

### Unit tests

Unit tests are located in the `tests/unit/` directory. To run only unit tests, use:

```shell
npm run test:unit
```

### Regression tests

Regression tests are located in the `tests/regression/` directory. Before running regression tests, start a local Gatsby build server:

```shell
$ npm run build
$ npm run serve
```

To run regression tests:

```shell
npm run test:regression
```

Regression tests have a long runtime, so Jest's [`describe.only`](https://jestjs.io/docs/en/api#describeonlyname-fn) and [`test.only`](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) functions are quite handy to isolate your tests.

### Running individual suites

Jest includes configurations for running individual test suites:

```shell
npm test -- my-test   # or
npm test -- path/to/my-test.js
```

For more information, see the [Jest CLI Options](https://jestjs.io/docs/en/cli) documentation, or run `npm test -- --help`.

## Linting & Style

We use [ESLint](https://eslint.org) and [Prettier](https://prettier.io) to help with linting and style.

### Lint

Our CI (via [GitHub Actions](https://github.com/features/actions)) is configured to test for lint errors. To run this test locally and attempt to automatically fix errors:

```shell
npm run lint:fix
```

These errors must be fixed for the CI build to pass.

### Style

To format code using Prettier, run the following command:

```shell
npm run format:fix
```

We have set up a precommit hook that will format staged files. Prettier also offers a variety of editor integrations to automatically format your code.
