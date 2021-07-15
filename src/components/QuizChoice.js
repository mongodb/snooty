import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Card from '@leafygreen-ui/card';
import { InlineCode } from '@leafygreen-ui/typography';
import { uiColors } from '@leafygreen-ui/palette';
import { Radio, RadioGroup } from '@leafygreen-ui/radio-group';
import ComponentFactory from './ComponentFactory';

const StyledCard = styled(Card)`
  box-shadow: none;
  height: 56px;
  margin: auto auto 16px auto;
  padding: 15px;
`;

const StyledChoice = styled('p')`
  font-family: Akzidenz;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
`;

const Dot = styled('span')`
  height: 10px;
  width: 10px;
  background-color: #fff;
  border-color: black;
  border-radius: 50%;
  display: inline-block;
  border-style: solid;
  border-width: thin;
  margin-right: 16px;
`;

const QuizChoice = ({ nodeData: { argument, children } }) => {
  return (
    <StyledCard>
      <Dot />
      {argument.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
    </StyledCard>
  );
};

QuizChoice.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default QuizChoice;
