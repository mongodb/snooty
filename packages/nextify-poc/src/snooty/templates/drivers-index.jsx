import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import Breadcrumbs from '../components/Breadcrumbs';
import MainColumn from '../components/MainColumn';

const DocumentContainer = styled('div')`
  display: grid;
  grid-template-areas: 'main right';
  grid-template-columns: minmax(${theme.size.xlarge}, auto) 1fr;
`;

const StyledMainColumn = styled(MainColumn)`
  grid-area: main;
`;

const DriversIndex = ({ children, pageContext: { slug }, offlineBanner }) => {
  const { title, parentPaths } = useSnootyMetadata();
  return (
    <DocumentContainer>
      <StyledMainColumn>
        <div className="body">
          {offlineBanner}
          <Breadcrumbs parentPaths={parentPaths?.slug} siteTitle={title} slug={slug} />
          {children}
        </div>
      </StyledMainColumn>
    </DocumentContainer>
  );
};

DriversIndex.propTypes = {
  pageContext: PropTypes.shape({
    metadata: PropTypes.shape({
      title: PropTypes.string.isRequired,
      parentPaths: PropTypes.object,
    }),
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default DriversIndex;
