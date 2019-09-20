# Local Preview

Snooty can support locally rendering a single page without the use of `Gatsby.js`. 
This utilizes `webpack` directly. Preview mode relies on the following files:

* `webpack.config.js` - Webpack configuration files.
* `preview-start.js` - Entry point for preview mode.
* `index.html` - HTML template file to be used by `preview-start.js`.
* `preview-setup.js` - Contains setup functions similar to those found in `gatsby-node.js`

The following files are additional files that serve as workarounds for `gatsby`:

* `noop.js`
* `preview/get-include-file.js`

## Usage

To use local preview, `.env.development` must be set up with the intended information that 
would be used when using `gatsby develop`.

**On your command line:**
```
npm run preview -- --env.PREVIEW_PAGE="<page-name-here>"
```

**Example to get to the landing page:**
```
npm run preview -- --env.PREVIEW_PAGE="index"
```

**Example to get to https://docs.mongodb.com/guides/server/drivers/ :**
```
npm run preview -- --env.PREVIEW_PAGE="server/drivers"
```