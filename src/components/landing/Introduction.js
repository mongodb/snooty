import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import ComponentFactory from '../ComponentFactory';

const Introduction = ({ nodeData: { children }, ...rest }) => {
  const { screenSize, fontSize, size } = useTheme();

  const StyledIntroduction = styled('div')`
    .button {
      font-size: ${fontSize.default};
      height: unset;
      margin-bottom: ${size.default};
      margin-right: ${size.default};
      min-height: ${size.large};
    }
    .button + p {
      display: inline-block;

      a:after {
        content: ' →';
      }
    }
    @media ${screenSize.upToMedium} {
      .button {
        margin: 0px;
      }
      .button + p {
        display: block;
        margin: ${size.default} 0px;
      }
    }
  `;
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
