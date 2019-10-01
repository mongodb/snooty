# Snooty Preview

Snooty can support rendering a single page without the use of `Gatsby.js`. 
This utilizes `webpack` directly. Preview mode relies on the following files:

* `webpack.config.js` - Webpack configuration files.
* `preview-start.js` - Entry point for preview mode.
* `index.html` - HTML template file to be used by `preview-start.js`.
* `preview-setup.js` - Contains setup functions similar to those found in `gatsby-node.js`

The following files are additional files that serve as workarounds for `gatsby`:

* `noop.js`
* `preview/get-include-file.js`

## Usage

Note: This assumes that the Snooty Frontend has already been added as a submodule in Snooty VS Code.

Snooty Preview is intended to be used along with the Snooty extension on VS Code.

To run on VS Code:
1. `cmd + shift + p`
2. Run `Snooty Preview`
The Snooty extension generates `page-ast.json` when running Snooty Preview, allowing the file to be used by `preview-setup.js`.

This generates `bundle.js` to be used by Snooty VS Code's webview implementation.