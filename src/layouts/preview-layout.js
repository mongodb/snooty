import React from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import ContentTransition from '../components/ContentTransition';
import PreviewHeader from '../components/Header/preview-header';
import { Sidenav } from '../components/Sidenav';
import SiteMetadata from '../components/site-metadata';
import RootProvider from '../components/RootProvider';
import { getTemplate } from '../utils/get-template';
import { useDelightedSurvey } from '../hooks/useDelightedSurvey';
import { theme } from '../theme/docsTheme';
import useSnootyMetadata from '../utils/use-snooty-metadata';

// These fonts are ported over from @mdb/flora design system repo
// They are used on the content areas and are not included in Snooty itself
// Without consistent-nav, this is needed to keep the experience the same for the content writers' previews
const AKZIDENZ_FAMILY = 'Akzidenz-Grotesk Std';
const EUCLID_CIRCULAR_FAMILY = 'Euclid Circular A';
const MONGODB_VALUE_SERIF_FAMILY = 'MongoDB Value Serif';
const SOURCE_CODE_PRO_FAMILY = 'Source Code Pro';

const FONT_SRCS = {
  [AKZIDENZ_FAMILY]: {
    light: 'https://static.mongodb.com/com/fonts/akzidenzgroteskbq_light-webfont.woff2',
    medium: 'https://static.mongodb.com/com/fonts/akzidenzgroteskbq_medium-webfont.woff2',
  },
  [EUCLID_CIRCULAR_FAMILY]: {
    regular: 'https://static.mongodb.com/com/fonts/EuclidCircularA-Regular-WebXL.woff2',
    medium: 'https://static.mongodb.com/com/fonts/EuclidCircularA-Medium-WebXL.woff2',
  },
  [MONGODB_VALUE_SERIF_FAMILY]: {
    regular: 'https://static.mongodb.com/com/fonts/MongoDBValueSerif-Regular.woff2',
    medium: 'https://static.mongodb.com/com/fonts/MongoDBValueSerif-Medium.woff2',
    bold: 'https://static.mongodb.com/com/fonts/MongoDBValueSerif-Bold.woff2',
  },
  [SOURCE_CODE_PRO_FAMILY]: {
    regular: 'https://static.mongodb.com/com/fonts/SourceCodePro-Regular.ttf',
    medium: 'https://static.mongodb.com/com/fonts/SourceCodePro-Medium.ttf',
  },
};

const globalCSS = css`
  body {
    font-size: 16px;
    line-height: 24px;
  }

  .hidden {
    display: inherit !important;
    height: 0;
    margin: 0;
    padding: 0;
    visibility: hidden !important;
    width: 0;
  }

  .header-buffer {
    scroll-margin-top: ${theme.header.navbarScrollOffset};
  }

  ${'' /* Originally from docs-tools navbar.css */}
  img.hide-medium-and-up,
  img.show-medium-and-up {
    max-width: 100%;
  }
  .hide-medium-and-up {
    display: none !important;
  }
  .show-medium-and-up {
    display: block !important;
  }
  @media (max-width: 767px) {
    .hide-medium-and-up {
      display: block !important;
    }
    .show-medium-and-up {
      display: none !important;
    }
  }

  /* Fonts that are usually provided by flora through consistent-nav */
  @font-face {
    font-family: ${AKZIDENZ_FAMILY};
    src: url(${FONT_SRCS[AKZIDENZ_FAMILY].light}) format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: ${AKZIDENZ_FAMILY};
    src: url(${FONT_SRCS[AKZIDENZ_FAMILY].medium}) format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: ${EUCLID_CIRCULAR_FAMILY};
    src: url(${FONT_SRCS[EUCLID_CIRCULAR_FAMILY].regular}) format('woff2');
    font-weight: normal;
    font-display: swap;
  }

  @font-face {
    font-family: ${EUCLID_CIRCULAR_FAMILY};
    src: url(${FONT_SRCS[EUCLID_CIRCULAR_FAMILY].medium}) format('woff2');
    font-weight: 500;
    font-display: swap;
  }

  @font-face {
    font-family: ${MONGODB_VALUE_SERIF_FAMILY};
    src: url(${FONT_SRCS[MONGODB_VALUE_SERIF_FAMILY].regular}) format('woff2');
    font-weight: normal;
    font-display: swap;
  }

  @font-face {
    font-family: ${MONGODB_VALUE_SERIF_FAMILY};
    src: url(${FONT_SRCS[MONGODB_VALUE_SERIF_FAMILY].medium}) format('woff2');
    font-weight: 500;
    font-display: swap;
  }

  @font-face {
    font-family: ${MONGODB_VALUE_SERIF_FAMILY};
    src: url(${FONT_SRCS[MONGODB_VALUE_SERIF_FAMILY].bold}) format('woff2');
    font-weight: bold;
    font-display: swap;
  }

  @font-face {
    font-family: ${SOURCE_CODE_PRO_FAMILY};
    src: url(${FONT_SRCS[SOURCE_CODE_PRO_FAMILY].regular}) format('truetype');
    font-weight: normal;
    font-display: swap;
  }

  @font-face {
    font-family: ${SOURCE_CODE_PRO_FAMILY};
    src: url(${FONT_SRCS[SOURCE_CODE_PRO_FAMILY].medium}) format('truetype');
    font-weight: 500;
    font-display: swap;
  }
`;

const GlobalGrid = styled('div')`
  display: grid;
  grid-template-areas:
    'header header'
    'sidenav contents';
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
`;

const DefaultLayout = ({
  children,
  pageContext: { page, slug, repoBranches, template, associatedReposInfo, isAssociatedProduct },
}) => {
  const { sidenav } = getTemplate(template);
  const { chapters, guides, publishedBranches, slugToTitle, title, toctree, eol } = useSnootyMetadata();

  const pageTitle = React.useMemo(() => page?.options?.title || slugToTitle?.[slug === '/' ? 'index' : slug], [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  useDelightedSurvey(slug);

  return (
    <>
      <Global styles={globalCSS} />
      <SiteMetadata siteTitle={title} />
      <RootProvider
        slug={slug}
        repoBranches={repoBranches}
        associatedReposInfo={associatedReposInfo}
        headingNodes={page?.options?.headings}
        selectors={page?.options?.selectors}
        isAssociatedProduct={isAssociatedProduct}
      >
        <GlobalGrid>
          <PreviewHeader sidenav={sidenav} />
          {sidenav && (
            <Sidenav
              chapters={chapters}
              guides={guides}
              page={page}
              pageTitle={pageTitle}
              publishedBranches={publishedBranches}
              repoBranches={repoBranches}
              siteTitle={title}
              slug={slug}
              toctree={toctree}
              eol={eol}
            />
          )}
          <ContentTransition slug={slug}>{children}</ContentTransition>
        </GlobalGrid>
      </RootProvider>
    </>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageContext: PropTypes.shape({
    chapters: PropTypes.object,
    guides: PropTypes.object,
    page: PropTypes.shape({
      options: PropTypes.object,
    }).isRequired,
    publishedBranches: PropTypes.object,
    slug: PropTypes.string,
    template: PropTypes.string,
  }).isRequired,
};

export default DefaultLayout;
