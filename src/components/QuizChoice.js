import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { InlineCode } from '@leafygreen-ui/typography';
import ComponentFactory from './ComponentFactory';

const QuizChoice = ({ nodeData: { children } }) => {
  return (
    <QuizChoice>
      {children.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
    </QuizChoice>
  );
};

QuizChoice.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default QuizChoice;
