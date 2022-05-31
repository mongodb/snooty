import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ComponentFactory from '../ComponentFactory';

const Table = styled('table')`
  border-spacing: 0;
  font-size: ${({ theme }) => `${theme.fontSize.small}`};
  line-height: ${({ theme }) => `${theme.size.medium}`};
  margin: ${({ theme }) => `${theme.size.medium} 0`};
  max-width: 100%;

  tbody {
    vertical-align: top;
  }
`;

const FieldList = ({ nodeData: { children }, ...rest }) => (
  <Table>
    <colgroup>
      <col className="field-name" />
      <col className="field-body" />
    </colgroup>
    <tbody>
      {children.map((element, index) => (
        <ComponentFactory {...rest} nodeData={element} key={index} />
      ))}
    </tbody>
  </Table>
);

FieldList.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default FieldList;
