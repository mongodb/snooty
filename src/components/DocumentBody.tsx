import React, { useState, useMemo, lazy } from 'react';
import { graphql } from 'gatsby';
import { TrackJS } from 'trackjs';
import { ImageContextProvider } from '../context/image-context';
import { usePresentationMode } from '../hooks/use-presentation-mode';
import { useCanonicalUrl } from '../hooks/use-canonical-url';
import { useIsValidVersion } from '../hooks/use-is-valid-version';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';
import { getNestedValue } from '../utils/get-nested-value';
import { getMetaFromDirective } from '../utils/get-meta-from-directive';
import { getPlaintext } from '../utils/get-plaintext';
import { getTemplate } from '../utils/get-template';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { getSiteTitle } from '../utils/get-site-title';
import { getFeatureFlags } from '../utils/feature-flags';
import { STRUCTURED_DATA_CLASSNAME, constructTechArticle } from '../utils/structured-data';
import { PageContext } from '../context/page-context';
import { useBreadcrumbs } from '../hooks/use-breadcrumbs';
import { isBrowser } from '../utils/is-browser';
import { TEMPLATE_CONTAINER_ID } from '../constants';
import { isOfflineDocsBuild } from '../utils/is-offline-docs-build';
import { getCompleteUrl, getUrl } from '../utils/url-utils';
import type { AppData, PageContext as PageContextType } from '../types/data';
import type { ASTNode, FootnoteNode, FootnoteReferenceNode, MetaNode, TwitterNode } from '../types/ast';
import { FeatureNotAvailable } from '../templates';
import OfflineBanner from './Banner/OfflineBanner';
import SEO from './SEO';
import FootnoteContext, { Footnote } from './Footnote/footnote-context';
import ComponentFactory from './ComponentFactory';
import Meta from './Meta';
import Twitter from './Twitter';
import DocsLandingSD from './StructuredData/DocsLandingSD';
import BreadcrumbSchema from './StructuredData/BreadcrumbSchema';
import { InstruqtProvider } from './Instruqt/instruqt-context';
import { SuspenseHelper } from './SuspenseHelper';
import { TabProvider } from './Tabs/tab-context';

// TrackJS is a tool that allows us to track errors and performance issues in our code.
TrackJS.install({
  token: 'c3fccd861d9b4238bfe1af83ebdec219',
  // for more configuration options, see https://docs.trackjs.com
});

// lazy load the unified footer to improve page load speed
const LazyFooter = lazy(() => import('./Footer'));

