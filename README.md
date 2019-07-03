# MongoDB Docs Front-End

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
PARSER_USER=<USER>
PARSER_BRANCH=<BRANCH>
```

#### `.env.development`
Snooty's `develop` stage uses the `development` environment. Your `.env.development` file should be as follows:
```
GATSBY_SITE=<SITE>
PARSER_USER=<USER>
PARSER_BRANCH=<BRANCH>
```

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
Ensure that you have properly configured your Giza/AWS keys. Then, from root, run:

```shell
make stage
```

## Using mock test data

Every time you run the application without the flag below, the data retrieved for the docs site is stored in `tests/unit/data/site/__testDataLatest.json`. There is also a reference data file in `tests/unit/data/site/__testData.json`. You can load either one of these into the Gatsby build with the flag:

```shell
USE_TEST_DATA=__testData.json
```

## Testing
Tests can be run using:

```shell
npm test  # alias for npm run test
```
Note that this will run unit *and* regression tests, which have a long runtime. It is more likely that you want to run only unit tests.

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
Our Drone project is configured to test for lint errors. To run this test locally:

```shell
npm run lint
```

These errors must be fixed for the Drone build to pass.

### Style
To format code using Prettier, run the following command:

```shell
npm run lintfix
```

We have set up a precommit hook that will format staged files. Prettier also offers a variety of editor integrations to automatically format your code.
