import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withPrefix, graphql } from 'gatsby';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { ImageContextProvider } from '../../../../src/context/image-context';
import { usePresentationMode } from '../../../../src/hooks/use-presentation-mode';
import { useCanonicalUrl } from '../../../../src/hooks/use-canonical-url';
import { findAllKeyValuePairs } from '../../../../src/utils/find-all-key-value-pairs';
import { getNestedValue } from '../../../../src/utils/get-nested-value';
import { getMetaFromDirective } from '../../../../src/utils/get-meta-from-directive';
import { getPlaintext } from '../../../../src/utils/get-plaintext';
import { getTemplate } from '../../../../src/utils/get-template';
import useSnootyMetadata from '../../../../src/utils/use-snooty-metadata';
import { isBrowser } from '../../../../src/utils/is-browser';
import Widgets from '../../../../src/components/Widgets';
import SEO from '../../../../src/components/SEO';
import FootnoteContext from '../../../../src/components/Footnote/footnote-context';
import Meta from '../../../../src/components/Meta';
import Twitter from '../../../../src/components/Twitter';
import DocsLandingSD from '../../../../src/components/StructuredData/DocsLandingSD';
import BreadcrumbSchema from '../../../../src/components/StructuredData/BreadcrumbSchema';
import ComponentFactory from '../ComponentFactory';

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

const HIDE_UNIFIED_FOOTER_LOCALE = process.env['GATSBY_HIDE_UNIFIED_FOOTER_LOCALE'] === 'true';
const AVAILABLE_LANGUAGES = ['English', '简体中文'];

const DocumentBody = (props) => {
  const {
    location,
    pageContext: { page, slug, template },
  } = props;

  useEffect(() => {
    // A workaround to remove the other locale options.
    if (!HIDE_UNIFIED_FOOTER_LOCALE) {
      const footer = document.getElementById('footer-container');
      const footerUlElement = footer?.querySelector('ul[role=listbox]');
      if (footerUlElement) {
        // For DOP-4060 we only want to support English and Simple Chinese (for now)
        const availableOptions = Array.from(footerUlElement.childNodes).reduce((accumulator, child) => {
          if (AVAILABLE_LANGUAGES.includes(child.textContent)) {
            accumulator.push(child);
          }
          return accumulator;
        }, []);

        footerUlElement.innerHTML = null;
        availableOptions.forEach((child) => {
          footerUlElement.appendChild(child);
        });
      }
    }
  }, []);

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

  const isInPresentationMode = usePresentationMode()?.toLocaleLowerCase() === 'true';

  const slugForUrl = slug === '/' ? `${withPrefix('')}` : `${withPrefix(slug)}`; // handle the `/` path
  const onSelectLocale = (locale) => {
    const localeHrefMap = {
      'zh-cn': `https://mongodbcom-cdn.staging.corp.mongodb.com/zh-cn${slugForUrl}/`,
      'en-us': `https://mongodbcom-cdn.website.staging.corp.mongodb.com${slugForUrl}/`,
    };

    if (isBrowser) {
      window.location.href = localeHrefMap[locale];
    }
  };

  return (
    <>
      <Widgets
        location={location}
        pageOptions={page?.options}
        pageTitle={pageTitle}
        publishedBranches={getNestedValue(['publishedBranches'], metadata)}
        slug={slug}
        isInPresentationMode={isInPresentationMode}
        template={template}
      >
        <ImageContextProvider images={props.data?.pageImage?.images ?? []}>
          <FootnoteContext.Provider value={{ footnotes }}>
            <Template {...props} useChatbot={useChatbot}>
              {pageNodes.map((child, index) => (
                <ComponentFactory key={index} metadata={metadata} nodeData={child} page={page} slug={slug} />
              ))}
            </Template>
          </FootnoteContext.Provider>
        </ImageContextProvider>
      </Widgets>
      {!isInPresentationMode && (
        <div data-testid="consistent-footer" id="footer-container">
          <UnifiedFooter hideLocale={HIDE_UNIFIED_FOOTER_LOCALE} onSelectLocale={onSelectLocale} />
        </div>
      )}
    </>
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

export const Head = ({ pageContext }) => {
  const { slug, page, template, repoBranches } = pageContext;

  const pageNodes = getNestedValue(['children'], page) || [];

  const meta = getMetaFromDirective('section', pageNodes, 'meta');
  const twitter = getMetaFromDirective('section', pageNodes, 'twitter');

  const metadata = useSnootyMetadata();

  const lookup = slug === '/' ? 'index' : slug;
  const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata)) || 'MongoDB Documentation';
  const siteTitle = getNestedValue(['title'], metadata) || '';

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
        showDocsLandingTitle={isDocsLandingHomepage}
      />
      {meta.length > 0 && meta.map((c, i) => <Meta key={`meta-${i}`} nodeData={c} />)}
      {twitter.length > 0 && twitter.map((c) => <Twitter {...c} />)}
      {isDocsLandingHomepage && <DocsLandingSD />}
      {needsBreadcrumbs && <BreadcrumbSchema slug={slug} />}
    </>
  );
};

export const query = graphql`
  query ($slug: String) {
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