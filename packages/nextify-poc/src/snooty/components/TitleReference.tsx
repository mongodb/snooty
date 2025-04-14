import React from 'react';
import PropTypes from 'prop-types';
import { titleReferenceNode } from '../types/ast';

export type TitleReferenceProps = {
  nodeData: titleReferenceNode;
}

const TitleReference = ({
  nodeData: {
    children: [{ value }],
  },
}: TitleReferenceProps) => <cite>{value}</cite>;

TitleReference.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default TitleReference;
