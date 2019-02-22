# Front-end for Docs

Uses Gatsby to build static site.

## Installation:

```
npm install
```

If this is your first time running the site you'll need the static directory:

```
make static
```

## Running locally:

```
STITCH_ID=<STITCH_ID> NAMESPACE=<DB/COLLECTION> PREFIX=<SITE/USER/BRANCH> gatsby develop
then go to http://localhost:8000
```

To build and serve the site, use the same ENV vars from above:

```
<ENV_VARS> gatsby build --prefix-paths
gatsby serve
```

## Using mock test data:

Every time you run the application without the flag below, the data retrieved for the docs site is stored in `tests/__testDataLatest.json`. There is also a reference data file in `tests/__testData.json`. You can load either one of these into the Gatsby build with the flag:

```
USE_TEST_DATA=__testData.json
```