// Identify the footnotes on a page and all footnote_reference nodes that refer to them.
// Returns a map wherein each key is the footnote name, and each value is an object containing:
// - labels: the numerical label for the footnote
// - references: a list of the footnote reference ids that refer to this footnote
const getFootnotes = (nodes: ASTNode[]) => {
  const footnotes: FootnoteNode[] = findAllKeyValuePairs(nodes, 'type', 'footnote');
  const footnoteReferences: FootnoteReferenceNode[] = findAllKeyValuePairs(nodes, 'type', 'footnote_reference');
  const numAnonRefs = footnoteReferences.filter(
    (node) => !Object.prototype.hasOwnProperty.call(node, 'refname')
  ).length;
  // We label our footnotes by their index, regardless of their names to
  // circumvent cases such as [[1], [#], [2], ...]
  return footnotes.reduce<Record<string, Footnote>>((map, footnote, index) => {
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
const getNamedFootnoteReferences = (footnoteReferences: FootnoteReferenceNode[], refname: string) => {
  return footnoteReferences.filter((node) => node.refname === refname).map((node) => node.id);
};

// They are used infrequently, but here we match an anonymous footnote to its reference.
// The nth footnote on a page is associated with the nth reference on the page. Since
// anon footnotes and footnote references are anonymous, we assume a 1:1 pairing, and
// have no need to query nodes. If there are more anonymous footnotes than references,
// we may return an empty array
const getAnonymousFootnoteReferences = (index: number, numAnonRefs: number) => {
  return index > numAnonRefs ? [] : [`id${index + 1}`];
};

export type DocumentBodyProps = {
  data: AppData;
  pageContext: PageContextType;
};

const DocumentBody = (props: DocumentBodyProps) => {
  const { data, pageContext } = props;
  const page = data?.page?.ast;
  const { slug, template, repoBranches } = pageContext;
  const tabsMainColumn = page?.options?.['tabs-selector-position'] === 'main';
  const { isUnifiedToc } = getFeatureFlags();
  const isValidVersion = useIsValidVersion();

  const initialization = () => {
    const pageNodes: ASTNode[] = getNestedValue(['children'], page) || [];
    const footnotes = getFootnotes(pageNodes);

    return { pageNodes, footnotes };
  };

  const [{ pageNodes, footnotes }] = useState(initialization);

  const metadata = useSnootyMetadata();
  const lookup = slug === '/' ? 'index' : slug;
  const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata)) || 'MongoDB Documentation';

  let { Template, useChatbot } = getTemplate(template);

  // Checks to see if the version is valid only for Unified TOC, if not valid, we assigned the FeatureNotAvailable as the Template at runtime.
  if (isUnifiedToc && !isValidVersion) {
    Template = FeatureNotAvailable;
  }

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

  const OfflineBannerComponent = useMemo(() => {
    if (!isOfflineDocsBuild) return <></>;
    const currentBranch = repoBranches.branches.find((repoBranch) => repoBranch.gitBranchName === branch);
    const currentBranchPrefix =
      currentBranch?.urlSlug ?? currentBranch?.urlAliases?.[0] ?? currentBranch?.gitBranchName ?? '';
    return (
      <OfflineBanner
        linkUrl={getCompleteUrl(getUrl(currentBranchPrefix, project, repoBranches.siteBasePrefix, slug))}
        template={template}
      />
    );
  }, [branch, project, repoBranches.branches, repoBranches.siteBasePrefix, slug, template]);

  return (
    <>
      <TabProvider selectors={page?.options?.selectors} defaultTabs={page?.options?.default_tabs}>
        <InstruqtProvider hasLabDrawer={page?.options?.instruqt}>
          <ImageContextProvider images={props.data?.pageImage?.images ?? []}>
            <FootnoteContext.Provider value={{ footnotes }}>
              <PageContext.Provider value={{ page, template, slug, options: page?.options, tabsMainColumn }}>
                <div id={TEMPLATE_CONTAINER_ID}>
                  <Template {...props} useChatbot={useChatbot} offlineBanner={OfflineBannerComponent}>
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
        </InstruqtProvider>
      </TabProvider>
      {!isInPresentationMode && (
        <div data-testid="consistent-footer" id="footer-container">
          <SuspenseHelper fallback={null}>
            <LazyFooter />
          </SuspenseHelper>
        </div>
      )}
    </>
  );
};

export default DocumentBody;

export type HeadProps = {
  data: AppData;
  pageContext: PageContextType;
};

export const Head = ({ pageContext, data }: HeadProps) => {
  const { slug, template, repoBranches } = pageContext;
  const pageAst = data.page?.ast;

  if (!pageAst) {
    throw new Error('Gatsby Head is missing important page AST');
  }

  const pageNodes = getNestedValue(['children'], pageAst) || [];

  const meta: MetaNode[] = getMetaFromDirective('section', pageNodes, 'meta');
  const twitter: TwitterNode[] = getMetaFromDirective('section', pageNodes, 'twitter');

  const metadata = useSnootyMetadata();

  const lookup = slug === '/' ? 'index' : slug;
  const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata));
  const siteTitle = getSiteTitle(metadata);

  const isDocsLandingHomepage = metadata.project === 'landing' && template === 'landing' && slug === '/';
  const needsBreadcrumbs = template === 'document' || template === undefined;

  // Retrieves the canonical URL based on certain situations
  // i.e. eol'd, non-eol'd, snooty.toml or ..metadata:: directive (highest priority)
  const canonical = useCanonicalUrl(meta, metadata, slug, repoBranches);
  const noIndexing = repoBranches.branches.find((br) => br.gitBranchName === metadata.branch)?.noIndexing ?? false;

  // construct Structured Data
  const techArticleSd = useMemo(() => {
    if (['product-landing', 'landing', 'search', 'errorpage', 'drivers-index'].includes(template)) {
      return;
    }
    const techArticle = constructTechArticle({ facets: data.page.facets || [], pageTitle });
    return techArticle.isValid() ? techArticle : undefined;
  }, [data.page.facets, pageTitle, template]);

  return (
    <>
      <SEO
        canonical={canonical}
        pageTitle={pageTitle}
        siteTitle={siteTitle}
        showDocsLandingTitle={isDocsLandingHomepage && slug === '/'}
        slug={slug}
        noIndexing={noIndexing}
      />
      {meta.length > 0 && meta.map((c, i) => <Meta key={`meta-${i}`} nodeData={c} />)}
      {twitter.length > 0 && twitter.map((t) => <Twitter nodeData={t} />)}
      {isDocsLandingHomepage && <DocsLandingSD />}
      {needsBreadcrumbs && <BreadcrumbSchema slug={slug} />}
      {techArticleSd && (
        <script className={STRUCTURED_DATA_CLASSNAME} id={'tech-article-sd'} type="application/ld+json">
          {techArticleSd.toString()}
        </script>
      )}
    </>
  );
};

export const query = graphql`
  query ($page_id: String, $slug: String) {
    page(id: { eq: $page_id }) {
      ast
      facets
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
