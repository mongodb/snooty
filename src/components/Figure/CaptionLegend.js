import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';

const Caption = styled('p')`
  color: ${palette.gray.dark1};
  /* TODO: Remove !important when mongodb-docs.css is removed */
  margin-top: ${theme.size.default} !important;
  text-align: center;

  /* TODO: Remove when mongodb-docs.css is removed */
  & > code {
    color: ${palette.gray.dark1};
  }
`;

const CaptionLegend = ({ nodeData: { children }, ...rest }) => (
  <>
    {children.length > 0 && (
      <Caption>
        <ComponentFactory {...rest} nodeData={children[0]} parentNode="caption" />
      </Caption>
    )}
    {children.length > 1 && (
      <>
        {children.slice(1).map((child, index) => (
          <ComponentFactory {...rest} key={index} nodeData={child} />
        ))}
      </>
    )}
  </>
);

CaptionLegend.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default CaptionLegend;
