import React, { useState } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { usePresentationMode } from '../hooks/use-presentation-mode';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';
import { getNestedValue } from '../utils/get-nested-value';
import { getMetaFromDirective } from '../utils/get-meta-from-directive';
import { getPlaintext } from '../utils/get-plaintext';
import { getTemplate } from '../utils/get-template';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import Layout from '../layouts';
import Widgets from './Widgets';
import SEO from './SEO';
import FootnoteContext from './Footnote/footnote-context';
import ComponentFactory from './ComponentFactory';
import Meta from './Meta';
import Twitter from './Twitter';
import DocsLandingSD from './StructuredData/DocsLandingSD';
import BreadcrumbSchema from './StructuredData/BreadcrumbSchema';

// Identify the footnotes on a page and all footnote_reference nodes that refer to them.
// Returns a map wherein each key is the footnote name, and each value is an object containing:
// - labels: the numerical label for the footnote
// - references: a list of the footnote reference ids that refer to this footnote
const getFootnotes = (nodes) => {
  const footnotes = findAllKeyValuePairs(nodes, 'type', 'footnote');
  const footnoteReferences = findAllKeyValuePairs(nodes, 'type', 'footnote_reference');
  const numAnonRefs = footnoteReferences.filter(
    (node) => !Object.prototype.hasOwnProperty.call(node, 'refname')
  ).length;
  // We label our footnotes by their index, regardless of their names to
  // circumvent cases such as [[1], [#], [2], ...]
  return footnotes.reduce((map, footnote, index) => {
    if (footnote.name) {
      // Find references associated with a named footnote
      // eslint-disable-next-line no-param-reassign
      map[footnote.name] = {
        label: index + 1,
        references: getNamedFootnoteReferences(footnoteReferences, footnote.name),
      };
    } else {
      // Find references associated with an anonymous footnote
      // Replace potentially broken anonymous footnote ids
      footnote.id = `${index + 1}`;
      // eslint-disable-next-line no-param-reassign
      map[footnote.id] = {
        label: index + 1,
        references: getAnonymousFootnoteReferences(index, numAnonRefs),
      };
    }
    return map;
  }, {});
};

// Find all footnote_reference node IDs associated with a given footnote by
// that footnote's refname
const getNamedFootnoteReferences = (footnoteReferences, refname) => {
  return footnoteReferences.filter((node) => node.refname === refname).map((node) => node.id);
};

// They are used infrequently, but here we match an anonymous footnote to its reference.
// The nth footnote on a page is associated with the nth reference on the page. Since
// anon footnotes and footnote references are anonymous, we assume a 1:1 pairing, and
// have no need to query nodes. If there are more anonymous footnotes than references,
// we may return an empty array
const getAnonymousFootnoteReferences = (index, numAnonRefs) => {
  return index > numAnonRefs ? [] : [`id${index + 1}`];
};

const DocumentBody = (props) => {
  const {
    location,
    pageContext: { slug },
    data,
  } = props;
  const page = data.page.ast;
  const template = page?.options?.template;
  props.pageContext.page = page;

  const initialization = () => {
    const pageNodes = getNestedValue(['children'], page) || [];
    const footnotes = getFootnotes(pageNodes);

    return { pageNodes, footnotes };
  };

  const [{ pageNodes, footnotes }] = useState(initialization);

  const metadata = useSnootyMetadata();

  const lookup = slug === '/' ? 'index' : slug;
  const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata)) || 'MongoDB Documentation';

  const { Template } = getTemplate(template);

  const isInPresentationMode = usePresentationMode()?.toLocaleLowerCase() === 'true';

  return (
    <Layout
      pageContext={{
        page,
        slug,
        template,
        publishedBranches: getNestedValue(['publishedBranches'], metadata),
        ...props.pageContext,
      }}
    >
      <Widgets
        location={location}
        pageOptions={page?.options}
        pageTitle={pageTitle}
        publishedBranches={getNestedValue(['publishedBranches'], metadata)}
        slug={slug}
        isInPresentationMode={isInPresentationMode}
      >
        <FootnoteContext.Provider value={{ footnotes }}>
          <Template {...props}>
            {pageNodes.map((child, index) => (
              <ComponentFactory key={index} metadata={metadata} nodeData={child} page={page} slug={slug} />
            ))}
          </Template>
        </FootnoteContext.Provider>
      </Widgets>
      {!isInPresentationMode && (
        <div data-testid="consistent-footer">
          <UnifiedFooter hideLocale={true} />
        </div>
      )}
    </Layout>
  );
};

DocumentBody.propTypes = {
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }),
};

export default DocumentBody;

export const query = graphql`
  query ($id: String) {
    page(id: { eq: $id }) {
      ast
    }
  }
`;

export const Head = ({ pageContext }) => {
  const { slug, page, template } = pageContext;
  const pageNodes = getNestedValue(['children'], page) || [];

  const meta = getMetaFromDirective('section', pageNodes, 'meta');
  const twitter = getMetaFromDirective('section', pageNodes, 'twitter');

  const metadata = useSnootyMetadata();

  const lookup = slug === '/' ? 'index' : slug;
  const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata)) || 'MongoDB Documentation';
  const siteTitle = getNestedValue(['title'], metadata) || '';

  const isDocsLandingHomepage = metadata.project === 'landing' && template === 'landing';
  const needsBreadcrumbs = template === 'document' || template === undefined;

  return (
    <>
      <SEO pageTitle={pageTitle} siteTitle={siteTitle} showDocsLandingTitle={isDocsLandingHomepage} />
      {meta.length > 0 && meta.map((c, i) => <Meta key={`meta-${i}`} nodeData={c} />)}
      {twitter.length > 0 && twitter.map((c) => <Twitter {...c} />)}
      {isDocsLandingHomepage && <DocsLandingSD />}
      {needsBreadcrumbs && <BreadcrumbSchema slug={slug} />}
    </>
  );
};
