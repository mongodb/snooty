import React, { useState, lazy } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Global, css } from '@emotion/react';
import { ImageContextProvider } from '../context/image-context';
import { usePresentationMode } from '../hooks/use-presentation-mode';
import { useCanonicalUrl } from '../hooks/use-canonical-url';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';
import { getNestedValue } from '../utils/get-nested-value';
import { getMetaFromDirective } from '../utils/get-meta-from-directive';
import { getPlaintext } from '../utils/get-plaintext';
import { getTemplate } from '../utils/get-template';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { getCurrentLocaleFontFamilyValue } from '../utils/locale';
import { getSiteTitle } from '../utils/get-site-title';
import { PageContext } from '../context/page-context';
import { useBreadcrumbs } from '../hooks/use-breadcrumbs';
import { isBrowser } from '../utils/is-browser';
import Widgets from './Widgets';
import SEO from './SEO';
import FootnoteContext from './Footnote/footnote-context';
import ComponentFactory from './ComponentFactory';
import Meta from './Meta';
import Twitter from './Twitter';
import DocsLandingSD from './StructuredData/DocsLandingSD';
import BreadcrumbSchema from './StructuredData/BreadcrumbSchema';
import { InstruqtProvider } from './Instruqt/instruqt-context';
import { SuspenseHelper } from './SuspenseHelper';
import { TabProvider } from './Tabs/tab-context';

// lazy load the unified footer to improve page load speed
const LazyFooter = lazy(() => import('./Footer'));

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

const fontFamily = getCurrentLocaleFontFamilyValue();

const DocumentBody = (props) => {
  const { location, data, pageContext } = props;
  const page = data?.page?.ast;
  const { slug, template, repoBranches } = pageContext;

  const initialization = () => {
    const pageNodes = getNestedValue(['children'], page) || [];
    const footnotes = getFootnotes(pageNodes);

    return { pageNodes, footnotes };
  };

  const [{ pageNodes, footnotes }] = useState(initialization);

  const metadata = useSnootyMetadata();

  const lookup = slug === '/' ? 'index' : slug;
  const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata)) || 'MongoDB Documentation';

  const { Template, useChatbot } = getTemplate(template);

  const siteTitle = getSiteTitle(metadata);

  const isInPresentationMode = usePresentationMode()?.toLocaleLowerCase() === 'true';

  const { parentPaths, branch } = useSnootyMetadata();
  const queriedCrumbs = useBreadcrumbs();

  const siteBasePrefix = repoBranches.siteBasePrefix;

  // TODO: Move this into util function since the same logic
  // is used in useCanonicalUrl();
  const urlSlug = repoBranches.branches.find((br) => br.gitBranchName === branch)?.urlSlug ?? branch;

  const { project } = metadata;

  if (isBrowser && template !== 'feature-not-avail') {
    const breadcrumbInfo = {
      parentPathsSlug: parentPaths[slug],
      queriedCrumbs: queriedCrumbs,
      siteTitle: siteTitle,
      slug: slug,
      pageTitle: pageTitle,
    };

    const pageInfo = {
      project: project,
      urlSlug: urlSlug,
      siteBasePrefix: siteBasePrefix,
    };

    sessionStorage.setItem('breadcrumbInfo', JSON.stringify(breadcrumbInfo));
    sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo));
  }

  return (
    <>
      <TabProvider selectors={page?.options?.selectors}>
        <InstruqtProvider hasLabDrawer={page?.options?.instruqt}>
          <Widgets
            location={location}
            pageTitle={pageTitle}
            slug={slug}
            isInPresentationMode={isInPresentationMode}
            template={template}
          >
            <ImageContextProvider images={props.data?.pageImage?.images ?? []}>
              <FootnoteContext.Provider value={{ footnotes }}>
                <PageContext.Provider value={{ page, template, slug, options: page?.options }}>
                  <div id="template-container">
                    <Template {...props} useChatbot={useChatbot}>
                      {pageNodes.map((child, index) => (
                        <ComponentFactory
                          key={index}
                          metadata={metadata}
                          nodeData={child}
                          page={page}
                          template={template}
                          slug={slug}
                        />
                      ))}
                    </Template>
                  </div>
                </PageContext.Provider>
              </FootnoteContext.Provider>
            </ImageContextProvider>
          </Widgets>
        </InstruqtProvider>
      </TabProvider>
      {!isInPresentationMode && (
        <div data-testid="consistent-footer" id="footer-container">
          <SuspenseHelper fallback={null}>
            <LazyFooter />
          </SuspenseHelper>
        </div>
      )}
      <Global
        styles={css`
          #template-container *:not(:is(code, code *)) {
            font-family: ${fontFamily};
          }
        `}
      />
    </>
  );
};

DocumentBody.propTypes = {
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    page: PropTypes.shape({
      children: PropTypes.array,
      options: PropTypes.object,
    }).isRequired,
  }).isRequired,
};

export default DocumentBody;

export const Head = ({ pageContext, data }) => {
  const { slug, template, repoBranches } = pageContext;
  const pageAst = data.page?.ast;

  if (!pageAst) {
    throw new Error('Gatsby Head is missing important page AST');
  }

  const pageNodes = getNestedValue(['children'], pageAst) || [];

  const meta = getMetaFromDirective('section', pageNodes, 'meta');
  const twitter = getMetaFromDirective('section', pageNodes, 'twitter');

  const metadata = useSnootyMetadata();

  const lookup = slug === '/' ? 'index' : slug;
  const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata));
  const siteTitle = getSiteTitle(metadata);

  const isDocsLandingHomepage = metadata.project === 'landing' && template === 'landing';
  const needsBreadcrumbs = template === 'document' || template === undefined;

  // Retrieves the canonical URL based on certain situations
  // i.e. eol'd, non-eol'd, snooty.toml or ..metadata:: directive (highest priority)
  const canonical = useCanonicalUrl(meta, metadata, slug, repoBranches);

  return (
    <>
      <SEO
        canonical={canonical}
        pageTitle={pageTitle}
        siteTitle={siteTitle}
        showDocsLandingTitle={isDocsLandingHomepage && slug === '/'}
        slug={slug}
      />
      {meta.length > 0 && meta.map((c, i) => <Meta key={`meta-${i}`} nodeData={c} />)}
      {twitter.length > 0 && twitter.map((c) => <Twitter {...c} />)}
      {isDocsLandingHomepage && <DocsLandingSD />}
      {needsBreadcrumbs && <BreadcrumbSchema slug={slug} />}
    </>
  );
};

export const query = graphql`
  query ($page_id: String, $slug: String) {
    page(id: { eq: $page_id }) {
      ast
    }
    pageImage(slug: { eq: $slug }) {
      slug
      images {
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED, formats: [WEBP], placeholder: NONE)
        }
        relativePath
      }
    }
  }
`;
