# Component Factory Transformer

This directory contains the custom SWC plugin that performs the component factory filtering process. This plugin uses a list of directive values to determine which components to keep within the `src/components/ComponentFactory.js` file.

## Structure

The entry point for the plugin exists in the `component-factory-transformer/src/lib.rs` directory. When the plugin is called-specifically in the `plugins/gatsby-source-snooty-prod/gatsby-node.js` file- the `process_transform` function is called from `lib.rs`. This then parses the configuration, which contains a list of directives derived from the `gatsby-node.js` file.

The `process_transform` function first runs the `GetComponentNamesTransform` which exists in the `get_components.rs` file. This retrieves the exact import names for each component from the `componentMap` or `roleMap`. This is because the directive name does not directly match the import statement that we want to remove. For example, the directive `blockquote` does not match the import variable name, nor the file name of that component e.g. the statement `import BlockQuote from './BlockQuote';` has a default import `BlockQuote` and a file name `./BlockQuote`. Since these are in pascal case, `BlockQuote !== blockquote` Also, some directive names have dashes or colons e.g. `landing:client-libraries`.

After we perform the `GetComponentNamesTransform` we then run the `RemoveDirectivesTransform` to filter the `ComponentFactory.js` file. This uses the component names retrieved from the `GetComponentNamesTransform` to perform the filtering process.
