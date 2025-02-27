import React from 'react';
import PropTypes from 'prop-types';
import { cx, css } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import { getPlaintext } from '../utils/get-plaintext';
import ComponentFactory from './ComponentFactory';

const indentedContainerStyle = css`
  padding-left: 24px;
`;

const labelStyle = css`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SeeAlso = ({ nodeData: { argument, children }, ...rest }) => {
  let title = getPlaintext(argument);
  if (title.length) {
    title = ` ${title}`;
  }

  return (
    <section>
      <Body className={cx(labelStyle)}>See also:{title}</Body>
      <div className={cx(indentedContainerStyle)}>
        {children.map((child, i) => (
          <ComponentFactory {...rest} key={i} nodeData={child} />
        ))}
      </div>
    </section>
  );
};

SeeAlso.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default SeeAlso;
