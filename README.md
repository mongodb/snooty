# Monorepo for MongoDB Frontend

This repo is designed to contain the front end components and frameworks required for MongoDB Documentation sites.

This monorepo uses `yarn` to manage multiple packages within the site. Install the package manger with `npm install -g yarn@latest`.

## Installation
See each package's README for preqrequisites
Example, frameworks/gatsby/README.md

Installation happens at the root level, with `yarn install`.
Each package should have its own dependencies declared explicitly, and the monorepo package manager will dedpulicate dependencies.

## Package Management
Use yarn to add and remove dependencies from sub packages. This will automatically be installed as you add/remove. Example:
```
yarn workspace @snooty/gatsby add @leafygreen-ui/tokens
```
To add a dev dependency:
```
yarn workspace @snooty/nextjs add -D @types/adm-zip
```

> **_NOTE:_**  The workspace must be properly named in each corresponding package.json `"name": "@snooty/nextjs",` as well as being defined as a workspace in the root package.json `"workspaces": [ "frameworks/*", "packages/*"],`


## Build steps

Make sure the shared UI library is built before running your framework
`yarn workspace @snooty/ui build`

### Build the Gatsby app
See README under Gatsby framework directory for requirements.
`yarn workspace @snooty/gatsby build`

### Build the NextJS app
See README under Gatsby framework directory for requirements.
`yarn workspace @snooty/gatsby build`
