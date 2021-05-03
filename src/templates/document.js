import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Breadcrumbs from '../components/Breadcrumbs';
import Contents from '../components/Contents';
import InternalPageNav from '../components/InternalPageNav';
import MainColumn from '../components/MainColumn';
import RightColumn from '../components/RightColumn';
import Sidenav from '../components/Sidenav';
import TabSelectors from '../components/TabSelectors';
import { TEMPLATE_CLASSNAME } from '../constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { getNestedValue } from '../utils/get-nested-value';

const DocumentContainer = styled('div')`
  display: grid;
  grid-template-areas: 'main right';
  grid-template-columns: minmax(0px, 830px) auto;
`;

const MainBody = styled('div')`
  margin-left: 25px;
`;

const StyledMainColumn = styled(MainColumn)`
  grid-area: main;
`;

const StyledRightColumn = styled(RightColumn)`
  grid-area: right;
`;

const Document = ({
  children,
  className,
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
    <>
      <Sidenav page={page} slug={slug} />
      <DocumentContainer className={`${TEMPLATE_CLASSNAME} ${className}`}>
        <StyledMainColumn>
          <MainBody className="body">
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
          </MainBody>
        </StyledMainColumn>
        <StyledRightColumn>
          <TabSelectors />
          <Contents />
        </StyledRightColumn>
      </DocumentContainer>
    </>
  );
};

Document.propTypes = {
  className: PropTypes.string,
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
