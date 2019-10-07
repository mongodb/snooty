# Snooty Preview

Snooty can support rendering a single page without the use of `Gatsby.js` by utilizing `webpack` directly. Preview mode relies on the following files:

* `webpack.config.js` - Webpack configuration files.
* `preview-start.js` - Entry point for preview mode.
* `index.html` - HTML template file to be used by `preview-start.js`.
* `preview-setup.js` - Contains setup functions similar to those found in `gatsby-node.js`

The following files are additional files that serve as workarounds for `gatsby`:

* `noop.js`
* `preview/get-include-file.js`

## Usage

Note: This assumes that the Snooty Frontend has already been added as a submodule in [Snooty VS Code](https://github.com/mongodb/snooty-vscode).

Snooty Preview is intended to be used along with the Snooty extension on VS Code.

To run on VS Code:
1. Go to a `.txt` file that corresponds to its own page.
2. `cmd + shift + p` to open up a list of possible commands.
3. Run `Snooty Preview` to open a webview panel to preview the page for the current `.txt` file.

## Key Processes

`Snooty Preview` can be broken down into three key processes:
1. Obtaining the page AST.
The current page's AST is obtained from the [Snooty Parser's](https://github.com/mongodb/snooty-parser) RPC method [`textDocument/get_page_ast`](https://github.com/mongodb/snooty-parser/blob/DOCSP-6544/RPC-methods.md#textdocumentget_page_ast). The page AST is saved as `page-ast.json` within the Snooty frontend submodule's `preview` directory.
2. Generating `bundle.js`.
The Snooty extension runs a task to initiate webpack within the Snooty frontend submodule. This creates a bundle file that is stored within the submodule's `preview` directory.
3. Starting the webview panel.
The Snooty extension handles previewing the single page by starting a webview panel within VS Code. The `bundle.js` is used as a script within the webview's html.
