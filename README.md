# MongoDB Documentation Front-End

Uses [Gatsby](https://www.gatsbyjs.org/) to build static site.

## Installation

Snooty uses [artifactory](https://jfrog.com/artifactory/) that [will need authentication](https://github.com/mongodb/snooty/blob/master/.npmrc) to install some private npm packages. Update your local zsh variables in `$~/.zshrc` (in Windows %USERPROFILE%/.zshrc) to include the following

```
export NPM_BASE_64_AUTH=<BASE_64_API_KEY>
export NPM_EMAIL=<your.email@gmail.com>
```

Then, to install the package dependencies:

```shell
npm install --legacy-peer-deps
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

Snooty's `develop` stage uses the `development` environment. These variables let Snooty know where to look for your AST zip files, within DOP team's database. Your `.env.development` file should be as follows:

```
GATSBY_SITE=<SITE>
GATSBY_PARSER_USER=<USER>
GATSBY_PARSER_BRANCH=<BRANCH>
GATSBY_SNOOTY_DEV=true
```

The `GATSBY_SNOOTY_DEV` variable is what allows Gatsby to know that when the application is built it should use the snooty branch name as part of the file paths. When not set, the file paths will use the value of `GATSBY_PARSER_BRANCH`.

It should be set to `true` when working on snooty locally.

#### Testing with local manifest path (local AST zip files)

Alternative to working with remote AST files, you can have a local zip file to build the site. This removes the need for above mentioned variables required for remote lookup `GATSBY_SITE` `GATSBY_PARSER_USER` and `GATSBY_PARSER_BRANCH`

```
GATSBY_MANIFEST_PATH=/path/to/zipped/ast/file.zip
GATSBY_SNOOTY_DEV=true
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

Install libxml2 with `brew install libxml2` on mac and `apt-get install libxml2` on linux 

Install [mut](https://github.com/mongodb/mut) and ensure that you have properly configured your Giza/AWS keys as [defined here](https://github.com/mongodb/mut/blob/3df98c17b0c5ea0b6101fe2c0e1b36ebdf97412e/mut/AuthenticationInfo.py#L7). Then, from root, run:

```shell
npm run build:clean:stage
```

:warning: Note: This will promote the contents of your local public directory. Your instance in staging may break or be outdated if you haven't run `npm run build` before `make stage`.

## Releasing

We have configured an automatic release process using [GitHub Actions](https://github.com/features/actions) that is triggered by [npm-version](https://docs.npmjs.com/cli/version). To release a version, you must have admin privileges in this repo. Then proceed as follows:

1. On the `master` branch, run `git pull` followed by `npm ci`.
2. Run `npm version [major | minor | patch]`, using [Semantic Versioning](https://semver.org) guidelines to correctly increment the version number. Keep the minor version consistent with [snooty-parser versioning](https://github.com/mongodb/snooty-parser/tags). GitHub Actions will create a new git tag and push it to GitHub.
3. Update the release draft found [here](https://github.com/mongodb/snooty/releases) using the automatically generated [CHANGELOG.md](https://github.com/mongodb/snooty/blob/master/CHANGELOG.md) and publish the release. Keep "pre-release" checked until version 1.0.0.

:warning: This process cannot be completed if the releaser's `origin` points to a fork.

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

### Useful Resources

[React](https://reactjs.org/docs/getting-started.html)
[Gatsby](https://www.gatsbyjs.com/docs/)
[Emotion](https://emotion.sh/docs/introduction)
[mongodb/stitch](http://stitch-sdks.s3-website-us-east-1.amazonaws.com/stitch-sdks/js/4/index.html)
[LeafyGreen UI](https://www.mongodb.design/)