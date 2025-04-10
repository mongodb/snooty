import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';

const StyledIntroduction = styled('div')`
  .button {
    margin: 0 ${theme.size.default} ${theme.size.default} 0;
    min-height: ${theme.size.large};
  }
  .button + p {
    display: inline-block;
  }
  @media ${theme.screenSize.upToMedium} {
    margin-bottom: ${theme.size.default};

    .button {
      margin-bottom: 0px;
      margin-right: 0px;
    }
    .button + p {
      display: block;
      margin-top: ${theme.size.default};
      margin-bottom: 0;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }
`;

const Introduction = ({ nodeData: { children }, ...rest }) => {
  return (
    <StyledIntroduction className="introduction">
      {children.map((child, i) => (
        <ComponentFactory nodeData={child} key={i} showLinkArrow={true} {...rest} />
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
