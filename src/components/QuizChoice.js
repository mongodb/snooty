import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';

const StyledCard = styled(Card)`
  box-shadow: none;
  margin: auto auto 16px auto;
  padding: 15px;
  ${(props) => console.log(props.anySelectedResponse)}
  ${(props) => (props.anySelectedResponse ? (props.isCorrect ? `color: red;` : `opacity: 0.5;`) : `color: blue;`)}
  &:hover {
    border-color: black;
  }
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

const ChoiceBody = styled('span')`
  margin-top: 8px !important;
`;

const ChoiceAnswer = styled('span')`
  margin-top: 8px !important;
`;

const DescriptionBody = styled('p')`
  margin-top: 8px !important;
  margin-bottom: 0px !important;

  padding-left: 26px;
`;

const AnswerDescription = (desc) => {
  return <DescriptionBody> hola caro</DescriptionBody>;
};

const QuizChoice = ({ nodeData: { argument, children } }) => {
  const [anySelectedResponse, setSelectedResponse] = useState(true);
  console.log(argument, children);
  return (
    <StyledCard anySelectedResponse={anySelectedResponse} isCorrect={false}>
      <Dot />
      {argument.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
      {anySelectedResponse && <AnswerDescription />}
    </StyledCard>
  );
};

QuizChoice.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default QuizChoice;
