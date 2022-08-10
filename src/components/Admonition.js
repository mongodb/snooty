import React from 'react';
import PropTypes from 'prop-types';
import Callout, { Variant } from '@leafygreen-ui/callout';
import { cx, css } from '@leafygreen-ui/emotion';
import ComponentFactory from './ComponentFactory';
import { getPlaintext } from '../utils/get-plaintext';
import { theme } from '../theme/docsTheme';

export const admonitionMap = {
  example: Variant.Example,
  important: Variant.Important,
  note: Variant.Note,
  tip: Variant.Tip,
  see: Variant.Tip,
  seealso: Variant.Tip,
  warning: Variant.Warning,
};

const admonitionStyles = css`
  margin-top: ${theme.size.medium};
  margin-bottom: ${theme.size.medium};

  p {
    color: unset;
  }
  // remove bottom margin off the final paragraph in a callout,
  // similarly remove the bottom margin off lists and list items so that
  // the spacing looks proper on those callouts
  ul:last-of-type,
  ol:last-of-type,
  li:last-of-type > p,
  p:last-of-type {
    margin-bottom: 0px;
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
    <Callout
      className={cx(admonitionStyles)}
      title={title}
      variant={admonitionMap[name] || Variant.Note}
      baseFontSize={16}
    >
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
