const assert = require('assert');
const { siteMetadata } = require('../../../src/utils/site-metadata');
const { createRenderSnootyTable } = require('./render-snooty-table');

let siteBasePrefix;
const ENV_KEY = siteMetadata.snootyEnv || 'development';

const baseURL =
  ENV_KEY !== 'production' ? 'https://mongodbcom-cdn.staging.corp.mongodb.com' : 'https://www.mongodb.com';

const setSiteBasePrefix = (basePrefix) => (siteBasePrefix = basePrefix);

/**
 Renders a snooty AST node as markdown.
 */
const snootyAstToMd = (node) => {
  return renderAst(node, { parentHeadingLevel: 0 })
    .replaceAll(/ +\n/g, '\n')
    .replaceAll(/\n{3,}/g, '\n\n') // remove extra newlines with just 2
    .trimStart();
};

const renderSnootyTable = createRenderSnootyTable(snootyAstToMd);

const renderAst = (node, state) => {
  const { parentHeadingLevel, listBullet } = state;

  // Base cases (terminal nodes)
  if (node.children === undefined) {
    // value nodes
    switch (node.type) {
      case 'text':
        return typeof node.value === 'string'
          ? node.value.replaceAll(/(\S)\n/g, '$1 ').replaceAll(/\n(\S)/g, ' $1')
          : node.value;
      case 'code':
        return `\`\`\`${node.lang || ''}\n${node.value}\n\`\`\`\n\n`;

      default:
        return '';
    }
  }

  // parent nodes
  switch (node.type) {
    case 'comment':
      // Do not render comments
      return '';

    case 'target_identifier':
      // Just render line break for target_identifier
      return '\n';

    case 'section': {
      const isHeading = node.children[0]?.type === 'heading';
      return `${node.children
        .map((subnode) =>
          renderAst(subnode, {
            ...state,
            parentHeadingLevel: parentHeadingLevel + (isHeading ? 1 : 0),
          })
        )
        .join('')}\n\n`;
    }

    case 'heading':
      return `${'#'.repeat(parentHeadingLevel)} ${node.children
        .map((child) => renderAst(child, { ...state }))
        .join('')}\n\n`;

    case 'paragraph':
      return `${node.children.map((child) => renderAst(child, { ...state })).join('')}\n\n`;

    case 'list': {
      const isOrderedList = node.enumtype === 'arabic';
      return node.children
        .map((listItem, index) =>
          renderAst(listItem, {
            ...state,
            listBullet: isOrderedList ? `${index + 1}. ` : '- ',
          })
        )
        .join('\n');
    }

    case 'listItem':
      return `${node.children
        .map((child) => renderAst(child, { ...state }))
        .join('')
        .split('\n')
        .map((line, i) => (i === 0 ? `${listBullet}${line}` : `${' '.repeat(listBullet?.length ?? 0)}${line}`))
        .join('\n')}\n`;

    // recursive inline cases
    case 'literal':
      return `\`${node.children.map((child) => renderAst(child, { ...state })).join('')}\``;

    case 'directive':
      return renderDirective(node, { ...state });

    case 'emphasis':
      return `*${node.children.map((child) => renderAst(child, { ...state })).join('')}*`;

    case 'strong':
      return `**${node.children.map((child) => renderAst(child, { ...state })).join('')}**`;

    case 'ref_role':
      // For internal refs
      if (Array.isArray(node.fileid) && typeof node.fileid?.at(0) === 'string') {
        // type validated in above if statement
        const slug = node.fileid
          ?.at(0)
          // Add trailing slash if not present
          .replace(/\/?$/, '/')
          // Remove leading slash if present
          .replace(/^\//, '');
        // Fragment is optional. For example, not included for :doc: roles
        const fragment = node.fileid?.at(1) ? '#' + node.fileid?.at(1) : '';
        const sitePath = `${baseURL}/${siteBasePrefix}`;
        const url = `${sitePath}/${slug}${fragment}`;

        return `[${node.children
          .map((subnode) => renderAst(subnode, { ...state }))
          .join('')
          .trim()}](${url})`;
      }
      // For external refs (intersphinx)
      else if (typeof node.url === 'string') {
        return `[${node.children
          .map((subnode) => renderAst(subnode, { ...state }))
          .join('')
          .trim()}](${node.url})`;
      } // Something unexpected occured. Do not process ref link.
      return node.children.map((subnode) => renderAst(subnode, { ...state })).join('');

    // non-ref links
    case 'reference':
      if (typeof node.refuri === 'string') {
        return `[${node.children
          .map((subnode) => renderAst(subnode, { ...state }))
          .join('')
          .trim()}](${node.refuri})`;
      }
      return node.children.map((subnode) => renderAst(subnode, { ...state })).join('');

    default:
      return node.children.map((subnode) => renderAst(subnode, { ...state })).join('');
  }
};

/**
  Helper function to handle directives. Directives are special nodes that
  contain a variety of different content types.
 */
const renderDirective = (node, state) => {
  assert(node.children, 'This function should only be called if node has children');

  switch (node.name) {
    case 'list-table':
      return renderSnootyTable(node);
    case 'tab': {
      const tabName = (
        node.argument && Array.isArray(node.argument) && node.argument.length
          ? node.argument.find((arg) => arg.type === 'text')?.value ?? ''
          : ''
      ).trim();
      return `\n\n<Tab ${`name="${tabName ?? ''}"`}>\n\n${node.children
        .map((child) => renderAst(child, { ...state }))
        .join('')}\n\n</Tab>\n\n`;
    }
    case 'tabs':
    case 'tabs-drivers':
      return `\n\n<Tabs>\n\n${node.children.map((child) => renderAst(child, { ...state })).join('')}\n\n</Tabs>\n\n`;
    default:
      return node.children.map((subnode) => renderAst(subnode, { ...state })).join('');
  }
};

module.exports = {
  renderAst,
  snootyAstToMd,
  setSiteBasePrefix,
};
