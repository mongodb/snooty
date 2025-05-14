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

## Build steps

Make sure the shared UI library is built before running your framework
`yarn workspace @snooty/ui build`