import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@leafygreen-ui/emotion';
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

const customStyleHeader = css`
  color: #061621;
`;

const StandaloneHeader = ({ nodeData: { argument, options } }) => {
  return (
    <StyledStandaloneContainer>
      <SectionHeader customStyles={customStyleHeader}>
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
