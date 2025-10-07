import { snootyAstToMd, setSiteBasePrefix } from '../../src/utils/snooty-ast-to-md/snooty-ast-to-md';

import mockSamplePage from './data/sample-page.json';
import mockSamplePageWithCodeExamples from './data/sample-page-with-code-examples.json';
import mockSamplePageWithCommentAst from './data/sample-page-with-comment-ast.json';
import mockSamplePageWithTabs from './data/sample-page-with-tabs.json';
import mockSamplePageWithTabsDrivers from './data/sample-page-with-tabs-drivers.json';
import mockSamePlageWithOrderedLists from './data/sample-page-with-ordered-lists.json';
import mockSamplePageWithExternalLinks from './data/sample-page-with-external-links.json';
import mockSamplePageWithInternalLinks from './data/sample-page-with-internal-links.json';
import mockSamplePageWithInternalLinksNoFragment from './data/sample-page-with-internal-links-no-fragment.json';
import mockSamplePageWithIntersphinx from './data/sample-page-with-inter-sphinx.json';

describe('snootyAstToMd', () => {
  // We have to set the site base prefix, similarly to what we do in gatsby-node.js
  const siteBasePrefix = 'docs/example-project';
  setSiteBasePrefix(siteBasePrefix);
  // Matches what should be set inside snooty-ast-to-md for non-production
  const baseUrl = 'https://mongodbcom-cdn.staging.corp.mongodb.com';
  const sitePath = `${baseUrl}/${siteBasePrefix}`;

  it("doesn't render targets", () => {
    const ast = {
      type: 'root',
      position: { start: { line: 0 } },
      children: [
        {
          type: 'target',
          position: { start: { line: 0 } },
          children: [
            {
              type: 'target_identifier',
              position: { start: { line: 0 } },
              children: [
                {
                  type: 'text',
                  position: { start: { line: 4 } },
                  value: 'FAQ',
                },
              ],
              ids: ['java-faq'],
            },
          ],
          domain: 'std',
          name: 'label',
          html_id: 'std-label-java-faq',
        },
        {
          type: 'section',
          position: { start: { line: 4 } },
          children: [
            {
              type: 'heading',
              position: { start: { line: 4 } },
              children: [
                {
                  type: 'text',
                  position: { start: { line: 4 } },
                  value: 'FAQ',
                },
              ],
              id: 'faq',
            },
          ],
        },
      ],
    };
    const result = snootyAstToMd(ast);
    expect(result.split('\n')[0]).toBe('# FAQ');
  });

  it('renders definition lists', () => {
    const result = snootyAstToMd(mockSamplePage.data.ast);
    expect(result.startsWith('# $merge (aggregation)')).toBe(true);
    const expectedToInclude = `Writes the results of the [aggregation pipeline](https://mongodbcom-cdn.staging.corp.mongodb.com/${siteBasePrefix}/core/aggregation-pipeline/) to a specified collection. The [\`$merge\`](https://mongodbcom-cdn.staging.corp.mongodb.com/${siteBasePrefix}/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge) operator must be the **last** stage in the pipeline.`;
    expect(result).toContain(expectedToInclude);
  });

  describe('Renders code blocks', () => {
    it('Renders code examples with language', () => {
      const result = snootyAstToMd(mockSamplePageWithCodeExamples.data.ast);
      expect(result).toContain('```json\n');
    });
    it('Renders code examples without language', () => {
      const result = snootyAstToMd(mockSamplePageWithCodeExamples.data.ast);
      expect(result).toContain('```\n');
      expect(result).not.toContain('```docs/example-project\n');
    });
  });

  it('strips comments', () => {
    const result = snootyAstToMd(mockSamplePageWithCommentAst);
    const expected = `# Data Model Examples and Patterns

For additional patterns and use cases, see also: [Building with Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)

The following documents provide overviews of various data modeling patterns and common schema design considerations:

Examples for modeling relationships between documents.

Presents a data model that uses [embedded documents](https://mongodbcom-cdn.staging.corp.mongodb.com/${siteBasePrefix}/core/data-model-design/#std-label-data-modeling-embedding) to describe one-to-one relationships between connected data.

Presents a data model that uses [embedded documents](https://mongodbcom-cdn.staging.corp.mongodb.com/${siteBasePrefix}/core/data-model-design/#std-label-data-modeling-embedding) to describe one-to-many relationships between connected data.

Presents a data model that uses [references](https://mongodbcom-cdn.staging.corp.mongodb.com/${siteBasePrefix}/core/data-model-design/#std-label-data-modeling-referencing) to describe one-to-many relationships between documents.

Examples for modeling tree structures.

Presents a data model that organizes documents in a tree-like structure by storing [references](https://mongodbcom-cdn.staging.corp.mongodb.com/${siteBasePrefix}/core/data-model-design/#std-label-data-modeling-referencing) to "parent" nodes in "child" nodes.

Presents a data model that organizes documents in a tree-like structure by storing [references](https://mongodbcom-cdn.staging.corp.mongodb.com/${siteBasePrefix}/core/data-model-design/#std-label-data-modeling-referencing) to "child" nodes in "parent" nodes.

See [Model Tree Structures](https://mongodbcom-cdn.staging.corp.mongodb.com/${siteBasePrefix}/applications/data-models-tree-structures/) for additional examples of data models for tree structures.

Examples for models for specific application contexts.

Illustrates how embedding fields related to an atomic update within the same document ensures that the fields are in sync.

Describes one method for supporting keyword search by storing keywords in an array in the same document as the text field. Combined with a multi-key index, this pattern can support application's keyword search operations.

`;
    expect(result).toBe(expected);
  });
  it('renders tab sets', () => {
    const result = snootyAstToMd(mockSamplePageWithTabs.data.ast);
    const expectedToContainTabsStart = '\n\n<Tabs>\n\n';
    const expectedToContainTabsEnd = '\n\n</Tabs>\n\n';
    const expectedToContainTabStart = '\n\n<Tab name="App Services UI">\n\n';
    const expectedToContainTabEnd = '\n\n</Tab>\n\n';
    expect(result).toContain(expectedToContainTabsStart);
    expect(result).toContain(expectedToContainTabsEnd);
    expect(result).toContain(expectedToContainTabStart);
    expect(result).toContain(expectedToContainTabEnd);
    const numberTabsStart = [...result.matchAll(/<Tabs>/g)].length;
    const numberTabsEnd = [...result.matchAll(/<\/Tabs>/g)].length;
    expect(numberTabsStart).toBe(numberTabsEnd);
    const numberTabStart = [...result.matchAll(/<Tab name=/g)].length;
    const numberTabEnd = [...result.matchAll(/<\/Tab>/g)].length;
    expect(numberTabStart).toBe(numberTabEnd);
  });

  it('renders driver tab sets', () => {
    const result = snootyAstToMd(mockSamplePageWithTabsDrivers.data.ast);
    const expectedToContainTabsStart = '\n\n<Tabs>\n\n';
    const expectedToContainTabsEnd = '\n\n</Tabs>\n\n';
    const expectedToContainTabStart = '\n\n<Tab name="Java (Sync)">\n\n';
    const expectedToContainTabEnd = '\n\n</Tab>\n\n';
    expect(result).toContain(expectedToContainTabsStart);
    expect(result).toContain(expectedToContainTabsEnd);
    expect(result).toContain(expectedToContainTabStart);
    expect(result).toContain(expectedToContainTabEnd);
    const numberTabsStart = [...result.matchAll(/<Tabs>/g)].length;
    const numberTabsEnd = [...result.matchAll(/<\/Tabs>/g)].length;
    expect(numberTabsStart).toBe(numberTabsEnd);
    const numberTabStart = [...result.matchAll(/<Tab name=/g)].length;
    const numberTabEnd = [...result.matchAll(/<\/Tab>/g)].length;
    expect(numberTabStart).toBe(numberTabEnd);
  });

  it('renders tab sets', () => {
    const result = snootyAstToMd(mockSamePlageWithOrderedLists.data.ast);
    expect(result).toBe(`# Connect to App Services - C++ SDK Preview

The App client is the Atlas App Services backend interface. It provides access to authentication and Atlas Functions.

Some of your App Services App's features are associated with user accounts. For example, you need to [authenticate a user](https://mongodbcom-cdn.staging.corp.mongodb.com/${siteBasePrefix}/sdk/cpp/users/manage-email-password-users/#std-label-cpp-authenticate-user) before you can access your App's functions.

## Prerequisites

1. [Create an App Services app](https://www.mongodb.com/docs/atlas/app-services/apps/create/#std-label-create-a-realm-app)

## Access the App Client

1. [Find the App ID in the Realm UI](https://www.mongodb.com/docs/atlas/app-services/apps/metadata/#std-label-find-your-app-id).

2. Create an [App object](https://www.mongodb.com/docs/realm-sdks/cpp/latest/classrealm_1_1App.html) with your App's ID as the argument. You use this \`App\` instance to access App Services features throughout your client application.

`);
  });

  describe('renders links', () => {
    const hasMarkdownLink = /\[.*?\]\(.*?\)/;

    it('renders external links if configured', () => {
      const mdPage = snootyAstToMd(mockSamplePageWithExternalLinks.data.ast);
      const refuri = 'https://www.mongodb.com/docs/drivers/';
      expect(mdPage).toContain(`(${refuri})`);
      expect(mdPage).toMatch(hasMarkdownLink);
    });
    it('renders internal links if configured', () => {
      const mdPage = snootyAstToMd(mockSamplePageWithInternalLinks.data.ast);
      expect(mdPage).toMatch(hasMarkdownLink);
      const slug = 'reference/operator/aggregation/merge';
      const fragment = 'mongodb-pipeline-pipe.-merge';
      expect(mdPage).toContain(`(${sitePath}/${slug}/#${fragment})`);
    });
    it('renders internal links without fragment (#)', () => {
      const mdPage = snootyAstToMd(mockSamplePageWithInternalLinksNoFragment.data.ast);
      expect(mdPage).toMatch(hasMarkdownLink);
      const slug = 'reference/operator/aggregation/merge';
      expect(mdPage).toContain(`(${sitePath}/${slug}/)`);
    });
    it('renders internal links to another site (intersphinx)', () => {
      const mdPage = snootyAstToMd(mockSamplePageWithIntersphinx.data.ast);
      const url = 'https://www.mongodb.com/docs/master/faq/indexes/#std-label-faq-indexes-random-data-performance';
      expect(mdPage).toMatch(hasMarkdownLink);
      expect(mdPage).toContain(`(${url})`);
    });
  });
});
