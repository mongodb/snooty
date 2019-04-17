# Front-end for Docs

Uses Gatsby to build static site.

## Installation:

```shell
npm install
```

If this is your first time running the site you'll need the static directory:

```shell
make static
```

You'll need to set some ENV variables in two separate files at the root of this directory for separate production/development environments.

`.env.production`
```
NODE_ENV=production
STITCH_ID=<STITCH_ID> 
NAMESPACE=<DB/COLLECTION> 
DOCUMENTS=/<SITE/USER/BRANCH>
GATSBY_PREFIX=/<SITE/USER/BRANCH>
```

`.env.development`
```
NODE_ENV=development
STITCH_ID=<STITCH_ID> 
NAMESPACE=<DB/COLLECTION> 
DOCUMENTS=/<SITE/USER/BRANCH>
GATSBY_PREFIX=''
```

## Running locally:

```shell
gatsby develop --prefix-paths
```

To build and serve the site, run the following commands:

```shell
gatsby build --prefix-paths
gatsby serve --prefix-paths
```

## Using mock test data:

Every time you run the application without the flag below, the data retrieved for the docs site is stored in `tests/data/site/__testDataLatest.json`. There is also a reference data file in `tests/data/site/__testData.json`. You can load either one of these into the Gatsby build with the flag:

```shell
USE_TEST_DATA=__testData.json
```

## Testing
Tests can be run using:

```shell
npm test  # alias for npm run test
```

### Unit Tests
Unit tests are located in the `tests/unit/` directory. To run only unit tests, use:

```shell
npm run test-unit
```

### Running individual suites
Jest includes configurations for running individual test suites:

```shell
npm test -- my-test   # or
npm test -- path/to/my-test.js
```

For more information, see the [Jest CLI Options](https://jestjs.io/docs/en/cli) documentation, or run `npm test -- --help`.
