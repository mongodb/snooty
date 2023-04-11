import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Breadcrumbs from '../components/Breadcrumbs';
import Contents from '../components/Contents';
import InternalPageNav from '../components/InternalPageNav';
import MainColumn from '../components/MainColumn';
import RightColumn from '../components/RightColumn';
import TabSelectors from '../components/Tabs/TabSelectors';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import AssociatedVersionSelector from '../components/AssociatedVersionSelector';

const DocumentContainer = styled('div')`
  display: grid;
  grid-template-areas: 'main right';
  grid-template-columns: minmax(0, auto) 1fr;
`;

const StyledMainColumn = styled(MainColumn)`
  grid-area: main;
  max-width: 775px;
  overflow-x: auto;
`;

const StyledRightColumn = styled(RightColumn)`
  grid-area: right;
`;

const Document = ({ children, pageContext: { slug, page, repoBranches, isAssociatedProduct } }) => {
  const { project } = useSiteMetadata();
  const { slugToTitle, title, toctreeOrder } = useSnootyMetadata();
  const pageOptions = page?.options;
  const showPrevNext = !(pageOptions?.noprevnext === '' || pageOptions?.template === 'guide');
  const isLanding = project === 'landing';
  const breadcrumbsPageTitle = isLanding ? slugToTitle[slug] : null;
  const breadcrumbsHomeUrl = isLanding ? '/' : null;

  return (
    <DocumentContainer>
      <StyledMainColumn>
        <div className="body">
          <Breadcrumbs homeUrl={breadcrumbsHomeUrl} pageTitle={breadcrumbsPageTitle} siteTitle={title} slug={slug} />
          {children}
          {showPrevNext && <InternalPageNav slug={slug} slugTitleMapping={slugToTitle} toctreeOrder={toctreeOrder} />}
        </div>
      </StyledMainColumn>
      <StyledRightColumn>
        {isAssociatedProduct && <AssociatedVersionSelector />}
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
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default Document;
