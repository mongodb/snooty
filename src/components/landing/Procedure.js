import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import { uiColors } from '@leafygreen-ui/palette';
import { css } from '@emotion/core';

const Procedure = ({ nodeData: { children }, ...rest }) => {
  return (
    <div
      className="left-column"
      css={css`
        .landing-step {
          padding-left: 50px;
        }
        .landing-step:not(.landing-step:last-child) {
          border-style: none none none dashed;
          border-color: ${uiColors.gray.light2};
          border-width: 2px;
        }
      `}
    >
      {children.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </div>
  );
};

Procedure.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Procedure;
