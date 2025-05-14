import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import ComponentFactory from '../ComponentFactory';

const enumtypeMap = {
  arabic: '1',
  loweralpha: 'a',
  upperalpha: 'A',
  lowerroman: 'i',
  upperroman: 'I',
};

const listStyles = css`
  margin-top: 0px;
`;

const List = ({ nodeData: { children, enumtype, startat }, ...rest }) => {
  const ListTag = enumtype === 'unordered' ? 'ul' : 'ol';
  const attributes = {};
  if (enumtype in enumtypeMap) {
    attributes.type = enumtypeMap[enumtype];
  }
  if (startat) {
    attributes.start = startat;
  }
  return (
    <ListTag className={cx(listStyles)} {...attributes}>
      {children.map((listChild, index) => (
        <ComponentFactory {...rest} nodeData={listChild} key={index} />
      ))}
    </ListTag>
  );
};

List.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    enumtype: PropTypes.string.isRequired,
    startat: PropTypes.number,
  }).isRequired,
};

export default List;
