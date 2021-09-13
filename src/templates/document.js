import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Breadcrumbs from '../components/Breadcrumbs';
import Contents from '../components/Contents';
import InternalPageNav from '../components/InternalPageNav';
import MainColumn from '../components/MainColumn';
import RightColumn from '../components/RightColumn';
import TabSelectors from '../components/TabSelectors';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { getNestedValue } from '../utils/get-nested-value';

const DocumentContainer = styled('div')`
  display: grid;
  grid-template-areas: 'main right';
`;

const StyledMainColumn = styled(MainColumn)`
  grid-area: main;
`;

const StyledRightColumn = styled(RightColumn)`
  grid-area: right;
`;

const Document = ({
  children,
  pageContext: {
    slug,
    page,
    metadata: { parentPaths, slugToTitle: slugTitleMapping, title, toctreeOrder },
  },
}) => {
  const { project } = useSiteMetadata();
  const pageOptions = page?.options;
  const showPrevNext = !(pageOptions && pageOptions.noprevnext === '');
  const isLanding = project === 'landing';
  const breadcrumbsPageTitle = isLanding ? slugTitleMapping[slug] : null;
  const breadcrumbsHomeUrl = isLanding ? '/' : null;

  return (
    <DocumentContainer>
      <StyledMainColumn>
        <div className="body">
          <Breadcrumbs
            homeUrl={breadcrumbsHomeUrl}
            pageTitle={breadcrumbsPageTitle}
            parentPaths={getNestedValue([slug], parentPaths)}
            siteTitle={title}
            slug={slug}
          />
          {children}
          {showPrevNext && (
            <InternalPageNav slug={slug} slugTitleMapping={slugTitleMapping} toctreeOrder={toctreeOrder} />
          )}
        </div>
      </StyledMainColumn>
      <StyledRightColumn>
        <TabSelectors />
        <Contents displayOnDesktopOnly={true} />
      </StyledRightColumn>
    </DocumentContainer>
  );
};

Document.propTypes = {
  pageContext: PropTypes.shape({
    page: PropTypes.shape({
      children: PropTypes.array,
      options: PropTypes.object,
    }).isRequired,
    parentPaths: PropTypes.arrayOf(PropTypes.string),
    slug: PropTypes.string.isRequired,
    slugTitleMapping: PropTypes.shape({
      [PropTypes.string]: PropTypes.string,
    }),
    toctree: PropTypes.object,
    toctreeOrder: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Document;
