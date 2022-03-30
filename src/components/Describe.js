import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import ComponentFactory from './ComponentFactory.js';

const Describe = ({ nodeData: { argument, children }, ...rest }) => (
  <dl>
    <dt>
      <code
        css={css`
          /* TODO: Remove when mongodb-docs.css is removed */
          font-weight: normal;
        `}
      >
        {argument.map((arg, i) => (
          <ComponentFactory {...rest} key={i} nodeData={arg} />
        ))}
      </code>
    </dt>
    <dd>
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} />
      ))}
    </dd>
  </dl>
);

Describe.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Describe;
