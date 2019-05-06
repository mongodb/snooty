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
NAMESPACE=<DB>/<COLLECTION> 
GATSBY_STITCH_ID=<STITCH_ID> 
GATSBY_SITE=<SITE>
GATSBY_USER=<USER>
GATSBY_BRANCH=<BRANCH>
```

##### Path prefixing
When setting up a staging environment, you may wish to include a descriptive path prefix (e.g. `ops-manager-update`). To do so, set the `GATSBY_PREFIX` variable in your production .env file *with a preceding slash*:
```
GATSBY_PREFIX=/<descriptive-slug>
```

If `GATSBY_PREFIX` is not set, a prefix will automatically be generated in the form of `/SITE/USER/BRANCH`.

#### `.env.development`
Snooty's `develop` stage uses the `development` environment. Your `.env.development` file should be as follows:
```
NAMESPACE=<DB>/<COLLECTION> 
GATSBY_STITCH_ID=<STITCH_ID> 
GATSBY_SITE=<SITE>
GATSBY_USER=<USER>
GATSBY_BRANCH=<BRANCH>
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

### Unit tests
Unit tests are located in the `tests/unit/` directory. To run only unit tests, use:

```shell
npm run test:unit
```

### Running individual suites
Jest includes configurations for running individual test suites:

```shell
npm test -- my-test   # or
npm test -- path/to/my-test.js
```

For more information, see the [Jest CLI Options](https://jestjs.io/docs/en/cli) documentation, or run `npm test -- --help`.
