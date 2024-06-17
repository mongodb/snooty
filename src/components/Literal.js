import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { InlineCode } from '@leafygreen-ui/typography';
import ComponentFactory from './ComponentFactory';

const inlineCodeStyling = css`
  /* Unset font size so it inherits it from its context */
  font-size: unset;
  display: inline;
  background-color: var(--background-color);

  a & {
    color: inherit;
  }
`;

const StyledNavigationInlineCode = styled('code')`
  /* Used for Literals that don't need LeafyGreen's InlineCode component */
  font-family: 'Source Code Pro';
  color: unset;
`;

const Literal = ({ nodeData: { children }, formatTextOptions }) => {
  const navigationStyle = formatTextOptions?.literalEnableInline;
  const CurrInlineCode = navigationStyle ? StyledNavigationInlineCode : InlineCode;
  const { darkMode } = useDarkMode();

  return (
    <CurrInlineCode
      className={cx(navigationStyle ? '' : inlineCodeStyling)}
      style={{ '--background-color': darkMode ? palette.gray.dark4 : palette.gray.light3 }}
    >
      {children.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
    </CurrInlineCode>
  );
};

Literal.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  formatTextOptions: PropTypes.shape({
    literalEnableInline: PropTypes.bool,
  }),
};

export default Literal;
