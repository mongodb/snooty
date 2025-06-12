import React from 'react';
import PropTypes from 'prop-types';
import { cx, css } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';

const listParagraphStyles = css`
  ::marker {
    color: var(--font-color-primary);
  }
  & > p {
    margin-bottom: 8px;
  }
`;
const ListItem = ({ nodeData, ...rest }) => (
  <li className={cx(listParagraphStyles)}>
    {nodeData.children.map((child, index) => (
      <ComponentFactory {...rest} nodeData={child} key={index} skipPTag={false} />
    ))}
  </li>
);

ListItem.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default ListItem;
