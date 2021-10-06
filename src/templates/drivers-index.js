import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';
import Breadcrumbs from '../components/Breadcrumbs';
import MainColumn from '../components/MainColumn';

const DocumentContainer = styled('div')`
  display: grid;
  grid-template-areas: 'left main right';
  grid-template-columns: 1fr minmax(${theme.size.xlarge}, auto) 1fr;
`;

const StyledMainColumn = styled(MainColumn)`
  grid-area: main;
  overflow-x: scroll;
`;

const DriversIndex = ({
  children,
  pageContext: {
    metadata: { title, parentPaths },
    slug,
  },
}) => (
  <DocumentContainer>
    <StyledMainColumn>
      <div className="body">
        <Breadcrumbs parentPaths={parentPaths.slug} siteTitle={title} slug={slug} />
        {children}
      </div>
    </StyledMainColumn>
  </DocumentContainer>
);

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
