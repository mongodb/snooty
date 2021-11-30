import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from './index';

const StyledIntroduction = styled('div')`
  .button {
    font-size: ${theme.fontSize.default};
    margin: ${theme.size.medium} ${theme.size.default} ${theme.size.default} 0;
    min-height: ${theme.size.large};
  }
  .button + p {
    display: inline-block;

    a:after {
      content: ' ➔';
    }
  }
  @media ${theme.screenSize.upToMedium} {
    .button {
      margin-bottom: 0px;
      margin-right: 0px;
    }
    .button + p {
      display: block;
      margin: ${theme.size.default} 0px;
    }
  }
`;

const Introduction = ({ nodeData: { children }, ...rest }) => {
  return (
    <StyledIntroduction className="introduction">
      {children.map((child, i) => (
        <ComponentFactory nodeData={child} key={i} {...rest} />
      ))}
    </StyledIntroduction>
  );
};

Introduction.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default Introduction;
