import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Callout, { Variant } from '@leafygreen-ui/callout';
import ComponentFactory from './ComponentFactory';
import { getPlaintext } from '../utils/get-plaintext';

// TODO: Update with example variant once added to LeafyGreen
export const admonitionMap = {
  example: Variant.Note,
  important: Variant.Important,
  note: Variant.Note,
  tip: Variant.Tip,
  see: Variant.Tip,
  seealso: Variant.Tip,
  warning: Variant.Warning,
};

const StyledCallout = styled(Callout)`
  margin: 24px 0;

  & p {
    margin: 0 0 12.5px;
  }

  & p:last-child {
    margin: 0;
  }
`;

const Admonition = ({ nodeData: { argument, children, name }, ...rest }) => {
  let title = getPlaintext(argument);
  if (name === 'see') {
    title = `See: ${title}`;
  } else if (name === 'seealso') {
    title = `See Also: ${title}`;
  } else if (name === 'example') {
    title = `Example: ${title}`;
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
