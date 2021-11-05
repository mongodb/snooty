import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';

const Container = styled('div')`
  background-color: ${uiColors.gray.light3};
`;

const Chapters = ({ metadata, nodeData: { children } }) => {
  return (
    <Container>
      {children.map((child, i) => (
        <ComponentFactory key={i} metadata={metadata} nodeData={child} />
      ))}
    </Container>
  );
};

Chapters.propTypes = {
  metadata: PropTypes.object.isRequired,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Chapters;
