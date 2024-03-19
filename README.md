# MongoDB Documentation Front-End

Uses [Gatsby](https://www.gatsbyjs.org/) to build static site.

## Installation

Snooty uses [artifactory](https://jfrog.com/artifactory/) that [will need authentication](https://github.com/mongodb/snooty/blob/main/.npmrc) to install some private npm packages. Update your local zsh variables in `$~/.zshrc` (in Windows `%USERPROFILE%/.zshrc`) to include the following

```
export NPM_BASE_64_AUTH=<BASE_64_API_KEY>
export NPM_EMAIL=<your.email@gmail.com>
```

Then, to install the package dependencies:

```shell
npm install --legacy-peer-deps
```

### .env file setup

You'll need to set some environment variables in two separate files at the root of this directory for separate production/development environments. These variables let Snooty know where to look for your AST zip files, within DOP team's database. (You can also use [local AST files](#running-with-local-manifest-path).)

#### `.env.development`

Snooty's `develop` stage uses the `development` environment. Your `.env.development` file should be as follows:

```
GATSBY_SITE=<SITE>
GATSBY_PARSER_USER=<USER>
GATSBY_PARSER_BRANCH=<BRANCH>
GATSBY_SNOOTY_DEV=true
```

The `GATSBY_SNOOTY_DEV` variable is what allows Gatsby to know that it should use the snooty branch name as part of the file paths. When not set, the file paths will use the value of `GATSBY_PARSER_BRANCH`. See pathing [here](https://github.com/mongodb/snooty/blob/main/src/utils/generate-path-prefix.js#L22)

It should be set to `true` when working on snooty locally.

#### `.env.production`

Snooty's `build` and `serve` stages use the `production` environment. Your `.env.production` file should be as follows:

```
GATSBY_SITE=<SITE>
GATSBY_PARSER_USER=<USER>
GATSBY_PARSER_BRANCH=<BRANCH>
GATSBY_SNOOTY_DEV=true
```

## Running locally

```shell
npm run develop
```

To build and serve the site, run the following commands:
The serve command generates the site at a [prefix](https://github.com/mongodb/snooty/blob/main/src/utils/generate-path-prefix.js) ie. `localhost:9000/<branch>/<docs-name>/<user>/<branch-name>/`

```shell
$ npm run build
$ npm run serve
```

To debug server side:

```shell
node --nolazy node_modules/.bin/gatsby develop --inspect-brk
```

and connect a node debugger (ie. [chrome developer tools](https://nodejs.org/en/docs/guides/debugging-getting-started/#inspector-clients))

### Running with local manifest path

Alternative to working with remote AST files, you can have a local zip file to build the site. This removes the need for previously mentioned env variables required for remote lookup `GATSBY_SITE` `GATSBY_PARSER_USER` and `GATSBY_PARSER_BRANCH`. Local zip file is an output of the [parser](https://github.com/mongodb/snooty-parser)

`.env.development` and `.env.production`:

```
GATSBY_MANIFEST_PATH=/path/to/zipped/ast/file.zip
GATSBY_SNOOTY_DEV=true
```

### Running with Gatsby Cloud preview

Snooty uses Gatsby Cloud to perform content staging builds for MongoDB documentation. These builds source their ASTs through the [Snooty Data API](https://github.com/mongodb/snooty-data-api) and require additional environment variables for setup. To emulate a Gatsby Cloud preview build locally, include the following in your `.env.development` file:

```
GATSBY_CLOUD_SITE_USER=<YOUR GITHUB USERNAME>
```

Since building with the Gatsby Cloud preview source plugin expects build data to be present in our team's database, please use the Autobuilder to perform one or more builds prior to running the frontend. Otherwise, use a different `GATSBY_CLOUD_SITE_USER`.

When ready, run the following command:

```shell
npm run develop:preview
```

This command will run the `gatsby-source-snooty-preview` source plugin, where all AST data for the specified `GATSBY_CLOUD_SITE_USER` will be used to mimic a Gatsby Cloud site locally. All build data across every unique project + branch combination for that user will be built on the single site. To access the built content, go to `http://localhost:8000/<PROJECT>/<BRANCH>/<PAGE_PATH>`.

Note that this process assumes that the default public Snooty Data API endpoint is being used. If the staging instance of the API is desired, you will need to set the `API_BASE` env to the staging URL, include the expected client credentials as environment variables (found in Parameter Store), and then run the build on the office VPN. Please see the team's Gatsby Cloud template sites as examples.

## Staging

Install libxml2 with `brew install libxml2` on mac and `apt-get install libxml2` on linux

Install [mut](https://github.com/mongodb/mut) and ensure that you have properly configured your Giza/AWS keys as [defined here](https://github.com/mongodb/mut/blob/3df98c17b0c5ea0b6101fe2c0e1b36ebdf97412e/mut/AuthenticationInfo.py#L7). Then, from root, run:

```shell
npm run build:clean:stage
```

:warning: Note: This will promote the contents of your local public directory. Your instance in staging may break or be outdated if you haven't run `npm run build` before `make stage`.

### Staging with Gatsby Cloud preview

If your changes specifically affect Gatsby Cloud preview builds, set up and use your own Gatsby Cloud site (denoted by GitHub username) in our team's organization. The feature branch can be assigned to the Gatsby Cloud site. Multiple feature branches in parallel may require the use of multiple Gatsby Cloud sites. See this [wiki page](https://wiki.corp.mongodb.com/display/DE/How+to+Set+Up+a+New+Gatsby+Cloud+Site) for help with setup.

## Releasing

We have configured an automatic release process using [GitHub Actions](https://github.com/features/actions) that is triggered by [npm-version](https://docs.npmjs.com/cli/version). To release a version, you must have admin privileges in this repo. Then proceed as follows:

1. On the `main` branch, run `git pull` followed by `npm ci`.
2. Run `npm version [major | minor | patch]`, using [Semantic Versioning](https://semver.org) guidelines to correctly increment the version number. Keep the minor version consistent with [snooty-parser versioning](https://github.com/mongodb/snooty-parser/tags). GitHub Actions will create a new git tag and push it to GitHub.
3. Update the release draft found [here](https://github.com/mongodb/snooty/releases) using the automatically generated [CHANGELOG.md](https://github.com/mongodb/snooty/blob/main/CHANGELOG.md) and publish the release. Keep "pre-release" checked until version 1.0.0.

:warning: This process cannot be completed if the releaser's `origin` points to a fork.

### Gatsby Cloud

Gatsby Cloud uses set GitHub branches to build sites. Right now, we have:

1. `gatsby-cloud-latest` - Used by the Gatsby Cloud sites for the docs team. This branch should typically have the latest production release tag used by the Autobuilder.
2. `gatsby-cloud-rc` - Used by Gatsby Cloud sites designated for pre-production. This branch should be used for testing release candidates end-to-end with the Autobuilder in preprd.

When a new frontend release tag is made, use the commands below to update the desired Gatsby Cloud branch.

:warning: Note that the following commands include a force push to make it easy to update and rollback the branch as needed.

```sh
git fetch origin --tags
git checkout tags/<tag>
git push -f origin HEAD:<gatsby-cloud-rc|gatsby-cloud-latest>
```

Once the branch is updated with a given tag, all Gatsby Cloud sites using that branch will be rebuilt. Ideally, `gatsby-cloud-latest` is only updated after the Autobuilder has completed its latest release, to ensure versions of the frontend and parser are compatible.

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

### Updating test snapshots

Snapshots may require updates when making changes to snooty components

```shell
npm test -- -u
```

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

### Component Factory Filter

The component factory filter process uses [SWC](https://swc.rs/) to remove unused components from the `ComponentFactory.js` file. A custom plugin is used to perform this transformation, and it lives in the `component-factory-transformer` directory.

To use the custom plugin, you'll first need to install [Rust](https://www.rust-lang.org/tools/install).

Once Rust is installed, you'll need to build the plugin. Change directory to `component-factory-transformer`, run `cargo install` if you haven't, and then run `npm run prepublishOnly`.

The `USE_FILTER_BRANCH` environment variable needs to be added in the `.env.production` file and set to `true` for this to work.

### Useful Resources

[React](https://reactjs.org/docs/getting-started.html)
[Gatsby](https://www.gatsbyjs.com/docs/)
[Emotion](https://emotion.sh/docs/introduction)
[mongodb/Realm](https://www.mongodb.com/docs/realm-sdks/js/latest/)
[LeafyGreen UI](https://www.mongodb.design/)
