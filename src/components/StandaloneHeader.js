import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';
import SectionHeader from './SectionHeader';
import Link from './Link';

const StyledStandaloneContainer = styled.div`
  align-items: center;
  column-gap: 16px;
  display: flex;
  margin-bottom: 12px;

  @media ${theme.screenSize.mediumAndUp} {
    margin-bottom: 24px;
  }
`;

const customStyleHeader = (darkMode) => css`
  color: ${({ darkMode }) => (darkMode ? palette.gray.light2 : palette.black)};
`;

const StandaloneHeader = ({ nodeData: { argument, options } }) => {
  const { darkMode } = useDarkMode();
  return (
    <StyledStandaloneContainer>
      <SectionHeader customStyles={customStyleHeader(darkMode)}>
        {argument.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} />
        ))}
      </SectionHeader>
      <Link to={options.url} showLinkArrow={true}>
        {options.cta}
      </Link>
    </StyledStandaloneContainer>
  );
};

StandaloneHeader.prototype = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      columns: PropTypes.number,
    }),
  }).isRequired,
};

export default StandaloneHeader;
