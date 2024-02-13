import React, { useState } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';
import { getNestedValue } from '../utils/get-nested-value';
import { getPlaintext } from '../utils/get-plaintext';
import { getTemplate } from '../utils/get-template';
import Layout from '../layouts/preview-layout';
import { usePresentationMode } from '../hooks/use-presentation-mode';
import Widgets from './Widgets';
import SEO from './SEO';
import FootnoteContext from './Footnote/footnote-context';
import ComponentFactory from './ComponentFactory';
import { InstruqtProvider } from './Instruqt/instruqt-context';

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
  const metadata = data.page.metadata.metadata;
  const template = page?.options?.template;
  // Adds page to pageContext to mimic current behavior of passing entire page AST down
  // pageContext for templates
  props.pageContext.page = page;
  const initialization = () => {
    const pageNodes = getNestedValue(['children'], page) || [];
    const footnotes = getFootnotes(pageNodes);

    return { pageNodes, footnotes };
  };

  const [{ pageNodes, footnotes }] = useState(initialization);

  const lookup = slug === '/' ? 'index' : slug;
  const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata)) || 'MongoDB Documentation';
  const siteTitle = getNestedValue(['title'], metadata) || '';
  const { Template, useChatbot } = getTemplate(template);

  const isInPresentationMode = usePresentationMode()?.toLocaleLowerCase() === 'true';

  return (
    <Layout
      pageContext={{
        // Pass down data missing from the preview plugin, but are present in the
        // prod plugin for consistency
        template,
        page: data?.page?.ast,
        ...props.pageContext,
      }}
      metadata={metadata}
    >
      <SEO pageTitle={pageTitle} siteTitle={siteTitle} />
      <InstruqtProvider hasLabDrawer={page?.options?.instruqt}>
        <Widgets
          location={location}
          pageOptions={page?.options}
          pageTitle={pageTitle}
          slug={slug}
          template={template}
          isInPresentationMode={isInPresentationMode}
        >
          <FootnoteContext.Provider value={{ footnotes }}>
            <Template {...props} useChatbot={useChatbot}>
              {pageNodes.map((child, index) => (
                <ComponentFactory key={index} metadata={metadata} nodeData={child} page={page} slug={slug} />
              ))}
            </Template>
          </FootnoteContext.Provider>
        </Widgets>
      </InstruqtProvider>
      <footer style={{ width: '100%', height: '568px', backgroundColor: '#061621' }}></footer>
    </Layout>
  );
};

DocumentBody.propTypes = {
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    page: PropTypes.shape({
      children: PropTypes.array,
    }).isRequired,
    slug: PropTypes.string.isRequired,
  }),
};

export default DocumentBody;

export const query = graphql`
  query ($id: String) {
    page(id: { eq: $id }) {
      ast
      metadata {
        metadata
      }
    }
  }
`;
