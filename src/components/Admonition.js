import React from 'react';
import PropTypes from 'prop-types';
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

const Admonition = ({ nodeData: { argument, children, name }, ...rest }) => {
  let title = getPlaintext(argument);
  if (name === 'see') {
    title = `See: ${title}`;
  } else if (name === 'seealso') {
    title = `See also: ${title}`;
  }

  return (
    <Callout title={title} variant={admonitionMap[name] || Variant.Note} baseFontSize={16}>
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} />
      ))}
    </Callout>
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
