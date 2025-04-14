import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';
import { CONTENT_MAX_WIDTH } from './product-landing';

const Wrapper = styled('div')`
  grid-column: 2/ -2;
  overflow-x: auto;
`;

const DocumentContainer = styled('main')`
  display: grid;
  grid-template-columns: minmax(${theme.size.xlarge}, 1fr) repeat(2, minmax(0, ${CONTENT_MAX_WIDTH / 2}px)) minmax(
      ${theme.size.xlarge},
      1fr
    );
  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: 48px 1fr 48px;
  }

  @media ${theme.screenSize.upToMedium} {
    grid-template-columns: ${theme.size.medium} 1fr ${theme.size.medium};
  }
`;

const Changelog = ({ children, offlineBanner }) => (
  <DocumentContainer>
    <Wrapper>
      {offlineBanner}
      {children}
    </Wrapper>
  </DocumentContainer>
);

Changelog.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default Changelog;
