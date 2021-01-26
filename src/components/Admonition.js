import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Callout, { Variant } from '@leafygreen-ui/callout';
import ComponentFactory from './ComponentFactory';
import { getPlaintext } from '../utils/get-plaintext';

export const admonitionMap = {
  example: Variant.Example,
  important: Variant.Important,
  note: Variant.Note,
  tip: Variant.Tip,
  see: Variant.Tip,
  seealso: Variant.Tip,
  warning: Variant.Warning,
};

const StyledCallout = styled(Callout)`
  /* Add margin to right so drop shadow is visible */
  margin: 24px 3px 24px 0;

  /* Add margins below all child elements in the callout */
  /* TODO: Increase margin when Callout component supports base font size of 16px */
  & > div > div > * {
    margin: 0 0 10px;
  }

  & > div > div > *:last-child {
    margin: 0;
  }
`;

const Admonition = ({ nodeData: { argument, children, name }, ...rest }) => {
  let title = getPlaintext(argument);
  if (name === 'see') {
    title = `See: ${title}`;
  } else if (name === 'seealso') {
    title = `See also: ${title}`;
  }

  return (
    <StyledCallout title={title} variant={admonitionMap[name] || Variant.Note}>
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} />
      ))}
    </StyledCallout>
  );
};

Admonition.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Admonition;
