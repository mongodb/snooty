import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import MainColumn from '../components/MainColumn';
import { theme } from '../theme/docsTheme';

const Wrapper = styled(MainColumn)`
  max-width: unset;
  grid-area: main;
  overflow-x: auto;
  margin-right: 64px;
  margin-left: 75px;

  @media ${theme.screenSize.upToMedium} {
    margin: ${theme.size.default} ${theme.size.medium} ${theme.size.xlarge} !important;
  }
`;

const DocumentContainer = styled('div')`
  display: grid;
  grid-template-areas: 'main';
`;

const Changelog = ({ children }) => (
  <DocumentContainer>
    <Wrapper>{children}</Wrapper>
  </DocumentContainer>
);

Changelog.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default Changelog;
