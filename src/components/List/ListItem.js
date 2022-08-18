import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import { cx, css } from '@leafygreen-ui/emotion';

const listParagraphStyles = css`
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
